import { describe, expect, it } from "vitest";
import { parseLeverJobs } from "@/lib/integrations/lever";

describe("parseLeverJobs", () => {
  it("normalizes Lever postings", () => {
    const jobs = parseLeverJobs(
      [
        {
          id: "abc",
          text: "Product Engineer",
          hostedUrl: "https://jobs.lever.co/acme/abc",
          categories: { team: "Engineering", location: "Remote" },
          descriptionPlain: "Build product workflows",
          lists: [{ text: "Requirements", content: "React and TypeScript" }]
        }
      ],
      { id: "acme", name: "Acme", boardToken: "acme" }
    );

    expect(jobs[0].description).toContain("React and TypeScript");
    expect(jobs[0].originalJobUrl).toBe("https://jobs.lever.co/acme/abc");
  });
});
