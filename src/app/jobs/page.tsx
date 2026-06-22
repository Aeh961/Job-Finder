import { AppShell } from "@/components/AppShell";
import { JobCard } from "@/components/JobCard";
import { demoMatches } from "@/lib/demo-data";

export default function JobsPage() {
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
      <div className="grid gap-4">
        {demoMatches.map(({ job, match }) => (
          <JobCard key={job.id} job={job} match={match} />
        ))}
      </div>
    </AppShell>
  );
}
