import { demoEmployers, demoMatches } from "./demo-data";
import { discoverJobs } from "./jobs";
import { scoreJobMatch } from "./scoring";
import type { EmployerInput, UserProfileInput } from "./types";

export type RefreshResult = {
  discoveredCount: number;
  highMatchCount: number;
  errors: string[];
};

export async function refreshJobsForUser({
  profile,
  employers = demoEmployers,
  threshold = 80,
  localFallback = true
}: {
  profile: UserProfileInput;
  employers?: EmployerInput[];
  threshold?: number;
  localFallback?: boolean;
}): Promise<RefreshResult> {
  const errors: string[] = [];
  try {
    const jobs = await discoverJobs(employers, localFallback);
    const matches = jobs.map((job) => scoreJobMatch(profile, job, employers));
    return {
      discoveredCount: jobs.length,
      highMatchCount: matches.filter((match) => match.score >= threshold).length,
      errors
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown refresh error");
    return {
      discoveredCount: localFallback ? demoMatches.length : 0,
      highMatchCount: localFallback ? demoMatches.filter(({ match }) => match.score >= threshold).length : 0,
      errors
    };
  }
}
