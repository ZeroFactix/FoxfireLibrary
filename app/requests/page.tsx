import Link from "next/link";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import RequestActionButton from "@/components/requests/RequestActionButton";
import { cancelOwnRequestAction } from "@/app/requests/actions";
import { getRequestsForUser } from "@/lib/requests";
import type { BorrowRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<BorrowRequestStatus, string> = {
  active: "Reserved",
  lent_out: "Picked up",
  returned: "Returned",
  cancelled: "Cancelled",
};

export default async function MyRequestsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold">My reservations</h1>
        <p className="text-black/60 dark:text-white/60">
          Sign in to see items you&apos;ve reserved.
        </p>
        <SignInButton />
      </main>
    );
  }

  const requests = await getRequestsForUser(session.user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <h1 className="text-2xl font-semibold">My reservations</h1>

      {requests.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">
          You haven&apos;t reserved anything yet.{" "}
          <Link href="/" className="underline">
            Browse the catalog
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <Link href={`/items/${request.itemId}`} className="font-medium hover:underline">
                  {request.itemName}
                </Link>
                <span className="text-xs font-medium text-black/60 dark:text-white/60">
                  {STATUS_LABEL[request.status]}
                </span>
              </div>
              {(request.startDate || request.endDate) && (
                <p className="text-sm text-black/60 dark:text-white/60">
                  {request.startDate ?? "—"} to {request.endDate ?? "—"}
                </p>
              )}
              {request.message && (
                <p className="text-sm text-black/70 dark:text-white/70">
                  “{request.message}”
                </p>
              )}
              {request.status === "active" && (
                <RequestActionButton
                  action={cancelOwnRequestAction}
                  requestId={request.id}
                  label="Cancel reservation"
                  variant="danger"
                  confirmMessage="Cancel this reservation?"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href="/"
        className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        &larr; Back to catalog
      </Link>
    </main>
  );
}
