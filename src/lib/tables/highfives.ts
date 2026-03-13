import { getTableClient, ensureTables } from "../db";
import type { HighFive } from "@/types";

const TABLE = "HighFives" as const;

export async function getHighFivesForWeek(weekId: string): Promise<HighFive[]> {
  await ensureTables();
  const highfives: HighFive[] = [];
  const iter = getTableClient(TABLE).listEntities({
    queryOptions: { filter: `PartitionKey eq '${weekId}'` },
  });
  for await (const entity of iter) {
    highfives.push(entityToHighFive(entity));
  }
  return highfives;
}

export async function upsertHighFive(hf: HighFive): Promise<void> {
  await ensureTables();
  await getTableClient(TABLE).upsertEntity({
    partitionKey: hf.weekId,
    rowKey: `${hf.fromUserId}_${hf.toUserId}_${hf.date}`,
    fromUserId: hf.fromUserId,
    toUserId: hf.toUserId,
    date: hf.date,
    createdAt: hf.createdAt,
  });
}

export async function removeHighFive(weekId: string, fromUserId: string, toUserId: string, date: string): Promise<void> {
  await ensureTables();
  try {
    await getTableClient(TABLE).deleteEntity(weekId, `${fromUserId}_${toUserId}_${date}`);
  } catch (e: unknown) {
    if ((e as { statusCode?: number }).statusCode === 404) return;
    throw e;
  }
}

function entityToHighFive(entity: Record<string, unknown>): HighFive {
  return {
    weekId: entity.partitionKey as string,
    fromUserId: (entity.fromUserId as string) || "",
    toUserId: (entity.toUserId as string) || "",
    date: (entity.date as string) || "",
    createdAt: (entity.createdAt as string) || "",
  };
}
