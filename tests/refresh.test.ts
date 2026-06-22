import { describe, expect, it } from "vitest";
import { demoProfile } from "@/lib/demo-data";
import { refreshJobsForUser } from "@/lib/refresh";

describe("refreshJobsForUser", () => {
  it("refreshes using local fallback data", async () => {
    const result = await refreshJobsForUser({ profile: demoProfile, threshold: 70, localFallback: true });
    expect(result.discoveredCount).toBeGreaterThan(0);
    expect(result.highMatchCount).toBeGreaterThan(0);
    expect(result.errors).toEqual([]);
  });
});
