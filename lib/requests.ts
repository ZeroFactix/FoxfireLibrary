import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { borrowRequests, items, users } from "@/lib/db/schema";
import type {
  BorrowRequest,
  BorrowRequestDetail,
  BorrowRequestStatus,
} from "@/lib/types";

type RequestRow = typeof borrowRequests.$inferSelect;

// Statuses where the item is still tied up with this request.
const OPEN_STATUSES: BorrowRequestStatus[] = ["active", "lent_out"];

function rowToRequest(row: RequestRow): BorrowRequest {
  return {
    id: row.id,
    itemId: row.itemId,
    requesterId: row.requesterId,
    message: row.message ?? undefined,
    startDate: row.startDate ?? undefined,
    endDate: row.endDate ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export type NewReservation = {
  itemId: string;
  requesterId: string;
  requesterName?: string | null;
  message?: string;
  startDate?: string;
  endDate?: string;
};

// Reserves an available item for a requester atomically: the item is only
// flipped to "reserved" if it is currently "available", so two people can't
// both grab it. Returns null if the item was no longer available.
export async function createReservation(
  input: NewReservation
): Promise<BorrowRequest | null> {
  const claimed = await db
    .update(items)
    .set({
      status: "reserved",
      currentHolderName: input.requesterName || "Reserved",
      currentHolderDueBack: input.endDate || null,
    })
    .where(and(eq(items.id, input.itemId), eq(items.status, "available")))
    .returning({ id: items.id });

  if (claimed.length === 0) {
    return null;
  }

  const [row] = await db
    .insert(borrowRequests)
    .values({
      itemId: input.itemId,
      requesterId: input.requesterId,
      message: input.message || null,
      startDate: input.startDate || null,
      endDate: input.endDate || null,
      status: "active",
    })
    .returning();

  return rowToRequest(row);
}

export async function getActiveRequestForItem(
  itemId: string
): Promise<BorrowRequest | null> {
  const rows = await db
    .select()
    .from(borrowRequests)
    .where(
      and(
        eq(borrowRequests.itemId, itemId),
        inArray(borrowRequests.status, OPEN_STATUSES)
      )
    );
  return rows[0] ? rowToRequest(rows[0]) : null;
}

export async function getRequestById(id: string): Promise<BorrowRequest | null> {
  const rows = await db
    .select()
    .from(borrowRequests)
    .where(eq(borrowRequests.id, id));
  return rows[0] ? rowToRequest(rows[0]) : null;
}

export async function getRequestsForUser(
  userId: string
): Promise<BorrowRequestDetail[]> {
  const rows = await db
    .select({
      request: borrowRequests,
      itemName: items.name,
    })
    .from(borrowRequests)
    .innerJoin(items, eq(borrowRequests.itemId, items.id))
    .where(eq(borrowRequests.requesterId, userId))
    .orderBy(desc(borrowRequests.createdAt));

  return rows.map((row) => ({
    ...rowToRequest(row.request),
    itemName: row.itemName,
  }));
}

export async function getAllRequestsForOwner(): Promise<BorrowRequestDetail[]> {
  const rows = await db
    .select({
      request: borrowRequests,
      itemName: items.name,
      requesterName: users.name,
      requesterEmail: users.email,
    })
    .from(borrowRequests)
    .innerJoin(items, eq(borrowRequests.itemId, items.id))
    .innerJoin(users, eq(borrowRequests.requesterId, users.id))
    .orderBy(desc(borrowRequests.createdAt));

  return rows.map((row) => ({
    ...rowToRequest(row.request),
    itemName: row.itemName,
    requesterName: row.requesterName ?? undefined,
    requesterEmail: row.requesterEmail ?? undefined,
  }));
}

export async function countOpenRequests(): Promise<number> {
  const rows = await db
    .select({ id: borrowRequests.id })
    .from(borrowRequests)
    .where(inArray(borrowRequests.status, OPEN_STATUSES));
  return rows.length;
}

// Owner marks a reserved item as physically handed over.
export async function markRequestLentOut(id: string): Promise<void> {
  const request = await getRequestById(id);
  if (!request || request.status !== "active") return;
  await db
    .update(items)
    .set({ status: "lent_out" })
    .where(eq(items.id, request.itemId));
  await db
    .update(borrowRequests)
    .set({ status: "lent_out" })
    .where(eq(borrowRequests.id, id));
}

// Completes a request and frees the item. Used both for "returned" (normal
// completion) and "cancelled"/"declined".
async function closeRequest(
  id: string,
  finalStatus: "returned" | "cancelled"
): Promise<void> {
  const request = await getRequestById(id);
  if (!request || !OPEN_STATUSES.includes(request.status)) return;
  await db
    .update(items)
    .set({ status: "available", currentHolderName: null, currentHolderDueBack: null })
    .where(eq(items.id, request.itemId));
  await db
    .update(borrowRequests)
    .set({ status: finalStatus })
    .where(eq(borrowRequests.id, id));
}

export async function markRequestReturned(id: string): Promise<void> {
  await closeRequest(id, "returned");
}

export async function cancelRequest(id: string): Promise<void> {
  await closeRequest(id, "cancelled");
}
