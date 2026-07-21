import type { ItemStatus } from "@/lib/types";

const STATUS_STYLES: Record<ItemStatus, string> = {
  available: "bg-green-100 text-green-800",
  lent_out: "bg-amber-100 text-amber-800",
  reserved: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  available: "Available",
  lent_out: "Lent out",
  reserved: "Reserved",
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
