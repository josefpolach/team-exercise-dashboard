import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/tables/plans";
import { getCurrentWeekId } from "@/lib/week";
import Nav from "@/components/Nav";
import WeekNav from "@/components/WeekNav";
import PlanView from "@/components/PlanView";
import PlanEditor from "@/components/PlanEditor";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function PlanPage({ searchParams }: Props) {
  const params = await searchParams;
  const weekId = params.week || getCurrentWeekId();

  const [currentUser, plan] = await Promise.all([
    getCurrentUser(),
    getPlan(weekId),
  ]);

  const isCoach = currentUser.role === "coach";

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath="/plan" isCoach={isCoach} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">Týdenní plán</h1>
          {isCoach && <PlanEditor weekId={weekId} existingPlan={plan} />}
        </div>

        <WeekNav weekId={weekId} />
        <PlanView plan={plan} />
      </main>
    </div>
  );
}
