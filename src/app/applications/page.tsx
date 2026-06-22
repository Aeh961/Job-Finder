import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { updateApplicationStatusAction } from "@/app/actions";
import { applicationStatuses } from "@/lib/db-utils";
import { getDashboardData } from "@/lib/user-data";

export default async function ApplicationsPage() {
  const data = await getDashboardData();
  return (
    <AppShell title="Applications">
      {data.applications.length === 0 ? <EmptyState title="No applications yet" body="Move a job to interested or applied from a job detail page to start your pipeline." /> : <div className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-cloud text-ink/65">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Employer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.applications.map((application) => {
              const job = data.matches.find((item) => item.job.id === application.jobId)?.job;
              return (
                <tr key={application.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{job?.title}</td>
                  <td className="px-4 py-3 text-ink/65">{job?.employerName}</td>
                  <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                  <td className="px-4 py-3 text-ink/65">
                    <form action={updateApplicationStatusAction} className="flex gap-2">
                      <input type="hidden" name="jobId" value={application.jobId} />
                      <select className="rounded-md border border-line px-2 py-1" name="status" defaultValue={application.status} disabled={data.mode === "demo"}>
                        {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <button className="rounded-md border border-line px-2 py-1 font-semibold disabled:opacity-60" disabled={data.mode === "demo"} type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}
    </AppShell>
  );
}
