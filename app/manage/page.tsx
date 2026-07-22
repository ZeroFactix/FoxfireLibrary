import Link from "next/link";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import StatusBadge from "@/components/StatusBadge";
import DeleteItemButton from "@/components/manage/DeleteItemButton";
import StatusControl from "@/components/manage/StatusControl";
import { getAllItems } from "@/lib/items";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function ManagePage() {
  const session = await auth();

  if (!isOwner(session)) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold">Manage items</h1>
        <p className="text-black/60 dark:text-white/60">
          {session?.user
            ? "You don't have access to item management."
            : "Please sign in with an authorized account to manage items."}
        </p>
        {!session?.user && <SignInButton />}
        <Link
          href="/"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          &larr; Back to catalog
        </Link>
      </main>
    );
  }

  const items = await getAllItems();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage items</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {items.length} item{items.length === 1 ? "" : "s"} in the library.
          </p>
        </div>
        <Link
          href="/manage/new"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Add item
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{item.name}</h2>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-black/60 dark:text-white/60">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/manage/${item.id}/edit`}
                  className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40"
                >
                  Edit
                </Link>
                <DeleteItemButton id={item.id} name={item.name} />
              </div>
            </div>
            <StatusControl item={item} />
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        &larr; Back to catalog
      </Link>
    </main>
  );
}
