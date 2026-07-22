import Image from "next/image";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function SiteHeader() {
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-3 px-6 pt-6 sm:px-10">
      {session?.user ? (
        <div className="flex items-center gap-3 text-sm">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Signed in user"}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <span className="text-black/70 dark:text-white/70">
            {session.user.name}
          </span>
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
