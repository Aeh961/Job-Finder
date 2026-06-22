import { AppShell } from "@/components/AppShell";
import { demoProfile } from "@/lib/demo-data";

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <form className="grid max-w-4xl gap-5 rounded-md border border-line bg-white p-5 shadow-soft">
        <Field label="Headline" defaultValue={demoProfile.headline} />
        <Field label="Resume text" textarea defaultValue="Paste the primary resume here. The MVP stores this as text for scoring and application packet generation." />
        <Field label="Skills" defaultValue={demoProfile.skills.join(", ")} />
        <Field label="Desired job titles" defaultValue={demoProfile.desiredTitles.join(", ")} />
        <Field label="Preferred locations" defaultValue={demoProfile.preferredLocations.join(", ")} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            Work mode
            <select className="mt-2 rounded-md border border-line px-3 py-2">
              <option>remote</option>
              <option>hybrid</option>
              <option>onsite</option>
              <option>flexible</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-md border border-line px-3 py-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4" defaultChecked={demoProfile.needsSponsorship} />
            Needs visa sponsorship
          </label>
        </div>
        <button className="w-fit rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" type="button">
          Save profile
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, defaultValue, textarea = false }: { label: string; defaultValue?: string; textarea?: boolean }) {
  return (
    <label className="text-sm font-medium">
      {label}
      {textarea ? (
        <textarea className="mt-2 min-h-36 rounded-md border border-line px-3 py-2" defaultValue={defaultValue} />
      ) : (
        <input className="mt-2 rounded-md border border-line px-3 py-2" defaultValue={defaultValue} />
      )}
    </label>
  );
}
