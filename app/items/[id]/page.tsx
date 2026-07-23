import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import StatusBadge from "@/components/StatusBadge";
import RequestActionButton from "@/components/requests/RequestActionButton";
import ReserveForm from "@/components/requests/ReserveForm";
import { cancelOwnRequestAction } from "@/app/requests/actions";
import { getItemById } from "@/lib/items";
import { getActiveRequestForItem } from "@/lib/requests";
import { tierGrantsFreeRentals } from "@/lib/tiers";
import { getUserTier } from "@/lib/users";

// Rendered per request so item data (status, current holder) is always live.
export const dynamic = "force-dynamic";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;
  const activeRequest =
    item.status === "available" ? null : await getActiveRequestForItem(item.id);
  const isMine = !!activeRequest && activeRequest.requesterId === userId;

  const viewerTier = userId ? await getUserTier(userId) : "standard";
  const isRental = item.lendType === "rental" && !!item.rentalRate;
  const freeForViewer = isRental && tierGrantsFreeRentals(viewerTier);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <Link
        href="/"
        className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        &larr; Back to catalog
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-black/60 dark:text-white/60">{item.category}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.photoUrl && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <p className="text-black/80 dark:text-white/80">{item.description}</p>

      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
        <div>
          <dt className="text-black/50 dark:text-white/50">Condition</dt>
          <dd className="capitalize">{item.condition}</dd>
        </div>
        <div>
          <dt className="text-black/50 dark:text-white/50">Cost</dt>
          <dd>
            {!isRental ? (
              "Free to borrow"
            ) : freeForViewer ? (
              <span>
                <span className="line-through text-black/40 dark:text-white/40">
                  ${item.rentalRate!.amount}/{item.rentalRate!.period}
                </span>{" "}
                <span className="font-medium">Free for you</span>
              </span>
            ) : (
              `$${item.rentalRate!.amount}/${item.rentalRate!.period}`
            )}
          </dd>
        </div>
        {item.currentHolder && (
          <div className="col-span-2">
            <dt className="text-black/50 dark:text-white/50">
              {item.status === "reserved" ? "Reserved by" : "Currently with"}
            </dt>
            <dd>
              {item.currentHolder.name}
              {item.currentHolder.dueBack &&
                ` — due back ${item.currentHolder.dueBack}`}
            </dd>
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="col-span-2">
            <dt className="text-black/50 dark:text-white/50">Tags</dt>
            <dd>{item.tags.join(", ")}</dd>
          </div>
        )}
      </dl>

      {item.status === "available" ? (
        userId ? (
          <ReserveForm itemId={item.id} />
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15">
            <p className="text-sm text-black/70 dark:text-white/70">
              Sign in to reserve this item.
            </p>
            <SignInButton />
          </div>
        )
      ) : isMine ? (
        <div className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15">
          <p className="text-sm text-black/70 dark:text-white/70">
            You have this {item.status === "lent_out" ? "borrowed" : "reserved"}
            {activeRequest?.endDate ? ` until ${activeRequest.endDate}` : ""}.
          </p>
          <RequestActionButton
            action={cancelOwnRequestAction}
            requestId={activeRequest!.id}
            label="Cancel my reservation"
            variant="danger"
            confirmMessage="Cancel your reservation for this item?"
          />
        </div>
      ) : (
        <p className="text-sm text-black/60 dark:text-white/60">
          This item is currently{" "}
          {item.status === "lent_out" ? "lent out" : "reserved"}. Check back later.
        </p>
      )}
    </main>
  );
}
