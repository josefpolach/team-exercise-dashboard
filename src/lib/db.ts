import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;

const clients = new Map<string, TableClient>();

const TABLE_NAMES = ["Users", "WeeklyPlans", "CheckIns", "HighFives"] as const;

export type TableName = (typeof TABLE_NAMES)[number];

export function getTableClient(tableName: TableName): TableClient {
  if (!clients.has(tableName)) {
    const client = TableClient.fromConnectionString(connectionString, tableName);
    clients.set(tableName, client);
  }
  return clients.get(tableName)!;
}

let tablesEnsured = false;

export async function ensureTables(): Promise<void> {
  if (tablesEnsured) return;
  await Promise.all(
    TABLE_NAMES.map((name) =>
      getTableClient(name).createTable().catch(() => {
        // Table already exists — ignore
      })
    )
  );
  tablesEnsured = true;
}
