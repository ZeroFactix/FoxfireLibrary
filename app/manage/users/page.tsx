import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { isOwner } from "@/lib/owner";
import { tierLabel } from "@/lib/tiers";
import { getAllUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();

  if (!isOwner(session)) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-black/60 dark:text-white/60">
          You don&apos;t have access to this page.
        </p>
      </main>
    );
  }

  const users = await getAllUsers();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {users.length} {users.length === 1 ? "person has" : "people have"} signed in.
          </p>
        </div>
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          &larr; Manage items
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No users yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/manage/users/${user.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3 transition hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-black/10 dark:bg-white/15" />
                )}
                <div>
                  <p className="font-medium">{user.name ?? "Unnamed"}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{tierLabel(user.tier)}</p>
                <p className="text-black/60 dark:text-white/60">
                  {user.totalReservations} reservation
                  {user.totalReservations === 1 ? "" : "s"}
                  {user.openReservations > 0 ? ` · ${user.openReservations} open` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
