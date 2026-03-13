import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/tables/users";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (e) {
    console.error("Failed to fetch users:", e);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
