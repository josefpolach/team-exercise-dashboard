import Link from "next/link";
import { navigateWeek, formatWeekRange, getCurrentWeekId } from "@/lib/week";

export default function WeekNav({ weekId }: { weekId: string }) {
  const prevWeek = navigateWeek(weekId, -1);
  const nextWeek = navigateWeek(weekId, 1);
  const isCurrentWeek = weekId === getCurrentWeekId();

  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href={`/?week=${prevWeek}`}
        className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"
        title="Předchozí týden"
      >
        ←
      </Link>
      <div className="text-center">
        <div className="font-bold text-stone-900 text-lg">
          {isCurrentWeek ? "Tento týden" : weekId}
        </div>
        <div className="text-sm text-stone-500">{formatWeekRange(weekId)}</div>
      </div>
      <Link
        href={`/?week=${nextWeek}`}
        className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"
        title="Další týden"
      >
         →
      </Link>
    </div>
  );
}
