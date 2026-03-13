import { getTableClient, ensureTables } from "../db";
import type { CheckIn } from "@/types";

const TABLE = "CheckIns" as const;

export async function getCheckInsForWeek(weekId: string): Promise<CheckIn[]> {
  await ensureTables();
  const checkins: CheckIn[] = [];
  const iter = getTableClient(TABLE).listEntities({
    queryOptions: { filter: `PartitionKey eq '${weekId}'` },
  });
  for await (const entity of iter) {
    checkins.push(entityToCheckIn(entity));
  }
  return checkins;
}

export async function getCheckIn(weekId: string, userId: string, date: string): Promise<CheckIn | null> {
  await ensureTables();
  try {
    const entity = await getTableClient(TABLE).getEntity(weekId, `${userId}_${date}`);
    return entityToCheckIn(entity);
  } catch (e: unknown) {
    if ((e as { statusCode?: number }).statusCode === 404) return null;
    throw e;
  }
}

export async function upsertCheckIn(checkin: CheckIn): Promise<void> {
  await ensureTables();
  await getTableClient(TABLE).upsertEntity({
    partitionKey: checkin.weekId,
    rowKey: `${checkin.userId}_${checkin.date}`,
    userId: checkin.userId,
    date: checkin.date,
    dayOfWeek: checkin.dayOfWeek,
    completionLevel: checkin.completionLevel,
    perceivedEffort: checkin.perceivedEffort,
    feelingStrong: checkin.feelingStrong,
    createdAt: checkin.createdAt,
  });
}

function entityToCheckIn(entity: Record<string, unknown>): CheckIn {
  return {
    weekId: entity.partitionKey as string,
    userId: (entity.userId as string) || "",
    date: (entity.date as string) || "",
    dayOfWeek: (entity.dayOfWeek as number) || 1,
    completionLevel: (entity.completionLevel as CheckIn["completionLevel"]) || "exact",
    perceivedEffort: (entity.perceivedEffort as number) || 3,
    feelingStrong: (entity.feelingStrong as number) || 3,
    createdAt: (entity.createdAt as string) || "",
  };
}
