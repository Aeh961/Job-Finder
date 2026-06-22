import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { JobCard } from "@/components/JobCard";
import { getDashboardData } from "@/lib/user-data";

export default async function JobsPage() {
  const data = await getDashboardData();
  const savedIds = new Set(data.selections.filter((selection) => selection.state === "saved").map((selection) => selection.jobId));
  const ignoredIds = new Set(data.selections.filter((selection) => selection.state === "ignored").map((selection) => selection.jobId));
  const selectionByJob = new Map(data.selections.map((selection) => [selection.jobId, selection.state]));
  const activeMatches = data.matches.filter(({ job }) => !ignoredIds.has(job.id));
  const savedMatches = data.matches.filter(({ job }) => savedIds.has(job.id));
  const ignoredMatches = data.matches.filter(({ job }) => ignoredIds.has(job.id));

  return (
    <AppShell title="Job Matches">
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <input className="rounded-md border border-line px-3 py-2" placeholder="Search roles" />
        <select className="rounded-md border border-line px-3 py-2">
          <option>All employers</option>
          <option>OpenAI</option>
          <option>Stripe</option>
          <option>Linear</option>
        </select>
        <select className="rounded-md border border-line px-3 py-2">
          <option>Any score</option>
          <option>80+</option>
          <option>60+</option>
        </select>
        <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Discover jobs</button>
      </div>
      <section className="grid gap-4">
        {activeMatches.length ? activeMatches.map(({ job, match }) => (
          <JobCard key={job.id} job={job} match={match} selectionState={selectionByJob.get(job.id)} actionsDisabled={data.mode === "demo"} />
        )) : <EmptyState title="No active matches" body="All discovered jobs are ignored or filtered out. Refresh jobs or adjust your preferences." />}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Saved jobs</h2>
        {savedMatches.length ? (
          <div className="grid gap-4">
            {savedMatches.map(({ job, match }) => <JobCard key={job.id} job={job} match={match} selectionState={selectionByJob.get(job.id)} actionsDisabled={data.mode === "demo"} />)}
          </div>
        ) : (
          <EmptyState title="No saved jobs yet" body="Save promising matches to build a focused application shortlist." />
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Ignored jobs</h2>
        {ignoredMatches.length ? (
          <div className="grid gap-4 opacity-70">
            {ignoredMatches.map(({ job, match }) => <JobCard key={job.id} job={job} match={match} selectionState={selectionByJob.get(job.id)} actionsDisabled={data.mode === "demo"} />)}
          </div>
        ) : (
          <EmptyState title="No ignored jobs" body="Ignore jobs that are not worth revisiting so future reviews stay clean." />
        )}
      </section>
    </AppShell>
  );
}
