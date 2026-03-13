"use client";

import { useState } from "react";
import type { WeeklyPlan } from "@/types";

interface Props {
  weekId: string;
  existingPlan: WeeklyPlan | null;
}

export default function PlanEditor({ weekId, existingPlan }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(existingPlan?.description || "");
  const [videoUrl, setVideoUrl] = useState(existingPlan?.videoUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId,
          description: description.trim(),
          videoUrl: videoUrl.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba");
      }
      setSaved(true);
      setIsEditing(false);
      // Reload to see updated plan
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    }
    setSubmitting(false);
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-accent hover:text-orange-600 font-medium transition-colors"
      >
        {existingPlan ? "✏️ Upravit plán" : "➕ Přidat plán"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-1">Popis cvičení</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-stone-200 p-3 text-stone-700 focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-y"
          placeholder="Např. 3x kliky, 3x dřepy, 30s plank..."
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-1">
          Odkaz na video (nepovinné)
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full rounded-xl border border-stone-200 p-3 text-stone-700 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!description.trim() || submitting}
          className="flex-1 py-3 rounded-xl font-medium text-white bg-accent hover:bg-orange-600 transition-colors disabled:bg-stone-200 disabled:text-stone-400"
        >
          {submitting ? "Ukládám..." : "Uložit plán"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-3 rounded-xl font-medium text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
