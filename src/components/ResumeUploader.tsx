"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { extractSkillsFromResume } from "@/lib/resume";

const maxResumeBytes = 1024 * 1024;

export function ResumeUploader() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const skills = useMemo(() => extractSkillsFromResume(text), [text]);

  async function handleFile(file?: File) {
    if (!file) return;
    setIsLoading(true);
    setError("");
    setFileName(file.name);

    try {
      const lowerName = file.name.toLowerCase();
      if (file.size > maxResumeBytes) {
        setError("Resume file is too large. Upload a TXT or Markdown file under 1 MB.");
        setText("");
        return;
      }

      if (lowerName.endsWith(".pdf") || file.type.includes("pdf")) {
        setError("PDF upload is recognized, but V2 starts with TXT and Markdown text extraction. PDF parsing is tracked in the roadmap.");
        setText("");
        return;
      }

      if (!lowerName.endsWith(".txt") && !lowerName.endsWith(".md") && !file.type.startsWith("text/")) {
        setError("Unsupported file type. Upload a TXT or Markdown resume for now.");
        setText("");
        return;
      }

      setText((await file.text()).trim());
    } catch {
      setError("Could not read the resume file. Try a plain text export.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5 rounded-md border border-line bg-white p-5 shadow-soft">
      <label className="grid cursor-pointer place-items-center rounded-md border border-dashed border-line bg-cloud px-5 py-8 text-center">
        <Upload className="h-8 w-8 text-moss" />
        <span className="mt-3 text-sm font-semibold">Upload TXT or Markdown resume</span>
        <span className="mt-1 text-xs text-ink/55">PDF is detected and kept as a roadmap TODO.</span>
        <input className="sr-only" type="file" accept=".txt,.md,.markdown,.pdf,text/plain,text/markdown,application/pdf" onChange={(event) => handleFile(event.target.files?.[0])} />
      </label>

      {isLoading ? <p className="text-sm text-ink/60">Extracting resume text...</p> : null}
      {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
      {fileName && !error ? <p className="text-sm text-ink/55">Loaded {fileName}</p> : null}

      <label className="text-sm font-medium">
        Resume text
        <textarea
          className="mt-2 min-h-64 rounded-md border border-line px-3 py-2"
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a resume or upload TXT/Markdown."
          value={text}
        />
      </label>

      <section>
        <h2 className="text-sm font-semibold">Extracted skills</h2>
        {skills.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="rounded-md bg-cloud px-2 py-1 text-xs font-medium text-ink/75">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink/55">No known skills detected yet.</p>
        )}
      </section>
    </div>
  );
}
