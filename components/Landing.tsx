import SignInButton from "@/components/auth/SignInButton";

const FEATURES = [
  {
    title: "Browse the library",
    body: "See what tools, gear, and games are available to borrow or rent.",
  },
  {
    title: "Reserve in a tap",
    body: "Claim an item, pick your dates, and you're set.",
  },
  {
    title: "Track your borrows",
    body: "Keep tabs on what you have out and when it's due back.",
  },
];

export default function Landing() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center sm:px-10">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          🦊 Foxfire Library
        </h1>
        <p className="max-w-xl text-lg text-black/70 dark:text-white/70">
          A personal library of tools, gear, and games — borrow or rent from
          friends.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <SignInButton large />
        <p className="text-sm text-black/50 dark:text-white/50">
          Sign in to browse the catalog and reserve items.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-black/10 p-4 text-left dark:border-white/15"
          >
            <h2 className="font-medium">{feature.title}</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
