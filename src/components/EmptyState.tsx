import { Inbox } from "lucide-react";

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-8 text-center">
      <Inbox className="mx-auto h-8 w-8 text-ink/35" />
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
