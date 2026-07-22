"use client";

import Link from "next/link";
import { useState } from "react";
import type { Item, ItemStatus, LendType } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium";

export default function ItemForm({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  item?: Item;
  submitLabel: string;
}) {
  const [lendType, setLendType] = useState<LendType>(item?.lendType ?? "loan");
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? "available");

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Name
        <input name="name" defaultValue={item?.name} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Category
        <input
          name="category"
          defaultValue={item?.category}
          required
          placeholder="Tools, Electronics, Outdoor, Games…"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          defaultValue={item?.description}
          required
          rows={3}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Condition
        <select name="condition" defaultValue={item?.condition ?? "good"} className={inputClass}>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="worn">Worn</option>
        </select>
      </label>

      <label className={labelClass}>
        Lend type
        <select
          name="lendType"
          value={lendType}
          onChange={(e) => setLendType(e.target.value as LendType)}
          className={inputClass}
        >
          <option value="loan">Free loan</option>
          <option value="rental">Rental</option>
        </select>
      </label>

      {lendType === "rental" && (
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Rate (amount)
            <input
              name="rentalRateAmount"
              type="number"
              min="0"
              defaultValue={item?.rentalRate?.amount}
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} flex-1`}>
            Per
            <select
              name="rentalRatePeriod"
              defaultValue={item?.rentalRate?.period ?? "day"}
              className={inputClass}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
          </label>
        </div>
      )}

      <label className={labelClass}>
        Status
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ItemStatus)}
          className={inputClass}
        >
          <option value="available">Available</option>
          <option value="lent_out">Lent out</option>
          <option value="reserved">Reserved</option>
        </select>
      </label>

      {status !== "available" && (
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Who has it
            <input
              name="currentHolderName"
              defaultValue={item?.currentHolder?.name}
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} flex-1`}>
            Due back
            <input
              name="currentHolderDueBack"
              type="date"
              defaultValue={item?.currentHolder?.dueBack}
              className={inputClass}
            />
          </label>
        </div>
      )}

      <label className={labelClass}>
        Tags (comma-separated)
        <input
          name="tags"
          defaultValue={item?.tags?.join(", ")}
          placeholder="camping, cooking"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Photo URL (optional)
        <input name="photoUrl" defaultValue={item?.photoUrl} className={inputClass} />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {submitLabel}
        </button>
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
