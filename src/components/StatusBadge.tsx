import type { ApplicationStatus } from "@/lib/types";

const labels: Record<ApplicationStatus, string> = {
  discovered: "Discovered",
  interested: "Interested",
  applied: "Applied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer"
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className="rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-ink/70">{labels[status]}</span>;
}
