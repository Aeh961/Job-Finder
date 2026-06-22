export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div className="animate-pulse rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="h-3 w-28 rounded bg-line" />
      <div className="mt-4 h-5 w-2/3 rounded bg-line" />
      <div className="mt-3 h-3 w-full rounded bg-line" />
      <div className="mt-2 h-3 w-5/6 rounded bg-line" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
