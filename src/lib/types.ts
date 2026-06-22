export type WorkMode = "remote" | "hybrid" | "onsite" | "flexible";
export type BoardProvider = "greenhouse" | "lever" | "unsupported";
export type ApplicationStatus =
  | "discovered"
  | "interested"
  | "applied"
  | "interview"
  | "rejected"
  | "offer";

export type UserProfileInput = {
  headline?: string;
  skills: string[];
  desiredTitles: string[];
  preferredLocations: string[];
  workMode: WorkMode;
  needsSponsorship: boolean;
  seniority?: string;
  interests: string[];
};

export type EmployerInput = {
  id: string;
  name: string;
  boardProvider: BoardProvider;
  boardToken?: string;
  careersUrl?: string;
  website?: string;
  priority: number;
  manualReviewNeeded?: boolean;
};

export type NormalizedJob = {
  id: string;
  employerId: string;
  employerName: string;
  sourceProvider: BoardProvider;
  externalId: string;
  title: string;
  department?: string;
  location?: string;
  workMode?: WorkMode;
  description: string;
  sourceUrl: string;
  originalJobUrl: string;
  applyUrl?: string;
  requiresVisa?: boolean;
  postedAt?: string;
};

export type JobMatchResult = {
  score: number;
  whyMatched: string[];
  missingSkills: string[];
  suggestedNextAction: string;
  categoryScores: Record<string, number>;
};

export type ApplicationPacket = {
  fitSummary: string;
  tailoredResumeSummary: string;
  coverLetterDraft: string;
  recruiterMessage: string;
  checklist: string[];
  provider: "local" | "openai" | "anthropic";
};
