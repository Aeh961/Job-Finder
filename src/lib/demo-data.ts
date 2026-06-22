import type { ApplicationStatus, EmployerInput, NormalizedJob, UserProfileInput } from "./types";
import { scoreJobMatch } from "./scoring";

export const demoProfile: UserProfileInput = {
  headline: "Full-stack developer targeting AI product teams",
  skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Python", "Prisma", "OpenAI"],
  desiredTitles: ["Software Engineer", "Full Stack Engineer", "AI Engineer"],
  preferredLocations: ["Remote", "San Francisco", "New York"],
  workMode: "remote",
  needsSponsorship: false,
  seniority: "mid",
  interests: ["AI", "automation", "developer tools", "job search"]
};

export const demoEmployers: EmployerInput[] = [
  {
    id: "openai",
    name: "OpenAI",
    boardProvider: "greenhouse",
    boardToken: "openai",
    careersUrl: "https://openai.com/careers",
    priority: 5
  },
  {
    id: "stripe",
    name: "Stripe",
    boardProvider: "greenhouse",
    boardToken: "stripe",
    careersUrl: "https://stripe.com/jobs",
    priority: 4
  },
  {
    id: "linear",
    name: "Linear",
    boardProvider: "lever",
    boardToken: "linear",
    careersUrl: "https://linear.app/careers",
    priority: 4
  },
  {
    id: "custom",
    name: "Dream Startup",
    boardProvider: "unsupported",
    careersUrl: "https://example.com/careers",
    priority: 3,
    manualReviewNeeded: true
  }
];

export const demoJobs: NormalizedJob[] = [
  {
    id: "job-1",
    employerId: "openai",
    employerName: "OpenAI",
    sourceProvider: "greenhouse",
    externalId: "demo-1",
    title: "Full Stack Software Engineer, Applied AI",
    department: "Engineering",
    location: "Remote - US",
    workMode: "remote",
    description:
      "Build TypeScript, React, Next.js and PostgreSQL product experiences for AI workflows. Prisma and API integration experience preferred.",
    sourceUrl: "https://boards-api.greenhouse.io/v1/boards/openai/jobs?content=true",
    originalJobUrl: "https://openai.com/careers/demo-full-stack",
    applyUrl: "https://openai.com/careers/demo-full-stack",
    requiresVisa: false
  },
  {
    id: "job-2",
    employerId: "stripe",
    employerName: "Stripe",
    sourceProvider: "greenhouse",
    externalId: "demo-2",
    title: "Backend Engineer, Payments",
    department: "Engineering",
    location: "New York, NY",
    workMode: "hybrid",
    description: "Work on distributed systems, APIs, reliability, SQL data models, and developer-facing product surfaces.",
    sourceUrl: "https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true",
    originalJobUrl: "https://stripe.com/jobs/demo-backend",
    applyUrl: "https://stripe.com/jobs/demo-backend",
    requiresVisa: true
  },
  {
    id: "job-3",
    employerId: "linear",
    employerName: "Linear",
    sourceProvider: "lever",
    externalId: "demo-3",
    title: "Product Engineer",
    department: "Product Engineering",
    location: "Remote",
    workMode: "remote",
    description: "Craft polished React and TypeScript workflows with a focus on speed, quality, and product taste.",
    sourceUrl: "https://api.lever.co/v0/postings/linear?mode=json",
    originalJobUrl: "https://linear.app/careers/demo-product",
    applyUrl: "https://linear.app/careers/demo-product"
  }
];

export const demoApplications: Array<{ id: string; jobId: string; status: ApplicationStatus; notes: string }> = [
  { id: "app-1", jobId: "job-1", status: "interested", notes: "Generate packet and ask for referral." },
  { id: "app-2", jobId: "job-2", status: "discovered", notes: "Check hybrid commute expectations." }
];

export const demoMatches = demoJobs.map((job) => ({
  job,
  match: scoreJobMatch(demoProfile, job, demoEmployers)
}));
