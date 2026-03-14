import { headers } from "next/headers";
import { getUser, upsertUser } from "./tables/users";
import type { User } from "@/types";

function decodeJwtPayload(token: string): Record<string, string> {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export async function getCurrentUser(): Promise<User> {
  const h = await headers();

  let userId = h.get("x-ms-client-principal-id");
  let displayName = h.get("x-ms-client-principal-name");
  let email = "";

  // Get user info from Google ID token
  const idToken = h.get("x-ms-token-google-id-token");
  if (idToken) {
    const claims = decodeJwtPayload(idToken);
    email = claims.email || "";
    if (!displayName) {
      displayName = claims.name || claims.given_name || "";
    }
  }

  // Local development fallback
  if (!userId && process.env.NODE_ENV === "development") {
    userId = process.env.DEV_USER_ID || "dev-user-1";
    displayName = process.env.DEV_USER_NAME || "Dev User";
    email = process.env.DEV_USER_EMAIL || "dev@local";
  }

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const coachIds = (process.env.COACH_USER_IDS || "").split(",").map((s) => s.trim());
  const role = coachIds.includes(userId) ? "coach" : "member";

  // Check if user exists
  const existing = await getUser(userId);
  if (existing) {
    // Update role and display info in case they changed
    const updated: User = {
      ...existing,
      role,
      displayName: displayName || existing.displayName,
      email: email || existing.email,
    };
    if (updated.role !== existing.role || updated.displayName !== existing.displayName || updated.email !== existing.email) {
      await upsertUser(updated);
    }
    return updated;
  }

  // Auto-provision new user
  const newUser: User = {
    userId,
    displayName: displayName || email || userId,
    email: email || "",
    role,
    createdAt: new Date().toISOString(),
  };

  await upsertUser(newUser);
  return newUser;
}
