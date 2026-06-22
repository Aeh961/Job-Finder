import { AppShell } from "@/components/AppShell";
import { demoEmployers } from "@/lib/demo-data";

export default function EmployersPage() {
  const supportedCount = demoEmployers.filter((employer) => employer.boardProvider !== "unsupported").length;
  const manualCount = demoEmployers.length - supportedCount;
  return (
    <AppShell title="Target Employers">
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <WatchMetric label="Watchlist size" value={demoEmployers.length} />
        <WatchMetric label="Auto-refreshable" value={supportedCount} />
        <WatchMetric label="Manual review" value={manualCount} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <form className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="font-semibold">Add employer</h2>
          <div className="mt-4 space-y-4">
            <input className="rounded-md border border-line px-3 py-2" placeholder="Employer name" />
            <select className="rounded-md border border-line px-3 py-2">
              <option value="greenhouse">Greenhouse</option>
              <option value="lever">Lever</option>
              <option value="unsupported">Manual review needed</option>
            </select>
            <input className="rounded-md border border-line px-3 py-2" placeholder="Board token, e.g. stripe" />
            <input className="rounded-md border border-line px-3 py-2" placeholder="Careers URL" />
            <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" type="button">
              Track employer
            </button>
          </div>
        </form>
        <div className="grid gap-3">
          {demoEmployers.map((employer) => (
            <article key={employer.id} className="rounded-md border border-line bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{employer.name}</h2>
                  <p className="mt-1 text-sm text-ink/60">{employer.careersUrl}</p>
                </div>
                <span className="rounded-md bg-cloud px-2 py-1 text-xs font-medium">{employer.boardProvider}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
                <span className="rounded-md bg-cloud px-2 py-1">Priority {employer.priority}/5</span>
                <span className="rounded-md bg-cloud px-2 py-1">{employer.boardToken ? `Token: ${employer.boardToken}` : "No board token"}</span>
              </div>
              {employer.manualReviewNeeded ? <p className="mt-3 text-sm text-coral">Unsupported board. Manual review needed before refresh.</p> : null}
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function WatchMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-white p-4 shadow-soft">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
