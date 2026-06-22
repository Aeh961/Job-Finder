import { describe, expect, it } from "vitest";
import { renderEmailAlert, selectHighMatchJobs, sendEmailAlert } from "@/lib/email";
import { demoMatches } from "@/lib/demo-data";

describe("email alerts", () => {
  it("selects only high-match jobs", () => {
    const jobs = selectHighMatchJobs(demoMatches, 80);
    expect(jobs.every(({ match }) => match.score >= 80)).toBe(true);
  });

  it("renders a local fallback alert", () => {
    const message = renderEmailAlert({ jobs: demoMatches, threshold: 80 });
    expect(message).toContain("New high-match jobs");
    expect(message).toContain("https://");
  });

  it("sends through local fallback without credentials", async () => {
    const result = await sendEmailAlert({ jobs: demoMatches, threshold: 80 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.provider).toBe("local");
  });
});
