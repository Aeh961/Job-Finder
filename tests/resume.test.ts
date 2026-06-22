import { describe, expect, it } from "vitest";
import { buildResumeSummary, extractResumeText, extractSkillsFromResume } from "@/lib/resume";

describe("resume utilities", () => {
  it("extracts text from TXT resumes", () => {
    const result = extractResumeText({
      fileName: "resume.txt",
      mimeType: "text/plain",
      content: "Software engineer with TypeScript, React, PostgreSQL, and Python experience."
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.text).toContain("Software engineer");
  });

  it("returns a clear PDF TODO", () => {
    const result = extractResumeText({ fileName: "resume.pdf", mimeType: "application/pdf", content: Buffer.from("pdf") });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("PDF");
  });

  it("extracts known skills and builds a summary", () => {
    const text = "Built Next.js apps with TypeScript, Prisma, PostgreSQL, Docker, and OpenAI integrations.";
    expect(extractSkillsFromResume(text)).toEqual(["Docker", "Next.js", "OpenAI", "PostgreSQL", "Prisma", "TypeScript"]);
    expect(buildResumeSummary(text)).toContain("Built Next.js");
  });
});
