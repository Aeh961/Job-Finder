"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applicationStatuses, normalizeWorkMode, parseCsvInput } from "@/lib/db-utils";
import { generateApplicationPacket } from "@/lib/ai";
import { extractSkillsFromResume } from "@/lib/resume";
import { scoreJobMatch } from "@/lib/scoring";
import { getCurrentUserId } from "@/lib/user-data";
import type { ApplicationStatus, BoardProvider } from "@/lib/types";

function requireText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

async function requireUserId() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/signin");
  return userId;
}

export async function signUpAction(formData: FormData) {
  const email = requireText(formData, "email").toLowerCase();
  const password = requireText(formData, "password");
  const name = String(formData.get("name") ?? "").trim() || null;
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password)
    }
  });
  redirect("/signin?created=1");
}

export async function saveProfileAction(formData: FormData) {
  const userId = await requireUserId();
  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      headline: String(formData.get("headline") ?? "").trim(),
      skills: parseCsvInput(String(formData.get("skills") ?? "")),
      desiredTitles: parseCsvInput(String(formData.get("desiredTitles") ?? "")),
      preferredLocations: parseCsvInput(String(formData.get("preferredLocations") ?? "")),
      workMode: normalizeWorkMode(String(formData.get("workMode") ?? "flexible")),
      needsSponsorship: formData.get("needsSponsorship") === "on",
      seniority: String(formData.get("seniority") ?? "").trim()
    },
    create: {
      userId,
      headline: String(formData.get("headline") ?? "").trim(),
      skills: parseCsvInput(String(formData.get("skills") ?? "")),
      desiredTitles: parseCsvInput(String(formData.get("desiredTitles") ?? "")),
      preferredLocations: parseCsvInput(String(formData.get("preferredLocations") ?? "")),
      workMode: normalizeWorkMode(String(formData.get("workMode") ?? "flexible")),
      needsSponsorship: formData.get("needsSponsorship") === "on",
      seniority: String(formData.get("seniority") ?? "").trim()
    }
  });
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function saveResumeAction(formData: FormData) {
  const userId = await requireUserId();
  const content = requireText(formData, "resumeText");
  const title = String(formData.get("title") ?? "Primary resume").trim() || "Primary resume";
  await prisma.resume.create({ data: { userId, title, content } });

  const skills = extractSkillsFromResume(content);
  if (skills.length) {
    const existing = await prisma.userProfile.findUnique({ where: { userId } });
    await prisma.userProfile.upsert({
      where: { userId },
      update: { skills: Array.from(new Set([...(existing?.skills ?? []), ...skills])) },
      create: { userId, skills, desiredTitles: [], preferredLocations: [] }
    });
  }
  revalidatePath("/resume");
  revalidatePath("/profile");
}

export async function saveEmployerAction(formData: FormData) {
  const userId = await requireUserId();
  const name = requireText(formData, "name");
  const provider = String(formData.get("boardProvider") ?? "unsupported") as BoardProvider;
  const priority = Math.max(1, Math.min(5, Number(formData.get("priority") ?? 3)));
  const employer = await prisma.employer.upsert({
    where: { name },
    update: {
      boardProvider: provider,
      boardToken: String(formData.get("boardToken") ?? "").trim() || null,
      careersUrl: String(formData.get("careersUrl") ?? "").trim() || null
    },
    create: {
      name,
      boardProvider: provider,
      boardToken: String(formData.get("boardToken") ?? "").trim() || null,
      careersUrl: String(formData.get("careersUrl") ?? "").trim() || null
    }
  });
  await prisma.userEmployerPreference.upsert({
    where: { userId_employerId: { userId, employerId: employer.id } },
    update: { priority },
    create: { userId, employerId: employer.id, priority }
  });
  revalidatePath("/employers");
}

export async function deleteEmployerPreferenceAction(formData: FormData) {
  const userId = await requireUserId();
  const employerId = requireText(formData, "employerId");
  await prisma.userEmployerPreference.delete({ where: { userId_employerId: { userId, employerId } } });
  revalidatePath("/employers");
}

export async function setJobSelectionAction(formData: FormData) {
  const userId = await requireUserId();
  const jobPostingId = requireText(formData, "jobId");
  const state = requireText(formData, "state") as "saved" | "ignored";
  await prisma.userJobSelection.upsert({
    where: { userId_jobPostingId: { userId, jobPostingId } },
    update: { state },
    create: { userId, jobPostingId, state }
  });
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobPostingId}`);
}

export async function updateApplicationStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const jobPostingId = requireText(formData, "jobId");
  const status = requireText(formData, "status") as ApplicationStatus;
  if (!applicationStatuses.includes(status)) throw new Error("Invalid application status");
  await prisma.application.upsert({
    where: { userId_jobPostingId: { userId, jobPostingId } },
    update: { status, appliedAt: status === "applied" ? new Date() : undefined },
    create: { userId, jobPostingId, status, appliedAt: status === "applied" ? new Date() : undefined }
  });
  revalidatePath("/applications");
  revalidatePath(`/jobs/${jobPostingId}`);
}

export async function generatePacketAction(formData: FormData) {
  const userId = await requireUserId();
  const jobPostingId = requireText(formData, "jobId");
  const [profile, job] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.jobPosting.findUnique({ where: { id: jobPostingId }, include: { employer: true } })
  ]);
  if (!profile || !job) throw new Error("Profile and job are required");
  const userProfile = {
    headline: profile.headline ?? "",
    skills: profile.skills,
    desiredTitles: profile.desiredTitles,
    preferredLocations: profile.preferredLocations,
    workMode: profile.workMode,
    needsSponsorship: profile.needsSponsorship,
    seniority: profile.seniority ?? "",
    interests: profile.skills
  };
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
    applyUrl: job.applyUrl ?? undefined
  };
  const match = scoreJobMatch(userProfile, normalizedJob, [{ id: job.employerId, name: job.employer.name, boardProvider: job.sourceProvider, priority: 3 }]);
  const packet = await generateApplicationPacket(userProfile, normalizedJob, match);
  await prisma.generatedApplicationPacket.create({
    data: {
      userId,
      jobPostingId,
      fitSummary: packet.fitSummary,
      tailoredResumeSummary: packet.tailoredResumeSummary,
      coverLetterDraft: packet.coverLetterDraft,
      recruiterMessage: packet.recruiterMessage,
      checklist: packet.checklist,
      provider: packet.provider
    }
  });
  revalidatePath("/packets");
  revalidatePath(`/jobs/${jobPostingId}`);
}
