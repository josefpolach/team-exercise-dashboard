import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getHighFivesForWeek, upsertHighFive, removeHighFive } from "@/lib/tables/highfives";
import { getCurrentWeekId, getWeekId } from "@/lib/week";

export async function GET(request: NextRequest) {
  try {
    const week = request.nextUrl.searchParams.get("week") || getCurrentWeekId();
    const highfives = await getHighFivesForWeek(week);
    return NextResponse.json(highfives);
  } catch (e) {
    console.error("Failed to fetch highfives:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { toUserId, date } = body as { toUserId: string; date: string };

    if (!toUserId || !date) {
      return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
    }

    if (toUserId === user.userId) {
      return NextResponse.json({ error: "Nemůžeš dát high-five sám sobě" }, { status: 400 });
    }

    const weekId = getWeekId(new Date(date));

    await upsertHighFive({
      weekId,
      fromUserId: user.userId,
      toUserId,
      date,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to create highfive:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { toUserId, date } = body as { toUserId: string; date: string };

    const weekId = getWeekId(new Date(date));
    await removeHighFive(weekId, user.userId, toUserId, date);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to remove highfive:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
