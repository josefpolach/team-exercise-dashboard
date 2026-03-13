import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPlan, upsertPlan } from "@/lib/tables/plans";
import { getCurrentWeekId } from "@/lib/week";

export async function GET(request: NextRequest) {
  try {
    const week = request.nextUrl.searchParams.get("week") || getCurrentWeekId();
    const plan = await getPlan(week);
    return NextResponse.json(plan);
  } catch (e) {
    console.error("Failed to fetch plan:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user.role !== "coach") {
      return NextResponse.json({ error: "Pouze trenér může vytvořit plán" }, { status: 403 });
    }

    const body = await request.json();
    const { weekId, description, videoUrl } = body as {
      weekId: string;
      description: string;
      videoUrl?: string;
    };

    if (!weekId || !description) {
      return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
    }

    const existing = await getPlan(weekId);
    const now = new Date().toISOString();

    await upsertPlan({
      weekId,
      description,
      videoUrl: videoUrl || undefined,
      createdBy: user.userId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to create plan:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
