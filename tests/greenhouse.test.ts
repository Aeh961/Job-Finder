import { describe, expect, it } from "vitest";
import { parseGreenhouseJobs } from "@/lib/integrations/greenhouse";

describe("parseGreenhouseJobs", () => {
  it("normalizes Greenhouse jobs", () => {
    const jobs = parseGreenhouseJobs(
      {
        jobs: [
          {
            id: 123,
            title: "Software Engineer",
            absolute_url: "https://boards.greenhouse.io/acme/jobs/123",
            location: { name: "Remote" },
            departments: [{ name: "Engineering" }],
            content: "<p>Build things</p>"
          }
        ]
      },
      { id: "acme", name: "Acme", boardToken: "acme" }
    );

    expect(jobs[0]).toMatchObject({
      sourceProvider: "greenhouse",
      externalId: "123",
      title: "Software Engineer",
      description: "Build things"
    });
  });
});
