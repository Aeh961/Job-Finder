import { describe, expect, it } from "vitest";
import { scoreJobMatch } from "@/lib/scoring";
import type { NormalizedJob, UserProfileInput } from "@/lib/types";

const profile: UserProfileInput = {
  skills: ["TypeScript", "React", "PostgreSQL"],
  desiredTitles: ["Full Stack Engineer"],
  preferredLocations: ["Remote"],
  workMode: "remote",
  needsSponsorship: false,
  seniority: "mid",
  interests: ["AI"]
};

const job: NormalizedJob = {
  id: "1",
  employerId: "acme",
  employerName: "Acme",
  sourceProvider: "greenhouse",
  externalId: "1",
  title: "Full Stack Engineer",
  location: "Remote",
  workMode: "remote",
  description: "Build AI products with TypeScript, React, and PostgreSQL.",
  sourceUrl: "https://example.com/api",
  originalJobUrl: "https://example.com/job"
};

describe("scoreJobMatch", () => {
  it("scores a strong role highly and explains why", () => {
    const result = scoreJobMatch(profile, job, [{ id: "acme", name: "Acme", boardProvider: "greenhouse", priority: 5 }]);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.whyMatched.length).toBeGreaterThan(2);
    expect(result.missingSkills).toEqual([]);
  });

  it("penalizes missing skills and location mismatch", () => {
    const result = scoreJobMatch(profile, { ...job, title: "Data Analyst", location: "Berlin", workMode: "onsite", description: "SQL reporting." });
    expect(result.score).toBeLessThan(70);
    expect(result.missingSkills).toContain("TypeScript");
  });
});
