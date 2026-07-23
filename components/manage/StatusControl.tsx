"use client";

import { useState } from "react";
import { setStatusAction } from "@/app/manage/actions";
import Select from "@/components/ui/Select";
import type { Item, ItemStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "lent_out", label: "Lent out" },
  { value: "reserved", label: "Reserved" },
];

const inputClass =
  "rounded-md border border-black/15 bg-transparent px-2 py-1 text-xs outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";

export default function StatusControl({ item }: { item: Item }) {
  const [status, setStatus] = useState<ItemStatus>(item.status);

  return (
    <form action={setStatusAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={item.id} />
      <Select
        name="status"
        ariaLabel="Status"
        compact
        defaultValue={item.status}
        onChange={(value) => setStatus(value as ItemStatus)}
        options={STATUS_OPTIONS}
      />
      {status !== "available" && (
        <>
          <input
            name="currentHolderName"
            defaultValue={item.currentHolder?.name}
            placeholder="Who has it"
            className={inputClass}
            aria-label="Who has it"
          />
          <input
            name="currentHolderDueBack"
            type="date"
            defaultValue={item.currentHolder?.dueBack}
            className={inputClass}
            aria-label="Due back"
          />
        </>
      )}
      <button
        type="submit"
        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40"
      >
        Save
      </button>
    </form>
  );
}
