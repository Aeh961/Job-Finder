import type { EmployerInput, NormalizedJob } from "./types";
import { demoJobs } from "./demo-data";
import { fetchGreenhouseJobs } from "./integrations/greenhouse";
import { fetchLeverJobs } from "./integrations/lever";

export async function discoverJobsForEmployer(employer: EmployerInput): Promise<NormalizedJob[]> {
  if (employer.boardProvider === "unsupported" || !employer.boardToken) {
    return [];
  }

  if (employer.boardProvider === "greenhouse") {
    return fetchGreenhouseJobs({ id: employer.id, name: employer.name, boardToken: employer.boardToken });
  }

  if (employer.boardProvider === "lever") {
    return fetchLeverJobs({ id: employer.id, name: employer.name, boardToken: employer.boardToken });
  }

  return [];
}

export async function discoverJobs(employers: EmployerInput[], useLocalFallback = true): Promise<NormalizedJob[]> {
  if (useLocalFallback) return demoJobs;

  const results = await Promise.allSettled(employers.map((employer) => discoverJobsForEmployer(employer)));
  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}
