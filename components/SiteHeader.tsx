import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";
import { isOwner } from "@/lib/owner";
import { countOpenRequests } from "@/lib/requests";

const navLinkClass =
  "rounded-full border border-black/15 px-4 py-1.5 font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40";

export default async function SiteHeader() {
  const session = await auth();
  const owner = isOwner(session);
  const openRequests = owner ? await countOpenRequests() : 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-3 px-6 pt-6 sm:px-10">
      {session?.user ? (
        <div className="flex items-center gap-3 text-sm">
          {owner ? (
            <>
              <Link href="/manage" className={navLinkClass}>
                Manage
              </Link>
              <Link href="/manage/requests" className={navLinkClass}>
                Requests{openRequests > 0 ? ` (${openRequests})` : ""}
              </Link>
            </>
          ) : (
            <Link href="/requests" className={navLinkClass}>
              My reservations
            </Link>
          )}
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Signed in user"}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <span className="text-black/70 dark:text-white/70">{session.user.name}</span>
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
