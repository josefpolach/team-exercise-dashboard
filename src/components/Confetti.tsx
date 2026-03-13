"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const CONGRATS = [
  "Bomba! 💣",
  "Tak to je pecka! 🔥",
  "Parádní práce! 👏",
  "Dneska jsi to rozjel/a! 🚀",
  "Ty jsi mašina! 🦾",
  "Skvělá práce, šéfe! 💪",
  "Respekt! 🫡",
  "Tak se mi to líbí! 🎉",
  "Beast mode ON! 🐻",
  "High five! 🙌",
];

export default function Confetti({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return;
    // Fire confetti from both sides
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.3, y: 0.6 },
      colors: ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ef4444"],
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.7, y: 0.6 },
      colors: ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ef4444"],
    });
  }, [show]);

  if (!show) return null;

  const message = CONGRATS[Math.floor(Math.random() * CONGRATS.length)];

  return (
    <div className="text-center py-8 animate-pop-in">
      <div className="text-4xl mb-3">🎉</div>
      <div className="text-2xl font-bold text-stone-900">{message}</div>
      <p className="text-stone-500 mt-2">Tvůj check-in je uložený. Tak zase zítra! 💪</p>
      <a
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-accent text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors"
      >
        Zpět na přehled
      </a>
    </div>
  );
}
