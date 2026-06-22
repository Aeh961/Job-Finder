import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./db";
import { demoApplications, demoEmployers, demoJobSelections, demoJobs, demoMatches, demoProfile } from "./demo-data";
import { scoreJobMatch } from "./scoring";
import type { EmployerInput, NormalizedJob, UserProfileInput } from "./types";

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function getDashboardData() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      mode: "demo" as const,
      profile: demoProfile,
      employers: demoEmployers,
      jobs: demoJobs,
      matches: demoMatches,
      applications: demoApplications,
      selections: demoJobSelections
    };
  }

  const [profile, preferences, jobs, applications, selections] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.userEmployerPreference.findMany({ where: { userId }, include: { employer: true }, orderBy: { createdAt: "desc" } }),
    prisma.jobPosting.findMany({ include: { employer: true }, orderBy: { discoveredAt: "desc" }, take: 100 }),
    prisma.application.findMany({ where: { userId }, include: { jobPosting: { include: { employer: true } } }, orderBy: { updatedAt: "desc" } }),
    prisma.userJobSelection.findMany({ where: { userId } })
  ]);

  const userProfile: UserProfileInput = {
    headline: profile?.headline ?? "",
    skills: profile?.skills ?? [],
    desiredTitles: profile?.desiredTitles ?? [],
    preferredLocations: profile?.preferredLocations ?? [],
    workMode: profile?.workMode ?? "flexible",
    needsSponsorship: profile?.needsSponsorship ?? false,
    seniority: profile?.seniority ?? "",
    interests: profile?.skills ?? []
  };

  const employers: EmployerInput[] = preferences.map((preference) => ({
    id: preference.employer.id,
    name: preference.employer.name,
    boardProvider: preference.employer.boardProvider,
    boardToken: preference.employer.boardToken ?? undefined,
    careersUrl: preference.employer.careersUrl ?? undefined,
    website: preference.employer.website ?? undefined,
    priority: preference.priority,
    manualReviewNeeded: preference.employer.boardProvider === "unsupported"
  }));

  const normalizedJobs: NormalizedJob[] = jobs.map((job) => ({
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
  }));

  return {
    mode: "database" as const,
    profile: userProfile,
    employers,
    jobs: normalizedJobs,
    matches: normalizedJobs.map((job) => ({ job, match: scoreJobMatch(userProfile, job, employers) })),
    applications: applications.map((application) => ({
      id: application.id,
      jobId: application.jobPostingId,
      status: application.status,
      notes: application.notes ?? "",
      job: application.jobPosting
    })),
    selections: selections.map((selection) => ({ jobId: selection.jobPostingId, state: selection.state, note: selection.note ?? undefined }))
  };
}
