import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateItemAction } from "@/app/manage/actions";
import ItemForm from "@/components/manage/ItemForm";
import { getItemById } from "@/lib/items";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!isOwner(session)) {
    redirect("/manage");
  }

  const { id } = await params;
  const item = await getItemById(id);
  if (!item) {
    notFound();
  }

  const action = updateItemAction.bind(null, id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-1">
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          &larr; Back to manage
        </Link>
        <h1 className="text-2xl font-semibold">Edit {item.name}</h1>
      </div>
      <ItemForm action={action} item={item} submitLabel="Save changes" />
    </main>
  );
}
