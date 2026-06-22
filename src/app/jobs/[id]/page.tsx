import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { JobActions } from "@/components/JobActions";
import { ScoreBadge } from "@/components/ScoreBadge";
import { generateApplicationPacket } from "@/lib/ai";
import { demoMatches, demoProfile } from "@/lib/demo-data";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const item = demoMatches.find(({ job }) => job.id === params.id);
  if (!item) notFound();
  const packet = await generateApplicationPacket(demoProfile, item.job, item.match);

  return (
    <AppShell title="Job Detail" action={<Link href="/jobs" className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold">Back to jobs</Link>}>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <article className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-ink/55">{item.job.employerName}</p>
              <h2 className="mt-1 text-2xl font-semibold">{item.job.title}</h2>
              <p className="mt-2 text-sm text-ink/60">{[item.job.department, item.job.location, item.job.workMode].filter(Boolean).join(" / ")}</p>
            </div>
            <ScoreBadge score={item.match.score} />
          </div>
          <h3 className="mt-6 font-semibold">Why it matched</h3>
          <ul className="mt-2 space-y-2 text-sm text-ink/70">
            {item.match.whyMatched.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold">Missing skills</h3>
          <p className="mt-2 text-sm text-ink/70">{item.match.missingSkills.join(", ") || "No major missing skills detected."}</p>
          <h3 className="mt-6 font-semibold">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink/70">{item.job.description}</p>
          <a className="mt-6 inline-block rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" href={item.job.originalJobUrl} target="_blank" rel="noreferrer">
            Open original posting
          </a>
          <div className="mt-4">
            <JobActions />
          </div>
        </article>
        <aside className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="font-semibold">Score breakdown</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(item.match.categoryScores).map(([category, score]) => (
              <div key={category}>
                <div className="flex items-center justify-between text-xs font-medium uppercase text-ink/55">
                  <span>{category}</span>
                  <span>{score}</span>
                </div>
                <div className="mt-1 h-2 rounded bg-cloud">
                  <div className="h-2 rounded bg-moss" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="my-5 border-t border-line" />
          <h2 className="font-semibold">AI application helper</h2>
          <Section title="Fit summary" value={packet.fitSummary} />
          <Section title="Tailored resume summary" value={packet.tailoredResumeSummary} />
          <Section title="Cover letter draft" value={packet.coverLetterDraft} />
          <Section title="Recruiter message" value={packet.recruiterMessage} />
          <Section title="Checklist" value={packet.checklist.join("\n")} />
          <div className="mt-5 rounded-md bg-cloud p-3 text-xs leading-5 text-ink/60">
            Source API: {item.job.sourceUrl}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Section({ title, value }: { title: string; value: string }) {
  return (
    <section className="mt-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/70">{value}</p>
    </section>
  );
}
