import { getCurrentUser } from "@/lib/auth";
import { getCheckIn } from "@/lib/tables/checkins";
import { getPlan } from "@/lib/tables/plans";
import { getCurrentWeekId, formatDate, getWeekId } from "@/lib/week";
import Nav from "@/components/Nav";
import CheckInForm from "@/components/CheckInForm";
import PlanView from "@/components/PlanView";

export default async function CheckInPage() {
  const currentUser = await getCurrentUser();
  const today = new Date();
  const weekId = getWeekId(today);
  const dateStr = formatDate(today);

  const [existingCheckIn, plan] = await Promise.all([
    getCheckIn(weekId, currentUser.userId, dateStr),
    getPlan(weekId),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath="/checkin" isCoach={currentUser.role === "coach"} />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900">Dnešní check-in</h1>
          <p className="text-stone-500 mt-1">
            {new Date().toLocaleDateString("cs-CZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Show today's plan summary */}
        {plan && (
          <details className="bg-white rounded-2xl shadow-sm border border-stone-100">
            <summary className="p-4 cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-900">
              📋 Dnešní plán (klikni pro zobrazení)
            </summary>
            <div className="px-4 pb-4">
              <div className="text-sm text-stone-600 whitespace-pre-wrap">{plan.description}</div>
            </div>
          </details>
        )}

        <CheckInForm existingCheckIn={existingCheckIn} />
      </main>
    </div>
  );
}
