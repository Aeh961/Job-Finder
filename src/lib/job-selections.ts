import type { NormalizedJob } from "./types";

export type JobSelectionState = "saved" | "ignored";

export type DemoJobSelection = {
  jobId: string;
  state: JobSelectionState;
  note?: string;
};

export function applyJobSelection(jobs: NormalizedJob[], selections: DemoJobSelection[], state?: JobSelectionState) {
  const selectionMap = new Map(selections.map((selection) => [selection.jobId, selection]));
  return jobs
    .map((job) => ({ job, selection: selectionMap.get(job.id) }))
    .filter((item) => (state ? item.selection?.state === state : item.selection?.state !== "ignored"));
}

export function summarizeSelections(selections: DemoJobSelection[]) {
  return selections.reduce(
    (summary, selection) => {
      summary[selection.state] += 1;
      return summary;
    },
    { saved: 0, ignored: 0 }
  );
}
