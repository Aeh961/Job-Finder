import type { JobMatchResult, NormalizedJob } from "./types";

export type EmailAlertInput = {
  to?: string;
  from?: string;
  jobs: Array<{ job: NormalizedJob; match: JobMatchResult }>;
  threshold: number;
};

export type EmailAlertResult =
  | { ok: true; provider: "local" | "resend"; message: string; sentCount: number }
  | { ok: false; provider: "local" | "resend"; error: string };

export function selectHighMatchJobs(jobs: EmailAlertInput["jobs"], threshold: number) {
  return jobs.filter(({ match }) => match.score >= threshold).sort((a, b) => b.match.score - a.match.score);
}

export function renderEmailAlert(input: EmailAlertInput) {
  const highMatches = selectHighMatchJobs(input.jobs, input.threshold);
  if (highMatches.length === 0) {
    return "No new high-match jobs found today.";
  }

  const lines = highMatches.map(({ job, match }) => {
    return `- ${match.score}/100 ${job.title} at ${job.employerName}: ${job.originalJobUrl}`;
  });

  return [`New high-match jobs (${highMatches.length})`, "", ...lines].join("\n");
}

export async function sendEmailAlert(input: EmailAlertInput): Promise<EmailAlertResult> {
  const provider = process.env.RESEND_API_KEY ? "resend" : "local";
  const highMatches = selectHighMatchJobs(input.jobs, input.threshold);
  const message = renderEmailAlert(input);

  if (highMatches.length === 0) {
    return { ok: true, provider, message, sentCount: 0 };
  }

  if (provider === "local") {
    return { ok: true, provider, message, sentCount: highMatches.length };
  }

  if (!input.to || !input.from) {
    return { ok: false, provider, error: "Email provider configured, but ALERT_EMAIL_TO or EMAIL_FROM is missing." };
  }

  return {
    ok: true,
    provider,
    message: "Resend provider is configured. Wire the HTTP call here when production credentials are ready.",
    sentCount: highMatches.length
  };
}
