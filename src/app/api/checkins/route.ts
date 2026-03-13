import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCheckInsForWeek, upsertCheckIn } from "@/lib/tables/checkins";
import { getCurrentWeekId, getWeekId, getDayOfWeek, formatDate } from "@/lib/week";
import type { CompletionLevel } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const week = request.nextUrl.searchParams.get("week") || getCurrentWeekId();
    const checkins = await getCheckInsForWeek(week);
    return NextResponse.json(checkins);
  } catch (e) {
    console.error("Failed to fetch checkins:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const { completionLevel, perceivedEffort, feelingStrong } = body as {
      completionLevel: CompletionLevel;
      perceivedEffort: number;
      feelingStrong: number;
    };

    if (!["less", "exact", "more"].includes(completionLevel)) {
      return NextResponse.json({ error: "Neplatná úroveň splnění" }, { status: 400 });
    }
    if (perceivedEffort < 1 || perceivedEffort > 5 || feelingStrong < 1 || feelingStrong > 5) {
      return NextResponse.json({ error: "Hodnocení musí být 1-5" }, { status: 400 });
    }

    const now = new Date();
    const date = formatDate(now);
    const weekId = getWeekId(now);

    await upsertCheckIn({
      weekId,
      userId: user.userId,
      date,
      dayOfWeek: getDayOfWeek(now),
      completionLevel,
      perceivedEffort,
      feelingStrong,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to create checkin:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
