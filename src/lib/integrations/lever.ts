import type { NormalizedJob } from "../types";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl?: string;
  createdAt?: number;
  categories?: {
    team?: string;
    location?: string;
    commitment?: string;
  };
  descriptionPlain?: string;
  lists?: Array<{ text: string; content: string }>;
};

function flattenPosting(posting: LeverPosting) {
  const listText = (posting.lists ?? []).map((list) => `${list.text} ${list.content}`).join(" ");
  return `${posting.descriptionPlain ?? ""} ${listText}`.replace(/\s+/g, " ").trim();
}

export function parseLeverJobs(
  payload: LeverPosting[],
  employer: { id: string; name: string; boardToken: string }
): NormalizedJob[] {
  return (payload ?? []).map((posting) => ({
    id: `lever:${posting.id}`,
    employerId: employer.id,
    employerName: employer.name,
    sourceProvider: "lever",
    externalId: posting.id,
    title: posting.text,
    department: posting.categories?.team,
    location: posting.categories?.location,
    description: flattenPosting(posting),
    sourceUrl: `https://api.lever.co/v0/postings/${employer.boardToken}?mode=json`,
    originalJobUrl: posting.hostedUrl,
    applyUrl: posting.applyUrl ?? posting.hostedUrl,
    postedAt: posting.createdAt ? new Date(posting.createdAt).toISOString() : undefined
  }));
}

export async function fetchLeverJobs(employer: { id: string; name: string; boardToken: string }) {
  const sourceUrl = `https://api.lever.co/v0/postings/${employer.boardToken}?mode=json`;
  const response = await fetch(sourceUrl, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error(`Lever request failed for ${employer.name}: ${response.status}`);
  }
  return parseLeverJobs((await response.json()) as LeverPosting[], employer);
}
