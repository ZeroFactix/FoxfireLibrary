"use client";

import { deleteItemAction } from "@/app/manage/actions";

export default function DeleteItemButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteItemAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-500 dark:border-red-500/40 dark:text-red-400 dark:hover:border-red-500"
      >
        Delete
      </button>
    </form>
  );
}
