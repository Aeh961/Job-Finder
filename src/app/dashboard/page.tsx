import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { JobCard } from "@/components/JobCard";
import { StatusBadge } from "@/components/StatusBadge";
import { demoApplications, demoEmployers, demoJobSelections, demoMatches } from "@/lib/demo-data";
import { summarizeSelections } from "@/lib/job-selections";

export default function DashboardPage() {
  const topMatches = [...demoMatches].sort((a, b) => b.match.score - a.match.score).slice(0, 3);
  const selectionSummary = summarizeSelections(demoJobSelections);
  return (
    <AppShell title="Dashboard" action={<Link href="/jobs" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Review jobs</Link>}>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Tracked employers" value={demoEmployers.length} />
        <Stat label="Discovered jobs" value={demoMatches.length} />
        <Stat label="Saved jobs" value={selectionSummary.saved} />
        <Stat label="Ignored jobs" value={selectionSummary.ignored} />
      </div>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {topMatches.map(({ job, match }) => (
            <JobCard key={job.id} job={job} match={match} />
          ))}
        </div>
        <div className="rounded-md border border-line bg-white p-4 shadow-soft">
          <h2 className="font-semibold">Pipeline</h2>
          <div className="mt-4 space-y-3">
            {demoApplications.map((application) => {
              const job = demoMatches.find((item) => item.job.id === application.jobId)?.job;
              return (
                <div key={application.id} className="border-b border-line pb-3 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{job?.title}</p>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{application.notes}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-white p-4 shadow-soft">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
