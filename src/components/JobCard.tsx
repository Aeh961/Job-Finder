import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { JobMatchResult, NormalizedJob } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { JobActions } from "./JobActions";

export function JobCard({ job, match, selectionState, actionsDisabled = false }: { job: NormalizedJob; match: JobMatchResult; selectionState?: "saved" | "ignored"; actionsDisabled?: boolean }) {
  return (
    <article className="rounded-md border border-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink/55">{job.employerName}</p>
          <Link href={`/jobs/${job.id}`} className="mt-1 block text-lg font-semibold hover:text-moss">
            {job.title}
          </Link>
          <p className="mt-1 text-sm text-ink/65">{[job.department, job.location, job.workMode].filter(Boolean).join(" / ")}</p>
        </div>
        <ScoreBadge score={match.score} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/70">{job.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink/60">
        <span className="rounded-md bg-cloud px-2 py-1">{job.sourceProvider}</span>
        <span>{match.suggestedNextAction}</span>
        <a href={job.originalJobUrl} className="ml-auto inline-flex items-center gap-1 font-medium text-moss" target="_blank" rel="noreferrer">
          Source <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-4">
        <JobActions jobId={job.id} initialState={selectionState} disabled={actionsDisabled} />
      </div>
    </article>
  );
}
