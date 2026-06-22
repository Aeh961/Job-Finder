import { describe, expect, it } from "vitest";
import { isSupportedBoard, nextApplicationStatus, normalizeWorkMode, parseCsvInput } from "@/lib/db-utils";

describe("db utilities", () => {
  it("parses comma separated input", () => {
    expect(parseCsvInput("React, TypeScript, , SQL")).toEqual(["React", "TypeScript", "SQL"]);
  });

  it("detects supported boards", () => {
    expect(isSupportedBoard("greenhouse")).toBe(true);
    expect(isSupportedBoard("custom")).toBe(false);
  });

  it("normalizes work modes", () => {
    expect(normalizeWorkMode("Remote - US")).toBe("remote");
    expect(normalizeWorkMode("in office")).toBe("onsite");
  });

  it("advances application statuses", () => {
    expect(nextApplicationStatus("interested")).toBe("applied");
    expect(nextApplicationStatus("offer")).toBe("offer");
  });
});
