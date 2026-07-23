"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isOwner } from "@/lib/owner";
import { isTier } from "@/lib/tiers";
import { setUserTier } from "@/lib/users";

export async function setUserTierAction(userId: string, formData: FormData) {
  const session = await auth();
  if (!isOwner(session)) {
    throw new Error("Not authorized.");
  }

  const tier = ((formData.get("tier") as string) ?? "").trim();
  if (!isTier(tier)) {
    throw new Error("Invalid tier.");
  }

  await setUserTier(userId, tier);
  revalidatePath("/manage/users");
  revalidatePath(`/manage/users/${userId}`);
  // Free-rental display depends on tier, so refresh item views too.
  revalidatePath("/");
}
