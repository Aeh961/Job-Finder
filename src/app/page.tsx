import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const features = ["Target employer tracker", "Greenhouse and Lever discovery", "0-100 match scores", "Application packet drafts"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cloud">
      <section className="grid min-h-[86vh] content-center px-6 py-16 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Job search operating system</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-normal text-ink md:text-6xl">JobFinder AI</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              A focused SaaS MVP for tracking target employers, discovering roles from supported boards, scoring matches, and preparing application materials.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold">
                Build profile
              </Link>
            </div>
          </div>
          <div className="rounded-md border border-line bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="text-sm font-semibold">Today</span>
              <span className="rounded-md bg-moss px-2 py-1 text-xs font-semibold text-white">Demo mode</span>
            </div>
            <div className="mt-4 space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-ink/75">
                  <CheckCircle2 className="h-5 w-5 text-moss" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
