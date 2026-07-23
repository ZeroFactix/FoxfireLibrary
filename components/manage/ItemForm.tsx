"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Select from "@/components/ui/Select";
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

      <div className={labelClass}>
        Condition
        <Select
          name="condition"
          ariaLabel="Condition"
          className="w-full"
          defaultValue={item?.condition ?? "good"}
          options={[
            { value: "new", label: "New" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "worn", label: "Worn" },
          ]}
        />
      </div>

      <div className={labelClass}>
        Lend type
        <Select
          name="lendType"
          ariaLabel="Lend type"
          className="w-full"
          defaultValue={item?.lendType ?? "loan"}
          onChange={(value) => setLendType(value as LendType)}
          options={[
            { value: "loan", label: "Free loan" },
            { value: "rental", label: "Rental" },
          ]}
        />
      </div>

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
          <div className={`${labelClass} flex-1`}>
            Per
            <Select
              name="rentalRatePeriod"
              ariaLabel="Rental period"
              className="w-full"
              defaultValue={item?.rentalRate?.period ?? "day"}
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
              ]}
            />
          </div>
        </div>
      )}

      <div className={labelClass}>
        Status
        <Select
          name="status"
          ariaLabel="Status"
          className="w-full"
          defaultValue={item?.status ?? "available"}
          onChange={(value) => setStatus(value as ItemStatus)}
          options={[
            { value: "available", label: "Available" },
            { value: "lent_out", label: "Lent out" },
            { value: "reserved", label: "Reserved" },
          ]}
        />
      </div>

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

      <div className={labelClass}>
        Photo
        {item?.photoUrl && (
          <div className="flex items-center gap-3">
            <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
              <Image
                src={item.photoUrl}
                alt={item.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-normal">
              <input type="checkbox" name="removePhoto" />
              Remove current photo
            </label>
          </div>
        )}
        <input type="hidden" name="currentPhotoUrl" value={item?.photoUrl ?? ""} />
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="text-sm font-normal file:mr-3 file:rounded-full file:border file:border-black/15 file:bg-transparent file:px-3 file:py-1 file:text-sm dark:file:border-white/20"
        />
        <span className="text-xs font-normal text-black/50 dark:text-white/50">
          {item?.photoUrl ? "Choose a file to replace the current photo." : "Optional. JPG, PNG, etc."}
        </span>
      </div>

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
