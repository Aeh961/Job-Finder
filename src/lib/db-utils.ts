import type { ApplicationStatus, BoardProvider, WorkMode } from "./types";

export const applicationStatuses: ApplicationStatus[] = ["discovered", "interested", "applied", "interview", "rejected", "offer"];

export function parseCsvInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isSupportedBoard(provider: string): provider is Extract<BoardProvider, "greenhouse" | "lever"> {
  return provider === "greenhouse" || provider === "lever";
}

export function normalizeWorkMode(value: string): WorkMode {
  const normalized = value.toLowerCase();
  if (normalized.includes("remote")) return "remote";
  if (normalized.includes("hybrid")) return "hybrid";
  if (normalized.includes("site") || normalized.includes("office")) return "onsite";
  return "flexible";
}

export function nextApplicationStatus(status: ApplicationStatus): ApplicationStatus {
  const index = applicationStatuses.indexOf(status);
  return applicationStatuses[Math.min(index + 1, applicationStatuses.length - 1)];
}
