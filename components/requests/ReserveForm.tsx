"use client";

import { reserveItemAction } from "@/app/requests/actions";

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";
const labelClass = "flex flex-1 flex-col gap-1 text-sm font-medium";

export default function ReserveForm({ itemId }: { itemId: string }) {
  return (
    <form
      action={reserveItemAction}
      className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15"
    >
      <input type="hidden" name="itemId" value={itemId} />
      <p className="text-sm font-medium">Reserve this item</p>
      <div className="flex gap-3">
        <label className={labelClass}>
          From
          <input type="date" name="startDate" className={inputClass} />
        </label>
        <label className={labelClass}>
          To
          <input type="date" name="endDate" className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Message (optional)
        <textarea
          name="message"
          rows={2}
          placeholder="Anything the owner should know?"
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Reserve it
      </button>
    </form>
  );
}
