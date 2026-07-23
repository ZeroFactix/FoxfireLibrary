"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createItem,
  deleteItem,
  setItemStatus,
  updateItem,
  type ItemInput,
} from "@/lib/items";
import { isOwner } from "@/lib/owner";
import type { ItemCondition, ItemStatus, LendType } from "@/lib/types";

async function assertOwner() {
  const session = await auth();
  if (!isOwner(session)) {
    throw new Error("Not authorized");
  }
}

function str(formData: FormData, key: string): string {
  return ((formData.get(key) as string) ?? "").trim();
}

function parseItemInput(formData: FormData): ItemInput {
  const lendType = (str(formData, "lendType") as LendType) || "loan";
  const status = (str(formData, "status") as ItemStatus) || "available";
  const rateAmount = str(formData, "rentalRateAmount");
  const holderName = str(formData, "currentHolderName");
  const holderDue = str(formData, "currentHolderDueBack");
  const tags = str(formData, "tags");

  const input: ItemInput = {
    name: str(formData, "name"),
    category: str(formData, "category"),
    description: str(formData, "description"),
    condition: (str(formData, "condition") as ItemCondition) || "good",
    lendType,
    rentalRate:
      lendType === "rental" && rateAmount
        ? {
            amount: Number(rateAmount),
            period: (str(formData, "rentalRatePeriod") as "day" | "week") || "day",
          }
        : undefined,
    status,
    currentHolder:
      status !== "available" && holderName
        ? { name: holderName, dueBack: holderDue || undefined }
        : undefined,
    tags: tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : undefined,
  };

  if (!input.name || !input.category || !input.description) {
    throw new Error("Name, category, and description are required.");
  }

  return input;
}

// Resolves the item's photo: a newly uploaded file is stored in Vercel Blob and
// its URL returned; otherwise the existing photo is kept (or cleared if the
// owner ticked "remove").
async function resolvePhotoUrl(formData: FormData): Promise<string | undefined> {
  if (formData.get("removePhoto") === "on") {
    return undefined;
  }
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const ext = photo.name.includes(".") ? photo.name.split(".").pop() : "jpg";
    const blob = await put(`items/${crypto.randomUUID()}.${ext}`, photo, {
      access: "public",
    });
    return blob.url;
  }
  return str(formData, "currentPhotoUrl") || undefined;
}

export async function createItemAction(formData: FormData) {
  await assertOwner();
  const input = parseItemInput(formData);
  input.photoUrl = await resolvePhotoUrl(formData);
  await createItem(input);
  revalidatePath("/");
  revalidatePath("/manage");
  redirect("/manage");
}

export async function updateItemAction(id: string, formData: FormData) {
  await assertOwner();
  const input = parseItemInput(formData);
  input.photoUrl = await resolvePhotoUrl(formData);
  await updateItem(id, input);
  revalidatePath("/");
  revalidatePath(`/items/${id}`);
  revalidatePath("/manage");
  redirect("/manage");
}

export async function deleteItemAction(formData: FormData) {
  await assertOwner();
  const id = str(formData, "id");
  if (id) {
    await deleteItem(id);
    revalidatePath("/");
    revalidatePath("/manage");
  }
}

export async function setStatusAction(formData: FormData) {
  await assertOwner();
  const id = str(formData, "id");
  if (!id) return;
  const status = (str(formData, "status") as ItemStatus) || "available";
  const holderName = str(formData, "currentHolderName");
  const holderDue = str(formData, "currentHolderDueBack");
  await setItemStatus(
    id,
    status,
    status !== "available" && holderName
      ? { name: holderName, dueBack: holderDue || undefined }
      : undefined
  );
  revalidatePath("/");
  revalidatePath(`/items/${id}`);
  revalidatePath("/manage");
}
