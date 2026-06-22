import type { EmployerInput, JobMatchResult, NormalizedJob, UserProfileInput } from "./types";

const scoreWeights = {
  title: 18,
  skills: 24,
  seniority: 10,
  location: 12,
  remote: 10,
  employer: 12,
  sponsorship: 6,
  interest: 8
};

const seniorityTerms = ["intern", "junior", "associate", "mid", "senior", "staff", "principal", "lead"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(source: string, needles: string[]) {
  const normalized = normalize(source);
  return needles.some((needle) => normalized.includes(normalize(needle)));
}

function percent(matches: number, total: number) {
  if (total === 0) return 0;
  return Math.round((matches / total) * 100);
}

export function inferSeniority(text: string) {
  const normalized = normalize(text);
  return seniorityTerms.find((term) => normalized.includes(term));
}

export function scoreJobMatch(
  profile: UserProfileInput,
  job: NormalizedJob,
  employers: EmployerInput[] = []
): JobMatchResult {
  const haystack = `${job.title} ${job.description} ${job.department ?? ""} ${job.location ?? ""}`;
  const titleHit = includesAny(job.title, profile.desiredTitles) ? 100 : 0;
  const matchedSkills = profile.skills.filter((skill) => includesAny(haystack, [skill]));
  const skillsScore = percent(matchedSkills.length, profile.skills.length);
  const jobSeniority = inferSeniority(job.title);
  const seniorityScore = !profile.seniority || !jobSeniority ? 70 : normalize(profile.seniority).includes(jobSeniority) ? 100 : 35;
  const locationScore =
    profile.preferredLocations.length === 0 ||
    includesAny(job.location ?? "", profile.preferredLocations) ||
    profile.preferredLocations.some((location) => normalize(location) === "remote" && job.workMode === "remote")
      ? 100
      : 25;
  const remoteScore = profile.workMode === "flexible" || profile.workMode === job.workMode ? 100 : job.workMode === "hybrid" ? 65 : 25;
  const employer = employers.find((item) => item.id === job.employerId);
  const employerScore = employer ? Math.min(100, 55 + employer.priority * 15) : 35;
  const sponsorshipScore = profile.needsSponsorship ? (job.requiresVisa === false ? 20 : 70) : 100;
  const interestHits = profile.interests.filter((interest) => includesAny(haystack, [interest])).length;
  const interestScore = profile.interests.length === 0 ? 50 : percent(interestHits, profile.interests.length);

  const categoryScores = {
    title: titleHit,
    skills: skillsScore,
    seniority: seniorityScore,
    location: locationScore,
    remote: remoteScore,
    employer: employerScore,
    sponsorship: sponsorshipScore,
    interest: interestScore
  };

  const score = Math.round(
    Object.entries(scoreWeights).reduce((sum, [key, weight]) => {
      return sum + (categoryScores[key as keyof typeof categoryScores] * weight) / 100;
    }, 0)
  );

  const whyMatched = [
    titleHit > 0 ? "Job title aligns with a desired role." : "",
    matchedSkills.length ? `Matched skills: ${matchedSkills.slice(0, 5).join(", ")}.` : "",
    locationScore >= 80 ? "Location preferences are aligned." : "",
    remoteScore >= 80 ? "Work mode preference is aligned." : "",
    employer ? `${job.employerName} is on the target employer list.` : ""
  ].filter(Boolean);

  const missingSkills = profile.skills.filter((skill) => !matchedSkills.includes(skill)).slice(0, 6);
  const suggestedNextAction =
    score >= 80
      ? "Move to interested and generate an application packet."
      : score >= 60
        ? "Review the missing skills before applying."
        : "Keep discovered for later unless the employer is strategic.";

  return { score: Math.max(0, Math.min(100, score)), whyMatched, missingSkills, suggestedNextAction, categoryScores };
}
