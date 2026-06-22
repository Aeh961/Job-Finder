import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="max-w-3xl rounded-md border border-line bg-white p-5 shadow-soft">
        <h2 className="font-semibold">Environment</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <Setting label="Database" value="PostgreSQL through DATABASE_URL" />
          <Setting label="Auth" value="Stub mode for MVP" />
          <Setting label="AI provider" value="Local fallback unless OPENAI_API_KEY or ANTHROPIC_API_KEY is set" />
          <Setting label="Email alerts" value="Local fallback unless RESEND_API_KEY, ALERT_EMAIL_TO, and EMAIL_FROM are configured" />
          <Setting label="Daily refresh" value="Run npm run refresh-jobs locally or schedule the command in a worker" />
          <Setting label="Discovery" value="Greenhouse and Lever only; unsupported employers are marked manual review needed" />
          <Setting label="Vercel" value="Set DATABASE_URL and environment variables, then run prisma generate during build" />
        </div>
      </div>
    </AppShell>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line pb-3 last:border-0 md:grid-cols-[180px_1fr]">
      <span className="font-medium">{label}</span>
      <span className="text-ink/65">{value}</span>
    </div>
  );
}
