import { getTableClient, ensureTables } from "../db";
import type { WeeklyPlan } from "@/types";

const TABLE = "WeeklyPlans" as const;

export async function getPlan(weekId: string): Promise<WeeklyPlan | null> {
  await ensureTables();
  try {
    const entity = await getTableClient(TABLE).getEntity("plan", weekId);
    return entityToPlan(entity);
  } catch (e: unknown) {
    if ((e as { statusCode?: number }).statusCode === 404) return null;
    throw e;
  }
}

export async function upsertPlan(plan: WeeklyPlan): Promise<void> {
  await ensureTables();
  await getTableClient(TABLE).upsertEntity({
    partitionKey: "plan",
    rowKey: plan.weekId,
    description: plan.description,
    videoUrl: plan.videoUrl || "",
    createdBy: plan.createdBy,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  });
}

function entityToPlan(entity: Record<string, unknown>): WeeklyPlan {
  return {
    weekId: entity.rowKey as string,
    description: (entity.description as string) || "",
    videoUrl: (entity.videoUrl as string) || undefined,
    createdBy: (entity.createdBy as string) || "",
    createdAt: (entity.createdAt as string) || "",
    updatedAt: (entity.updatedAt as string) || "",
  };
}
