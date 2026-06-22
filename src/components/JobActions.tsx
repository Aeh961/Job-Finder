"use client";

import { useState, useTransition } from "react";
import { Bookmark, EyeOff } from "lucide-react";

export function JobActions({ initialState }: { initialState?: "saved" | "ignored" }) {
  const [state, setState] = useState<"saved" | "ignored" | undefined>(initialState);
  const [isPending, startTransition] = useTransition();

  function update(nextState: "saved" | "ignored") {
    startTransition(() => {
      setState((current) => (current === nextState ? undefined : nextState));
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
          state === "saved" ? "border-moss bg-moss text-white" : "border-line bg-white text-ink"
        }`}
        disabled={isPending}
        onClick={() => update("saved")}
        type="button"
      >
        <Bookmark className="h-4 w-4" />
        {isPending ? "Saving..." : state === "saved" ? "Saved" : "Save"}
      </button>
      <button
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
          state === "ignored" ? "border-coral bg-coral text-white" : "border-line bg-white text-ink"
        }`}
        disabled={isPending}
        onClick={() => update("ignored")}
        type="button"
      >
        <EyeOff className="h-4 w-4" />
        {isPending ? "Updating..." : state === "ignored" ? "Ignored" : "Ignore"}
      </button>
    </div>
  );
}
