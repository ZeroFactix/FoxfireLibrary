import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { getAllItems, getItemById } from "@/lib/items";

export async function generateStaticParams() {
  const items = await getAllItems();
  return items.map((item) => ({ id: item.id }));
}

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

      <p className="text-black/80 dark:text-white/80">{item.description}</p>

      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
        <div>
          <dt className="text-black/50 dark:text-white/50">Condition</dt>
          <dd className="capitalize">{item.condition}</dd>
        </div>
        <div>
          <dt className="text-black/50 dark:text-white/50">Cost</dt>
          <dd>
            {item.lendType === "rental" && item.rentalRate
              ? `$${item.rentalRate.amount}/${item.rentalRate.period}`
              : "Free to borrow"}
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

      <a
        href={`mailto:zerofactix@gmail.com?subject=${encodeURIComponent(
          `Borrow request: ${item.name}`
        )}`}
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Request to borrow
      </a>
    </main>
  );
}
