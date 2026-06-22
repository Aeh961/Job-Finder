import type { NormalizedJob } from "../types";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  internal_job_id?: number;
  updated_at?: string;
  location?: { name?: string };
  departments?: Array<{ name: string }>;
  content?: string;
};

type GreenhouseResponse = {
  jobs: GreenhouseJob[];
};

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function parseGreenhouseJobs(
  payload: GreenhouseResponse,
  employer: { id: string; name: string; boardToken: string }
): NormalizedJob[] {
  return (payload.jobs ?? []).map((job) => ({
    id: `greenhouse:${job.id}`,
    employerId: employer.id,
    employerName: employer.name,
    sourceProvider: "greenhouse",
    externalId: String(job.id),
    title: job.title,
    department: job.departments?.[0]?.name,
    location: job.location?.name,
    description: stripHtml(job.content),
    sourceUrl: `https://boards-api.greenhouse.io/v1/boards/${employer.boardToken}/jobs?content=true`,
    originalJobUrl: job.absolute_url,
    applyUrl: job.absolute_url,
    postedAt: job.updated_at
  }));
}

export async function fetchGreenhouseJobs(employer: { id: string; name: string; boardToken: string }) {
  const sourceUrl = `https://boards-api.greenhouse.io/v1/boards/${employer.boardToken}/jobs?content=true`;
  const response = await fetch(sourceUrl, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error(`Greenhouse request failed for ${employer.name}: ${response.status}`);
  }
  return parseGreenhouseJobs((await response.json()) as GreenhouseResponse, employer);
}
