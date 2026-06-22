const knownSkills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "PostgreSQL",
  "MySQL",
  "Prisma",
  "GraphQL",
  "REST",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "OpenAI",
  "Anthropic",
  "Machine Learning",
  "Data Structures",
  "System Design",
  "CI/CD"
];

const maxResumeBytes = 1024 * 1024;

export type ResumeUploadInput = {
  fileName: string;
  mimeType?: string;
  content: string | Buffer;
};

export type ResumeExtractionResult =
  | { ok: true; text: string; fileType: "txt" | "markdown"; warnings: string[] }
  | { ok: false; error: string; fileType: "pdf" | "unsupported" };

export function extractResumeText(input: ResumeUploadInput): ResumeExtractionResult {
  const fileName = input.fileName.toLowerCase();
  const mimeType = input.mimeType?.toLowerCase() ?? "";
  const byteLength = Buffer.isBuffer(input.content) ? input.content.byteLength : Buffer.byteLength(input.content, "utf8");

  if (byteLength > maxResumeBytes) {
    return {
      ok: false,
      fileType: "unsupported",
      error: "Resume file is too large. Upload a TXT or Markdown file under 1 MB."
    };
  }

  if (fileName.endsWith(".pdf") || mimeType.includes("pdf")) {
    return {
      ok: false,
      fileType: "pdf",
      error: "PDF upload is recognized, but PDF text extraction is a V2 TODO. Upload TXT or Markdown for now."
    };
  }

  const isText =
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md") ||
    mimeType.startsWith("text/") ||
    mimeType.includes("markdown");

  if (!isText) {
    return {
      ok: false,
      fileType: "unsupported",
      error: "Unsupported resume file type. Upload TXT or Markdown for this MVP."
    };
  }

  const rawText = Buffer.isBuffer(input.content) ? input.content.toString("utf8") : input.content;
  const text = rawText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (!text) {
    return { ok: false, fileType: "unsupported", error: "Resume file was empty." };
  }

  return {
    ok: true,
    text,
    fileType: fileName.endsWith(".md") ? "markdown" : "txt",
    warnings: text.length < 400 ? ["Resume text is short; scoring may be less accurate."] : []
  };
}

export function extractSkillsFromResume(text: string) {
  const normalized = text.toLowerCase();
  return knownSkills.filter((skill) => normalized.includes(skill.toLowerCase())).sort((a, b) => a.localeCompare(b));
}

export function buildResumeSummary(text: string) {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 24);

  return firstLine ?? "Resume uploaded and ready for profile enrichment.";
}
