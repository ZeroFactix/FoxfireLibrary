import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { setUserTierAction } from "@/app/manage/users/actions";
import { isOwner } from "@/lib/owner";
import Select from "@/components/ui/Select";
import { getRequestsForUser } from "@/lib/requests";
import { TIER_KEYS, tierLabel } from "@/lib/tiers";
import { getUserProfile } from "@/lib/users";
import type { BorrowRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<BorrowRequestStatus, string> = {
  active: "Reserved",
  lent_out: "Picked up",
  returned: "Returned",
  cancelled: "Cancelled",
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!isOwner(session)) {
    redirect("/manage/users");
  }

  const { id } = await params;
  const [user, history] = await Promise.all([
    getUserProfile(id),
    getRequestsForUser(id),
  ]);

  if (!user) {
    notFound();
  }

  const saveTier = setUserTierAction.bind(null, user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <Link
        href="/manage/users"
        className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        &larr; All users
      </Link>

      <div className="flex items-center gap-4">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-black/10 dark:bg-white/15" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{user.name ?? "Unnamed"}</h1>
          <p className="text-black/60 dark:text-white/60">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm">
          <span className="text-black/50 dark:text-white/50">Current tier: </span>
          <span className="font-medium">{tierLabel(user.tier)}</span>
        </p>
        <form action={saveTier} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 text-sm font-medium">
            Change tier
            <Select
              // Keyed on the saved value so the control re-syncs to the
              // persisted tier after each save.
              key={user.tier}
              name="tier"
              ariaLabel="Tier"
              defaultValue={user.tier}
              options={TIER_KEYS.map((tierKey) => ({
                value: tierKey,
                label: tierLabel(tierKey),
              }))}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Save tier
          </button>
        </form>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">
          Reservation history ({history.length})
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            No reservations yet.
          </p>
        ) : (
          history.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-1 rounded-lg border border-black/10 p-3 text-sm dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <Link href={`/items/${request.itemId}`} className="font-medium hover:underline">
                  {request.itemName}
                </Link>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {STATUS_LABEL[request.status]}
                </span>
              </div>
              {(request.startDate || request.endDate) && (
                <p className="text-black/60 dark:text-white/60">
                  {request.startDate ?? "—"} to {request.endDate ?? "—"}
                </p>
              )}
              {request.message && (
                <p className="text-black/70 dark:text-white/70">“{request.message}”</p>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
