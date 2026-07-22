"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isOwner } from "@/lib/owner";
import {
  cancelRequest,
  createReservation,
  getRequestById,
  markRequestLentOut,
  markRequestReturned,
} from "@/lib/requests";

function str(formData: FormData, key: string): string {
  return ((formData.get(key) as string) ?? "").trim();
}

function revalidateRequestPaths(itemId?: string) {
  revalidatePath("/");
  revalidatePath("/requests");
  revalidatePath("/manage");
  revalidatePath("/manage/requests");
  if (itemId) {
    revalidatePath(`/items/${itemId}`);
  }
}

export async function reserveItemAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to reserve an item.");
  }

  const itemId = str(formData, "itemId");
  if (!itemId) {
    throw new Error("Missing item.");
  }

  const reservation = await createReservation({
    itemId,
    requesterId: session.user.id,
    requesterName: session.user.name,
    message: str(formData, "message") || undefined,
    startDate: str(formData, "startDate") || undefined,
    endDate: str(formData, "endDate") || undefined,
  });

  if (!reservation) {
    throw new Error("Sorry — that item was just reserved by someone else.");
  }

  revalidateRequestPaths(itemId);
  redirect("/requests");
}

export async function cancelOwnRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  const requestId = str(formData, "requestId");
  const request = await getRequestById(requestId);
  if (!request) return;

  if (request.requesterId !== session.user.id && !isOwner(session)) {
    throw new Error("Not authorized.");
  }

  await cancelRequest(requestId);
  revalidateRequestPaths(request.itemId);
}

async function ownerRequestAction(
  formData: FormData,
  run: (id: string) => Promise<void>
) {
  const session = await auth();
  if (!isOwner(session)) {
    throw new Error("Not authorized.");
  }
  const requestId = str(formData, "requestId");
  const request = await getRequestById(requestId);
  if (!request) return;
  await run(requestId);
  revalidateRequestPaths(request.itemId);
}

export async function ownerMarkLentOutAction(formData: FormData) {
  await ownerRequestAction(formData, markRequestLentOut);
}

export async function ownerMarkReturnedAction(formData: FormData) {
  await ownerRequestAction(formData, markRequestReturned);
}

export async function ownerDeclineAction(formData: FormData) {
  await ownerRequestAction(formData, cancelRequest);
}
