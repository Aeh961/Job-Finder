import { AppShell } from "@/components/AppShell";
import { ResumeUploader } from "@/components/ResumeUploader";
import { saveResumeAction } from "@/app/actions";
import { getDashboardData } from "@/lib/user-data";

export default async function ResumePage() {
  const data = await getDashboardData();
  return (
    <AppShell title="Resume Upload">
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <ResumeUploader action={saveResumeAction} disabled={data.mode === "demo"} />
        <aside className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="font-semibold">Extraction notes</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/65">
            <p>TXT and Markdown files are parsed locally in the browser for this MVP.</p>
            <p>Detected skills can be copied into the profile form and used by scoring.</p>
            <p>PDF parsing is intentionally listed as a TODO to avoid unreliable extraction in V2.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
