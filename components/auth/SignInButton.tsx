import { signIn } from "@/auth";

export default function SignInButton({ large = false }: { large?: boolean }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className={
          large
            ? "inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            : "rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40"
        }
      >
        Sign in with Google
      </button>
    </form>
  );
}
