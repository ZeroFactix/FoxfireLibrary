import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 transition hover:border-black/25 hover:shadow-sm dark:border-white/15 dark:hover:border-white/30"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-black/40 dark:text-white/40">
            No photo
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium">{item.name}</h2>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-black/60 dark:text-white/60">{item.category}</p>
      <p className="line-clamp-2 text-sm text-black/70 dark:text-white/70">
        {item.description}
      </p>
      <p className="text-sm font-medium">
        {item.lendType === "rental" && item.rentalRate
          ? `$${item.rentalRate.amount}/${item.rentalRate.period}`
          : "Free to borrow"}
      </p>
    </Link>
  );
}
