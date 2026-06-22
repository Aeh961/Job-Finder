import { AppShell } from "@/components/AppShell";
import { saveProfileAction } from "@/app/actions";
import { getDashboardData } from "@/lib/user-data";

export default async function ProfilePage() {
  const data = await getDashboardData();
  const profile = data.profile;
  return (
    <AppShell title="Profile">
      <form action={saveProfileAction} className="grid max-w-4xl gap-5 rounded-md border border-line bg-white p-5 shadow-soft">
        {data.mode === "demo" ? <p className="rounded-md bg-cloud px-3 py-2 text-sm text-ink/60">Demo mode is read-only. Sign in to save profile changes.</p> : null}
        <Field label="Headline" name="headline" defaultValue={profile.headline} />
        <Field label="Resume text" textarea defaultValue="Paste the primary resume here. The MVP stores this as text for scoring and application packet generation." />
        <Field label="Skills" name="skills" defaultValue={profile.skills.join(", ")} />
        <Field label="Desired job titles" name="desiredTitles" defaultValue={profile.desiredTitles.join(", ")} />
        <Field label="Preferred locations" name="preferredLocations" defaultValue={profile.preferredLocations.join(", ")} />
        <Field label="Seniority" name="seniority" defaultValue={profile.seniority} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            Work mode
            <select className="mt-2 rounded-md border border-line px-3 py-2" name="workMode" defaultValue={profile.workMode}>
              <option>remote</option>
              <option>hybrid</option>
              <option>onsite</option>
              <option>flexible</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-md border border-line px-3 py-2 text-sm font-medium">
            <input type="checkbox" name="needsSponsorship" className="h-4 w-4" defaultChecked={profile.needsSponsorship} />
            Needs visa sponsorship
          </label>
        </div>
        <button className="w-fit rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={data.mode === "demo"} type="submit">
          Save profile
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, name, defaultValue, textarea = false }: { label: string; name?: string; defaultValue?: string; textarea?: boolean }) {
  return (
    <label className="text-sm font-medium">
      {label}
      {textarea ? (
        <textarea className="mt-2 min-h-36 rounded-md border border-line px-3 py-2" name={name} defaultValue={defaultValue} />
      ) : (
        <input className="mt-2 rounded-md border border-line px-3 py-2" name={name} defaultValue={defaultValue} />
      )}
    </label>
  );
}
