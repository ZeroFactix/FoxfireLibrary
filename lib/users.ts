import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { borrowRequests, users } from "@/lib/db/schema";
import type { Tier } from "@/lib/tiers";

export type UserSummary = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  tier: string;
  totalReservations: number;
  openReservations: number;
};

export type UserProfile = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  tier: string;
};

export async function getAllUsers(): Promise<UserSummary[]> {
  const [userRows, requestRows] = await Promise.all([
    db.select().from(users),
    db
      .select({
        requesterId: borrowRequests.requesterId,
        status: borrowRequests.status,
      })
      .from(borrowRequests),
  ]);

  const counts = new Map<string, { total: number; open: number }>();
  for (const req of requestRows) {
    const entry = counts.get(req.requesterId) ?? { total: 0, open: 0 };
    entry.total += 1;
    if (req.status === "active" || req.status === "lent_out") {
      entry.open += 1;
    }
    counts.set(req.requesterId, entry);
  }

  return userRows
    .map((user) => ({
      id: user.id,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      image: user.image ?? undefined,
      tier: user.tier,
      totalReservations: counts.get(user.id)?.total ?? 0,
      openReservations: counts.get(user.id)?.open ?? 0,
    }))
    .sort((a, b) =>
      (a.name ?? a.email ?? "").localeCompare(b.name ?? b.email ?? "")
    );
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const rows = await db.select().from(users).where(eq(users.id, id));
  const user = rows[0];
  if (!user) return null;
  return {
    id: user.id,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    image: user.image ?? undefined,
    tier: user.tier,
  };
}

export async function getUserTier(id: string): Promise<string> {
  const rows = await db
    .select({ tier: users.tier })
    .from(users)
    .where(eq(users.id, id));
  return rows[0]?.tier ?? "standard";
}

export async function setUserTier(id: string, tier: Tier): Promise<void> {
  await db.update(users).set({ tier }).where(eq(users.id, id));
}
