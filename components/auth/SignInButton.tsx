import { signIn } from "@/auth";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40"
      >
        Sign in with Google
      </button>
    </form>
  );
}
