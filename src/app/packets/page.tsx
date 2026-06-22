import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { generateApplicationPacket } from "@/lib/ai";
import { demoMatches, demoProfile } from "@/lib/demo-data";

export default async function PacketsPage() {
  const topMatches = demoMatches.filter(({ match }) => match.score >= 70).slice(0, 3);
  const packets = await Promise.all(topMatches.map(({ job, match }) => generateApplicationPacket(demoProfile, job, match).then((packet) => ({ job, match, packet }))));

  return (
    <AppShell title="Application Packets">
      {packets.length === 0 ? (
        <EmptyState title="No packet candidates" body="Save or discover stronger job matches before generating application packets." />
      ) : (
        <div className="grid gap-4">
          {packets.map(({ job, match, packet }) => (
            <article key={job.id} className="rounded-md border border-line bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink/55">{job.employerName}</p>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                </div>
                <span className="rounded-md bg-cloud px-2 py-1 text-sm font-semibold">{match.score}/100</span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <PacketSection title="Fit summary" value={packet.fitSummary} />
                <PacketSection title="Tailored resume summary" value={packet.tailoredResumeSummary} />
                <PacketSection title="Recruiter message" value={packet.recruiterMessage} />
                <PacketSection title="Checklist" value={packet.checklist.join("\n")} />
              </div>
              <Link href={`/jobs/${job.id}`} className="mt-4 inline-block rounded-md border border-line px-3 py-2 text-sm font-semibold">
                Review job detail
              </Link>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function PacketSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-md bg-cloud p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/70">{value}</p>
    </section>
  );
}
