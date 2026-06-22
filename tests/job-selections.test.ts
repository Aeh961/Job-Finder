import { describe, expect, it } from "vitest";
import { demoJobSelections, demoJobs } from "@/lib/demo-data";
import { applyJobSelection, summarizeSelections } from "@/lib/job-selections";

describe("job selections", () => {
  it("summarizes saved and ignored jobs", () => {
    expect(summarizeSelections(demoJobSelections)).toEqual({ saved: 2, ignored: 1 });
  });

  it("filters ignored jobs out of active review", () => {
    const active = applyJobSelection(demoJobs, demoJobSelections);
    expect(active.some(({ selection }) => selection?.state === "ignored")).toBe(false);
  });
});
