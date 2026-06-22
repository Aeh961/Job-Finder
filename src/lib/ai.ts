import type { ApplicationPacket, JobMatchResult, NormalizedJob, UserProfileInput } from "./types";

export async function generateApplicationPacket(
  profile: UserProfileInput,
  job: NormalizedJob,
  match: JobMatchResult
): Promise<ApplicationPacket> {
  const provider = process.env.OPENAI_API_KEY ? "openai" : process.env.ANTHROPIC_API_KEY ? "anthropic" : "local";

  if (provider === "local") {
    const keySkills = profile.skills.filter((skill) => !match.missingSkills.includes(skill)).slice(0, 4).join(", ");
    return {
      provider,
      fitSummary: `${profile.headline ?? "Candidate"} is a ${match.score}/100 fit for ${job.title} at ${job.employerName}, with strength in ${keySkills || "relevant product work"}.`,
      tailoredResumeSummary: `Full-stack builder with experience across ${keySkills || "modern web systems"}, interested in ${job.department ?? "the team"} roles that connect product quality with measurable outcomes.`,
      coverLetterDraft: `Dear ${job.employerName} team,\n\nI am excited about the ${job.title} role because it aligns with my experience in ${keySkills || "shipping useful software"} and my interest in ${profile.interests.slice(0, 2).join(" and ") || "high-impact products"}. I would welcome the chance to contribute to your team.\n\nBest,\nJobFinder AI Candidate`,
      recruiterMessage: `Hi, I found the ${job.title} role and think my background in ${keySkills || "full-stack product work"} could be a strong match. I would appreciate any guidance on the best way to be considered.`,
      checklist: [
        "Review missing skills and add proof points where possible.",
        "Tailor resume summary to the job title and employer.",
        "Confirm location, work mode, and sponsorship expectations.",
        "Submit manually through the original job URL."
      ]
    };
  }

  return {
    provider,
    fitSummary: "AI provider support is configured. Replace this stub with the provider SDK call in src/lib/ai.ts.",
    tailoredResumeSummary: "",
    coverLetterDraft: "",
    recruiterMessage: "",
    checklist: ["Implement provider call", "Review generated content", "Submit manually"]
  };
}
