"use client";

interface EmojiOption {
  value: number;
  emoji: string;
  label: string;
}

interface Props {
  label: string;
  options: EmojiOption[];
  value: number | null;
  onChange: (value: number) => void;
}

export default function EmojiScale({ label, options, value, onChange }: Props) {
  return (
    <div>
      <div className="text-sm font-medium text-stone-600 mb-2">{label}</div>
      <div className="flex gap-2 justify-center">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              value === opt.value
                ? "bg-accent-light ring-2 ring-accent scale-110 shadow-md"
                : "bg-white hover:bg-stone-50 hover:scale-105"
            }`}
          >
            <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
            <span className="text-xs text-stone-500">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
