export interface User {
  userId: string;
  displayName: string;
  email: string;
  role: "coach" | "member";
  createdAt: string;
}

export interface WeeklyPlan {
  weekId: string;
  description: string;
  videoUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CompletionLevel = "less" | "exact" | "more";

export interface CheckIn {
  weekId: string;
  userId: string;
  date: string;
  dayOfWeek: number;
  completionLevel: CompletionLevel;
  perceivedEffort: number;
  feelingStrong: number;
  createdAt: string;
}

export interface HighFive {
  weekId: string;
  fromUserId: string;
  toUserId: string;
  date: string;
  createdAt: string;
}

export const EFFORT_EMOJI: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "\u{1F634}", label: "Pohodička" },
  2: { emoji: "\u{1F642}", label: "V pohodě" },
  3: { emoji: "\u{1F624}", label: "Dalo to" },
  4: { emoji: "\u{1F525}", label: "Pecka" },
  5: { emoji: "\u{1F480}", label: "Umírám" },
};

export const STRENGTH_EMOJI: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "\u{1F915}", label: "Slabota" },
  2: { emoji: "\u{1F610}", label: "Normál" },
  3: { emoji: "\u{1F4AA}", label: "Silný/á" },
  4: { emoji: "\u{1F9BE}", label: "Mašina" },
  5: { emoji: "\u{1F3C6}", label: "Šampión" },
};

export const COMPLETION_EMOJI: Record<CompletionLevel, { emoji: string; label: string }> = {
  less: { emoji: "\u{1F605}", label: "Méně" },
  exact: { emoji: "\u2705", label: "Přesně" },
  more: { emoji: "\u{1F680}", label: "Více" },
};
