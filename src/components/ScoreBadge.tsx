export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-moss text-white" : score >= 60 ? "bg-coral text-white" : "bg-ink/10 text-ink";
  return <span className={`inline-flex min-w-14 justify-center rounded-md px-2 py-1 text-sm font-semibold ${color}`}>{score}</span>;
}
