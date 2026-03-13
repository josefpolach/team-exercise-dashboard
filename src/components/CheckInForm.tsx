"use client";

import { useState } from "react";
import EmojiScale from "./EmojiScale";
import Confetti from "./Confetti";
import type { CompletionLevel, CheckIn } from "@/types";

const COMPLETION_OPTIONS: { value: CompletionLevel; emoji: string; label: string }[] = [
  { value: "less", emoji: "😅", label: "Méně" },
  { value: "exact", emoji: "✅", label: "Přesně" },
  { value: "more", emoji: "🚀", label: "Více" },
];

const EFFORT_OPTIONS = [
  { value: 1, emoji: "😴", label: "Pohodička" },
  { value: 2, emoji: "🙂", label: "V pohodě" },
  { value: 3, emoji: "😤", label: "Dalo to" },
  { value: 4, emoji: "🔥", label: "Pecka" },
  { value: 5, emoji: "💀", label: "Umírám" },
];

const STRENGTH_OPTIONS = [
  { value: 1, emoji: "🤕", label: "Slabota" },
  { value: 2, emoji: "😐", label: "Normál" },
  { value: 3, emoji: "💪", label: "Silný/á" },
  { value: 4, emoji: "🦾", label: "Mašina" },
  { value: 5, emoji: "🏆", label: "Šampión" },
];

interface Props {
  existingCheckIn: CheckIn | null;
}

export default function CheckInForm({ existingCheckIn }: Props) {
  const [completion, setCompletion] = useState<CompletionLevel | null>(
    existingCheckIn?.completionLevel || null
  );
  const [effort, setEffort] = useState<number | null>(
    existingCheckIn?.perceivedEffort || null
  );
  const [strength, setStrength] = useState<number | null>(
    existingCheckIn?.feelingStrong || null
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = completion !== null && effort !== null && strength !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completionLevel: completion,
          perceivedEffort: effort,
          feelingStrong: strength,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return <Confetti show={true} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Completion */}
      <div>
        <div className="text-sm font-medium text-stone-600 mb-2">Jak jsi to zvládl/a?</div>
        <div className="flex gap-3 justify-center">
          {COMPLETION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCompletion(opt.value)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all ${
                completion === opt.value
                  ? "bg-accent-light ring-2 ring-accent scale-110 shadow-md"
                  : "bg-white hover:bg-stone-50 hover:scale-105"
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="text-sm font-medium text-stone-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Effort */}
      <EmojiScale
        label="Jaká byla námaha?"
        options={EFFORT_OPTIONS}
        value={effort}
        onChange={setEffort}
      />

      {/* Strength */}
      <EmojiScale
        label="Jak silně ses cítil/a?"
        options={STRENGTH_OPTIONS}
        value={strength}
        onChange={setStrength}
      />

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</div>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
          isValid
            ? "bg-accent text-white hover:bg-orange-600 hover:shadow-lg active:scale-95"
            : "bg-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        {submitting ? "Ukládám..." : existingCheckIn ? "Aktualizovat ✨" : "Hotovo! 🎉"}
      </button>

      {existingCheckIn && (
        <p className="text-sm text-center text-stone-400">
          Už máš dnešní check-in. Můžeš ho aktualizovat.
        </p>
      )}
    </form>
  );
}
