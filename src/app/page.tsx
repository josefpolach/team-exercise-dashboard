import { getCurrentUser } from "@/lib/auth";
import { getAllUsers } from "@/lib/tables/users";
import { getCheckInsForWeek } from "@/lib/tables/checkins";
import { getHighFivesForWeek } from "@/lib/tables/highfives";
import { getCurrentWeekId } from "@/lib/week";
import { getRandomQuote } from "@/lib/quotes";
import Nav from "@/components/Nav";
import WeekNav from "@/components/WeekNav";
import WeeklyGrid from "@/components/WeeklyGrid";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const weekId = params.week || getCurrentWeekId();

  const [currentUser, users, checkIns, highFives] = await Promise.all([
    getCurrentUser(),
    getAllUsers(),
    getCheckInsForWeek(weekId),
    getHighFivesForWeek(weekId),
  ]);

  const quote = getRandomQuote();

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath="/" isCoach={currentUser.role === "coach"} />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Motivational quote */}
        <div className="text-center py-4 px-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
          <p className="text-stone-600 italic">&ldquo;{quote}&rdquo;</p>
        </div>

        {/* Week navigation */}
        <WeekNav weekId={weekId} />

        {/* Weekly grid */}
        <WeeklyGrid
          weekId={weekId}
          users={users}
          checkIns={checkIns}
          highFives={highFives}
          currentUserId={currentUser.userId}
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-sm text-stone-500 pt-2">
          <span>😅 Méně</span>
          <span>✅ Přesně</span>
          <span>🚀 Více</span>
          <span>🙌 High five</span>
          <span className="text-stone-300">– Necvičil/a</span>
        </div>
      </main>
    </div>
  );
}
