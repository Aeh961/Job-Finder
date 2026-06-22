import { AppShell } from "@/components/AppShell";
import { deleteEmployerPreferenceAction, saveEmployerAction } from "@/app/actions";
import { getDashboardData } from "@/lib/user-data";

export default async function EmployersPage() {
  const data = await getDashboardData();
  const supportedCount = data.employers.filter((employer) => employer.boardProvider !== "unsupported").length;
  const manualCount = data.employers.length - supportedCount;
  return (
    <AppShell title="Target Employers">
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <WatchMetric label="Watchlist size" value={data.employers.length} />
        <WatchMetric label="Auto-refreshable" value={supportedCount} />
        <WatchMetric label="Manual review" value={manualCount} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <form action={saveEmployerAction} className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="font-semibold">Add employer</h2>
          {data.mode === "demo" ? <p className="mt-3 rounded-md bg-cloud px-3 py-2 text-sm text-ink/60">Demo mode is read-only. Sign in to persist employers.</p> : null}
          <div className="mt-4 space-y-4">
            <input className="rounded-md border border-line px-3 py-2" name="name" placeholder="Employer name" required />
            <select className="rounded-md border border-line px-3 py-2" name="boardProvider">
              <option value="greenhouse">Greenhouse</option>
              <option value="lever">Lever</option>
              <option value="unsupported">Manual review needed</option>
            </select>
            <input className="rounded-md border border-line px-3 py-2" name="boardToken" placeholder="Board token, e.g. stripe" />
            <input className="rounded-md border border-line px-3 py-2" name="careersUrl" placeholder="Careers URL" />
            <input className="rounded-md border border-line px-3 py-2" name="priority" type="number" min="1" max="5" defaultValue="3" />
            <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={data.mode === "demo"} type="submit">
              Track employer
            </button>
          </div>
        </form>
        <div className="grid gap-3">
          {data.employers.map((employer) => (
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
              <form action={deleteEmployerPreferenceAction} className="mt-4">
                <input type="hidden" name="employerId" value={employer.id} />
                <button className="rounded-md border border-line px-3 py-2 text-sm font-semibold disabled:opacity-60" disabled={data.mode === "demo"} type="submit">
                  Remove from watchlist
                </button>
              </form>
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
