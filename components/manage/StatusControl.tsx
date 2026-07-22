"use client";

import { useState } from "react";
import { setStatusAction } from "@/app/manage/actions";
import type { Item, ItemStatus } from "@/lib/types";

const controlClass =
  "rounded-md border border-black/15 bg-transparent px-2 py-1 text-xs outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";

export default function StatusControl({ item }: { item: Item }) {
  const [status, setStatus] = useState<ItemStatus>(item.status);

  return (
    <form action={setStatusAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={item.id} />
      <select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as ItemStatus)}
        className={controlClass}
        aria-label="Status"
      >
        <option value="available">Available</option>
        <option value="lent_out">Lent out</option>
        <option value="reserved">Reserved</option>
      </select>
      {status !== "available" && (
        <>
          <input
            name="currentHolderName"
            defaultValue={item.currentHolder?.name}
            placeholder="Who has it"
            className={controlClass}
            aria-label="Who has it"
          />
          <input
            name="currentHolderDueBack"
            type="date"
            defaultValue={item.currentHolder?.dueBack}
            className={controlClass}
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
