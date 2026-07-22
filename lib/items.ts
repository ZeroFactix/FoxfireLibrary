import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items as itemsTable } from "@/lib/db/schema";
import type { Item } from "@/lib/types";

type ItemRow = typeof itemsTable.$inferSelect;

function rowToItem(row: ItemRow): Item {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    photoUrl: row.photoUrl ?? undefined,
    condition: row.condition,
    lendType: row.lendType,
    rentalRate:
      row.rentalRateAmount != null && row.rentalRatePeriod
        ? { amount: row.rentalRateAmount, period: row.rentalRatePeriod }
        : undefined,
    status: row.status,
    currentHolder: row.currentHolderName
      ? { name: row.currentHolderName, dueBack: row.currentHolderDueBack ?? undefined }
      : undefined,
    tags: row.tags ?? undefined,
  };
}

export async function getAllItems(): Promise<Item[]> {
  const rows = await db.select().from(itemsTable);
  return rows.map(rowToItem);
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const rows = await db.select().from(itemsTable).where(eq(itemsTable.id, id));
  return rows[0] ? rowToItem(rows[0]) : undefined;
}

export async function getAllCategories(): Promise<string[]> {
  const rows = await db.select().from(itemsTable);
  return Array.from(new Set(rows.map((row) => row.category))).sort();
}
