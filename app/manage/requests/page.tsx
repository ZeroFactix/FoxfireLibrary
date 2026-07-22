import Link from "next/link";
import { auth } from "@/auth";
import RequestActionButton from "@/components/requests/RequestActionButton";
import {
  ownerDeclineAction,
  ownerMarkLentOutAction,
  ownerMarkReturnedAction,
} from "@/app/requests/actions";
import { getAllRequestsForOwner } from "@/lib/requests";
import { isOwner } from "@/lib/owner";
import type { BorrowRequestDetail, BorrowRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<BorrowRequestStatus, string> = {
  active: "Reserved",
  lent_out: "Picked up",
  returned: "Returned",
  cancelled: "Cancelled",
};

function RequestCard({ request }: { request: BorrowRequestDetail }) {
  const open = request.status === "active" || request.status === "lent_out";
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/items/${request.itemId}`} className="font-medium hover:underline">
            {request.itemName}
          </Link>
          <p className="text-sm text-black/60 dark:text-white/60">
            {request.requesterName ?? "Someone"}
            {request.requesterEmail ? ` · ${request.requesterEmail}` : ""}
          </p>
        </div>
        <span className="text-xs font-medium text-black/60 dark:text-white/60">
          {STATUS_LABEL[request.status]}
        </span>
      </div>

      {(request.startDate || request.endDate) && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Wants it {request.startDate ?? "—"} to {request.endDate ?? "—"}
        </p>
      )}
      {request.message && (
        <p className="text-sm text-black/70 dark:text-white/70">“{request.message}”</p>
      )}

      {open && (
        <div className="flex flex-wrap gap-2">
          {request.status === "active" && (
            <RequestActionButton
              action={ownerMarkLentOutAction}
              requestId={request.id}
              label="Mark lent out"
              variant="primary"
            />
          )}
          <RequestActionButton
            action={ownerMarkReturnedAction}
            requestId={request.id}
            label="Mark returned"
            variant="neutral"
          />
          <RequestActionButton
            action={ownerDeclineAction}
            requestId={request.id}
            label="Decline"
            variant="danger"
            confirmMessage="Decline this reservation and free the item?"
          />
        </div>
      )}
    </div>
  );
}

export default async function OwnerRequestsPage() {
  const session = await auth();

  if (!isOwner(session)) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <p className="text-black/60 dark:text-white/60">
          You don&apos;t have access to this page.
        </p>
      </main>
    );
  }

  const requests = await getAllRequestsForOwner();
  const open = requests.filter(
    (r) => r.status === "active" || r.status === "lent_out"
  );
  const past = requests.filter(
    (r) => r.status === "returned" || r.status === "cancelled"
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          &larr; Manage items
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">
          Open ({open.length})
        </h2>
        {open.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            No open reservations right now.
          </p>
        ) : (
          open.map((request) => <RequestCard key={request.id} request={request} />)
        )}
      </section>

      {past.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">
            History
          </h2>
          {past.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </section>
      )}
    </main>
  );
}
