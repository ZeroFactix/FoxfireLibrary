import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items as itemsTable } from "@/lib/db/schema";
import type { CurrentHolder, Item, ItemStatus } from "@/lib/types";

type ItemRow = typeof itemsTable.$inferSelect;

export type ItemInput = Omit<Item, "id">;

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

// Maps a normalized ItemInput onto database columns, enforcing invariants:
// rental rate only applies to rentals, and holder details only to items that
// aren't available.
function inputToColumns(input: ItemInput) {
  const isRental = input.lendType === "rental";
  const isHeld = input.status !== "available";
  return {
    name: input.name,
    category: input.category,
    description: input.description,
    photoUrl: input.photoUrl || null,
    condition: input.condition,
    lendType: input.lendType,
    rentalRateAmount: isRental ? input.rentalRate?.amount ?? null : null,
    rentalRatePeriod: isRental ? input.rentalRate?.period ?? null : null,
    status: input.status,
    currentHolderName: isHeld ? input.currentHolder?.name || null : null,
    currentHolderDueBack: isHeld ? input.currentHolder?.dueBack || null : null,
    tags: input.tags && input.tags.length > 0 ? input.tags : null,
  };
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

async function generateUniqueId(name: string): Promise<string> {
  const base = slugify(name);
  const existing = await db.select({ id: itemsTable.id }).from(itemsTable);
  const ids = new Set(existing.map((row) => row.id));
  if (!ids.has(base)) return base;
  let n = 2;
  while (ids.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
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

export async function createItem(input: ItemInput): Promise<string> {
  const id = await generateUniqueId(input.name);
  await db.insert(itemsTable).values({ id, ...inputToColumns(input) });
  return id;
}

export async function updateItem(id: string, input: ItemInput): Promise<void> {
  await db.update(itemsTable).set(inputToColumns(input)).where(eq(itemsTable.id, id));
}

export async function deleteItem(id: string): Promise<void> {
  await db.delete(itemsTable).where(eq(itemsTable.id, id));
}

export async function setItemStatus(
  id: string,
  status: ItemStatus,
  holder?: CurrentHolder
): Promise<void> {
  const isHeld = status !== "available";
  await db
    .update(itemsTable)
    .set({
      status,
      currentHolderName: isHeld ? holder?.name || null : null,
      currentHolderDueBack: isHeld ? holder?.dueBack || null : null,
    })
    .where(eq(itemsTable.id, id));
}
