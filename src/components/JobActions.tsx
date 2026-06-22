import { Bookmark, EyeOff } from "lucide-react";
import { setJobSelectionAction } from "@/app/actions";

export function JobActions({ jobId, initialState, disabled = false }: { jobId: string; initialState?: "saved" | "ignored"; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={setJobSelectionAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="state" value="saved" />
        <button
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
            initialState === "saved" ? "border-moss bg-moss text-white" : "border-line bg-white text-ink"
          }`}
          disabled={disabled}
          type="submit"
        >
          <Bookmark className="h-4 w-4" />
          {initialState === "saved" ? "Saved" : "Save"}
        </button>
      </form>
      <form action={setJobSelectionAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="state" value="ignored" />
        <button
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
            initialState === "ignored" ? "border-coral bg-coral text-white" : "border-line bg-white text-ink"
          }`}
          disabled={disabled}
          type="submit"
        >
          <EyeOff className="h-4 w-4" />
          {initialState === "ignored" ? "Ignored" : "Ignore"}
        </button>
      </form>
    </div>
  );
}
