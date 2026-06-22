import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { demoApplications, demoMatches } from "@/lib/demo-data";

export default function ApplicationsPage() {
  return (
    <AppShell title="Applications">
      <div className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
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
            {demoApplications.map((application) => {
              const job = demoMatches.find((item) => item.job.id === application.jobId)?.job;
              return (
                <tr key={application.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{job?.title}</td>
                  <td className="px-4 py-3 text-ink/65">{job?.employerName}</td>
                  <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                  <td className="px-4 py-3 text-ink/65">{application.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
