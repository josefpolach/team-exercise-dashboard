import { getTableClient, ensureTables } from "../db";
import type { User } from "@/types";

const TABLE = "Users" as const;

export async function getUser(userId: string): Promise<User | null> {
  await ensureTables();
  try {
    const entity = await getTableClient(TABLE).getEntity("user", userId);
    return entityToUser(entity);
  } catch (e: unknown) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function upsertUser(user: User): Promise<void> {
  await ensureTables();
  await getTableClient(TABLE).upsertEntity({
    partitionKey: "user",
    rowKey: user.userId,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
}

export async function getAllUsers(): Promise<User[]> {
  await ensureTables();
  const users: User[] = [];
  const iter = getTableClient(TABLE).listEntities({
    queryOptions: { filter: "PartitionKey eq 'user'" },
  });
  for await (const entity of iter) {
    users.push(entityToUser(entity));
  }
  // Sort: coaches first, then alphabetically
  return users.sort((a, b) => {
    if (a.role !== b.role) return a.role === "coach" ? -1 : 1;
    return a.displayName.localeCompare(b.displayName, "cs");
  });
}

function entityToUser(entity: Record<string, unknown>): User {
  return {
    userId: entity.rowKey as string,
    displayName: (entity.displayName as string) || "",
    email: (entity.email as string) || "",
    role: (entity.role as "coach" | "member") || "member",
    createdAt: (entity.createdAt as string) || "",
  };
}

function isNotFound(e: unknown): boolean {
  return (e as { statusCode?: number }).statusCode === 404;
}
