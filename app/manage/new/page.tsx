import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createItemAction } from "@/app/manage/actions";
import ItemForm from "@/components/manage/ItemForm";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  const session = await auth();
  if (!isOwner(session)) {
    redirect("/manage");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-1">
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          &larr; Back to manage
        </Link>
        <h1 className="text-2xl font-semibold">Add item</h1>
      </div>
      <ItemForm action={createItemAction} submitLabel="Add item" />
    </main>
  );
}
