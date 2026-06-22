import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmailAlert } from "@/lib/email";
import { discoverJobsForEmployer } from "@/lib/jobs";
import { scoreJobMatch } from "@/lib/scoring";
import type { EmployerInput, UserProfileInput } from "@/lib/types";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threshold = Number(process.env.HIGH_MATCH_THRESHOLD ?? 80);
  const employers = await prisma.employer.findMany({ orderBy: { name: "asc" } });
  const refreshable = employers.filter((employer) => ["greenhouse", "lever"].includes(employer.boardProvider) && employer.boardToken);
  const errors: string[] = [];
  let discoveredCount = 0;

  for (const employer of refreshable) {
    try {
      const employerInput: EmployerInput = {
        id: employer.id,
        name: employer.name,
        boardProvider: employer.boardProvider,
        boardToken: employer.boardToken ?? undefined,
        careersUrl: employer.careersUrl ?? undefined,
        priority: 3
      };
      const jobs = await discoverJobsForEmployer(employerInput);
      discoveredCount += jobs.length;
      for (const job of jobs) {
        await prisma.jobPosting.upsert({
          where: { sourceProvider_externalId: { sourceProvider: job.sourceProvider, externalId: job.externalId } },
          update: {
            employerId: job.employerId,
            title: job.title,
            department: job.department,
            location: job.location,
            workMode: job.workMode,
            description: job.description,
            sourceUrl: job.sourceUrl,
            originalJobUrl: job.originalJobUrl,
            applyUrl: job.applyUrl,
            requiresVisa: job.requiresVisa,
            postedAt: job.postedAt ? new Date(job.postedAt) : undefined
          },
          create: {
            employerId: job.employerId,
            sourceProvider: job.sourceProvider,
            externalId: job.externalId,
            title: job.title,
            department: job.department,
            location: job.location,
            workMode: job.workMode,
            description: job.description,
            sourceUrl: job.sourceUrl,
            originalJobUrl: job.originalJobUrl,
            applyUrl: job.applyUrl,
            requiresVisa: job.requiresVisa,
            postedAt: job.postedAt ? new Date(job.postedAt) : undefined
          }
        });
      }
    } catch (error) {
      errors.push(`${employer.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      preferences: { include: { employer: true } }
    }
  });
  let highMatchCount = 0;

  for (const user of users) {
    if (!user.profile) continue;
    const employersForUser: EmployerInput[] = user.preferences.map((preference) => ({
      id: preference.employer.id,
      name: preference.employer.name,
      boardProvider: preference.employer.boardProvider,
      boardToken: preference.employer.boardToken ?? undefined,
      careersUrl: preference.employer.careersUrl ?? undefined,
      priority: preference.priority
    }));
    const profile: UserProfileInput = {
      headline: user.profile.headline ?? undefined,
      skills: user.profile.skills,
      desiredTitles: user.profile.desiredTitles,
      preferredLocations: user.profile.preferredLocations,
      workMode: user.profile.workMode,
      needsSponsorship: user.profile.needsSponsorship,
      seniority: user.profile.seniority ?? undefined,
      interests: user.profile.skills
    };
    const jobs = await prisma.jobPosting.findMany({
      where: { employerId: { in: user.preferences.map((preference) => preference.employerId) } },
      include: { employer: true }
    });
    const highMatches = [];
    for (const job of jobs) {
      const normalizedJob = {
        id: job.id,
        employerId: job.employerId,
        employerName: job.employer.name,
        sourceProvider: job.sourceProvider,
        externalId: job.externalId,
        title: job.title,
        department: job.department ?? undefined,
        location: job.location ?? undefined,
        workMode: job.workMode ?? undefined,
        description: job.description,
        sourceUrl: job.sourceUrl,
        originalJobUrl: job.originalJobUrl,
        applyUrl: job.applyUrl ?? undefined,
        requiresVisa: job.requiresVisa ?? undefined,
        postedAt: job.postedAt?.toISOString()
      };
      const match = scoreJobMatch(profile, normalizedJob, employersForUser);
      await prisma.jobMatch.upsert({
        where: { userId_jobPostingId: { userId: user.id, jobPostingId: job.id } },
        update: {
          score: match.score,
          whyMatched: match.whyMatched,
          missingSkills: match.missingSkills,
          suggestedNextAction: match.suggestedNextAction
        },
        create: {
          userId: user.id,
          jobPostingId: job.id,
          score: match.score,
          whyMatched: match.whyMatched,
          missingSkills: match.missingSkills,
          suggestedNextAction: match.suggestedNextAction
        }
      });
      if (match.score >= threshold) highMatches.push({ job: normalizedJob, match });
    }
    highMatchCount += highMatches.length;
    await sendEmailAlert({ jobs: highMatches, threshold, to: process.env.ALERT_EMAIL_TO ?? user.email, from: process.env.EMAIL_FROM });
  }

  return NextResponse.json({
    ok: true,
    message: "Refresh completed for Greenhouse and Lever employers.",
    trackedEmployers: employers.length,
    refreshableEmployers: refreshable.length,
    manualReviewNeeded: employers.length - refreshable.length,
    discoveredJobs: discoveredCount,
    highMatchJobs: highMatchCount,
    errors
  });
}
