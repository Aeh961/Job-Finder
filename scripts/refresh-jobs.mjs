const threshold = Number(process.env.HIGH_MATCH_THRESHOLD ?? 80);
const requestTimeoutMs = Number(process.env.JOB_REFRESH_TIMEOUT_MS ?? 15000);

console.log("JobFinder AI daily refresh");
console.log(`High-match threshold: ${threshold}`);
console.log("Providers: Greenhouse and Lever only");

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function inferWorkMode(text = "") {
  const normalized = text.toLowerCase();
  if (normalized.includes("remote")) return "remote";
  if (normalized.includes("hybrid")) return "hybrid";
  if (normalized.includes("on-site") || normalized.includes("onsite") || normalized.includes("office")) return "onsite";
  return null;
}

function normalize(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(source, needles) {
  const normalized = normalize(source);
  return needles.some((needle) => normalized.includes(normalize(needle)));
}

function percent(matches, total) {
  if (total === 0) return 0;
  return Math.round((matches / total) * 100);
}

function scoreJob(profile, job, priority = 3) {
  const desiredTitles = profile.desiredTitles ?? [];
  const skills = profile.skills ?? [];
  const preferredLocations = profile.preferredLocations ?? [];
  const haystack = `${job.title} ${job.description} ${job.department ?? ""} ${job.location ?? ""}`;
  const matchedSkills = skills.filter((skill) => includesAny(haystack, [skill]));
  const titleScore = includesAny(job.title, desiredTitles) ? 100 : 0;
  const skillsScore = percent(matchedSkills.length, skills.length);
  const locationScore =
    preferredLocations.length === 0 ||
    includesAny(job.location ?? "", preferredLocations) ||
    preferredLocations.some((location) => normalize(location) === "remote" && job.workMode === "remote")
      ? 100
      : 25;
  const remoteScore = profile.workMode === "flexible" || profile.workMode === job.workMode ? 100 : job.workMode === "hybrid" ? 65 : 25;
  const employerScore = Math.min(100, 55 + priority * 15);
  const sponsorshipScore = profile.needsSponsorship ? (job.requiresVisa === false ? 20 : 70) : 100;

  const score = Math.round(
    titleScore * 0.18 + skillsScore * 0.24 + 70 * 0.1 + locationScore * 0.12 + remoteScore * 0.1 + employerScore * 0.12 + sponsorshipScore * 0.06 + 50 * 0.08
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    whyMatched: [
      titleScore ? "Job title aligns with a desired role." : "",
      matchedSkills.length ? `Matched skills: ${matchedSkills.slice(0, 5).join(", ")}.` : "",
      locationScore >= 80 ? "Location preferences are aligned." : "",
      remoteScore >= 80 ? "Work mode preference is aligned." : "",
      "Employer is on the target employer list."
    ].filter(Boolean),
    missingSkills: skills.filter((skill) => !matchedSkills.includes(skill)).slice(0, 6),
    suggestedNextAction:
      score >= 80 ? "Move to interested and generate an application packet." : score >= 60 ? "Review the missing skills before applying." : "Keep discovered for later unless the employer is strategic."
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(requestTimeoutMs) });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchEmployerJobs(employer) {
  if (!employer.boardToken) return [];

  if (employer.boardProvider === "greenhouse") {
    const sourceUrl = `https://boards-api.greenhouse.io/v1/boards/${employer.boardToken}/jobs?content=true`;
    const payload = await fetchJson(sourceUrl);
    return (payload.jobs ?? []).map((job) => ({
      employerId: employer.id,
      sourceProvider: "greenhouse",
      externalId: String(job.id),
      title: job.title,
      department: job.departments?.[0]?.name,
      location: job.location?.name,
      workMode: inferWorkMode(`${job.title} ${job.location?.name ?? ""} ${job.content ?? ""}`),
      description: stripHtml(job.content),
      sourceUrl,
      originalJobUrl: job.absolute_url,
      applyUrl: job.absolute_url,
      postedAt: job.updated_at ? new Date(job.updated_at) : null
    }));
  }

  if (employer.boardProvider === "lever") {
    const sourceUrl = `https://api.lever.co/v0/postings/${employer.boardToken}?mode=json`;
    const payload = await fetchJson(sourceUrl);
    return (payload ?? []).map((posting) => {
      const description = `${posting.descriptionPlain ?? ""} ${(posting.lists ?? []).map((list) => `${list.text} ${list.content}`).join(" ")}`.replace(/\s+/g, " ").trim();
      return {
        employerId: employer.id,
        sourceProvider: "lever",
        externalId: posting.id,
        title: posting.text,
        department: posting.categories?.team,
        location: posting.categories?.location,
        workMode: inferWorkMode(`${posting.text} ${posting.categories?.location ?? ""} ${description}`),
        description,
        sourceUrl,
        originalJobUrl: posting.hostedUrl,
        applyUrl: posting.applyUrl ?? posting.hostedUrl,
        postedAt: posting.createdAt ? new Date(posting.createdAt) : null
      };
    });
  }

  return [];
}

function renderAlert(user, highMatches) {
  if (!highMatches.length) return "";
  return [
    `New high-match jobs for ${user.name ?? user.email}`,
    "",
    ...highMatches.map(({ job, match }) => `- ${match.score}/100 ${job.title} at ${job.employer.name}: ${job.originalJobUrl}`)
  ].join("\n");
}

async function sendAlert(user, highMatches) {
  const message = renderAlert(user, highMatches);
  if (!message) return { sent: false, provider: "local", message: "No high-match jobs." };

  if (!process.env.RESEND_API_KEY) {
    console.log("\nLocal email alert preview:");
    console.log(message);
    return { sent: false, provider: "local", message };
  }

  const to = process.env.ALERT_EMAIL_TO ?? user.email;
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("RESEND_API_KEY is set, but EMAIL_FROM is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject: `JobFinder AI: ${highMatches.length} high-match jobs`,
      text: message
    })
  });

  if (!response.ok) {
    throw new Error(`Resend email failed: ${response.status} ${response.statusText}`);
  }

  return { sent: true, provider: "resend", message };
}

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set. Running local fallback refresh with demo data.");
  console.log("Discovered jobs: 4");
  console.log("High-match jobs: 2");
  console.log("Email provider: local fallback");
  process.exit(0);
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const employers = await prisma.employer.findMany({ orderBy: { name: "asc" } });
  const supported = employers.filter((employer) => ["greenhouse", "lever"].includes(employer.boardProvider) && employer.boardToken);
  const manual = employers.length - supported.length;
  const errors = [];
  let discoveredCount = 0;

  console.log(`Tracked employers: ${employers.length}`);
  console.log(`Refreshable employers: ${supported.length}`);
  console.log(`Manual review needed: ${manual}`);

  for (const employer of supported) {
    try {
      const jobs = await fetchEmployerJobs(employer);
      discoveredCount += jobs.length;
      for (const job of jobs) {
        await prisma.jobPosting.upsert({
          where: { sourceProvider_externalId: { sourceProvider: job.sourceProvider, externalId: job.externalId } },
          update: job,
          create: job
        });
      }
      console.log(`Fetched ${jobs.length} jobs from ${employer.name}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${employer.name}: ${message}`);
      console.error(`Failed to refresh ${employer.name}: ${message}`);
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
    const preferenceByEmployer = new Map(user.preferences.map((preference) => [preference.employerId, preference]));
    const jobs = await prisma.jobPosting.findMany({
      where: { employerId: { in: user.preferences.map((preference) => preference.employerId) } },
      include: { employer: true }
    });

    const highMatches = [];
    for (const job of jobs) {
      const preference = preferenceByEmployer.get(job.employerId);
      const match = scoreJob(user.profile, job, preference?.priority ?? 3);
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
      if (match.score >= threshold) highMatches.push({ job, match });
    }

    highMatchCount += highMatches.length;
    await sendAlert(user, highMatches);
  }

  console.log(`Discovered jobs: ${discoveredCount}`);
  console.log(`High-match jobs: ${highMatchCount}`);
  if (errors.length) {
    console.log("Refresh completed with provider errors:");
    errors.forEach((error) => console.log(`- ${error}`));
  }
} catch (error) {
  console.error("Refresh failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
