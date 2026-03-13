"use client";

import { useState } from "react";
import { COMPLETION_EMOJI, EFFORT_EMOJI, STRENGTH_EMOJI } from "@/types";
import type { CheckIn, HighFive } from "@/types";

interface Props {
  checkIn: CheckIn | null;
  isToday: boolean;
  isPast: boolean;
  isSelf: boolean;
  highFiveCount: number;
  hasGivenHighFive: boolean;
  userId: string;
  date: string;
  currentUserId: string;
}

export default function CheckInCell({
  checkIn,
  isToday,
  isPast,
  isSelf,
  highFiveCount,
  hasGivenHighFive,
  userId,
  date,
  currentUserId,
}: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [hfCount, setHfCount] = useState(highFiveCount);
  const [hasHf, setHasHf] = useState(hasGivenHighFive);
  const [hfLoading, setHfLoading] = useState(false);

  if (!checkIn && isToday && isSelf) {
    return (
      <a
        href="/checkin"
        className="flex items-center justify-center w-full h-full min-h-[48px] rounded-xl border-2 border-dashed border-accent/40 hover:border-accent hover:bg-accent-light transition-all animate-pulse-soft"
        title="Zaznamenat cvičení"
      >
        <span className="text-accent text-xl">+</span>
      </a>
    );
  }

  if (!checkIn) {
    return (
      <div
        className={`flex items-center justify-center w-full h-full min-h-[48px] rounded-xl ${
          isPast ? "bg-stone-50 text-stone-300" : "bg-stone-50/50"
        }`}
      >
        {isPast ? "–" : ""}
      </div>
    );
  }

  const completion = COMPLETION_EMOJI[checkIn.completionLevel];
  const effort = EFFORT_EMOJI[checkIn.perceivedEffort];
  const strength = STRENGTH_EMOJI[checkIn.feelingStrong];

  async function toggleHighFive() {
    if (isSelf || hfLoading) return;
    setHfLoading(true);
    try {
      if (hasHf) {
        await fetch("/api/highfives", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toUserId: userId, date }),
        });
        setHfCount((c) => Math.max(0, c - 1));
        setHasHf(false);
      } else {
        await fetch("/api/highfives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toUserId: userId, date }),
        });
        setHfCount((c) => c + 1);
        setHasHf(true);
      }
    } catch {
      // Ignore errors
    }
    setHfLoading(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className={`flex flex-col items-center justify-center w-full min-h-[48px] rounded-xl transition-all hover:scale-105 ${
          isToday ? "bg-accent-light ring-2 ring-accent/30" : "bg-white"
        } shadow-sm hover:shadow-md`}
      >
        <span className="text-xl">{completion.emoji}</span>
        {hfCount > 0 && (
          <span className="text-xs text-stone-400 mt-0.5">
            🙌 {hfCount}
          </span>
        )}
      </button>

      {showDetail && (
        <div className="absolute z-20 top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 min-w-[160px] animate-pop-in">
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Splnění:</span>
              <span>{completion.emoji} {completion.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Námaha:</span>
              <span>{effort.emoji} {effort.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Síla:</span>
              <span>{strength.emoji} {strength.label}</span>
            </div>
          </div>
          {!isSelf && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHighFive();
              }}
              disabled={hfLoading}
              className={`mt-2 w-full py-1.5 rounded-xl text-sm font-medium transition-colors ${
                hasHf
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {hasHf ? "🙌 High five dáno!" : "🙌 Dát high five"}
            </button>
          )}
          <button
            onClick={() => setShowDetail(false)}
            className="mt-1 w-full text-xs text-stone-400 hover:text-stone-600"
          >
            zavřít
          </button>
        </div>
      )}
    </div>
  );
}
