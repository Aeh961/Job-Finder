import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";

const steps = [
  { title: "Create your profile", body: "Add target roles, locations, work mode, and sponsorship preferences.", href: "/profile" },
  { title: "Upload your resume", body: "Extract resume text and skills from TXT or Markdown uploads.", href: "/resume" },
  { title: "Build your watchlist", body: "Track priority employers and see which boards need manual review.", href: "/employers" },
  { title: "Review matches", body: "Save promising jobs, ignore weak fits, and generate application packets.", href: "/jobs" }
];

export default function OnboardingPage() {
  return (
    <AppShell title="Onboarding" action={<Link href="/dashboard" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Skip to dashboard</Link>}>
      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Link key={step.title} href={step.href} className="rounded-md border border-line bg-white p-5 shadow-soft hover:border-moss">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-cloud text-sm font-semibold">{index + 1}</span>
              <CheckCircle2 className="h-5 w-5 text-moss" />
            </div>
            <h2 className="mt-5 font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{step.body}</p>
          </Link>
        ))}
      </div>
      <section className="mt-6 rounded-md border border-line bg-white p-5 shadow-soft">
        <h2 className="font-semibold">V2 onboarding mode</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">
          This flow is ready for real user data entry while keeping the V1 demo workspace available. Production auth and persistence are the next layer.
        </p>
      </section>
    </AppShell>
  );
}
