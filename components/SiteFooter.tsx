import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-black/10 dark:border-white/15">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-black/60 dark:text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-black/80 dark:text-white/80">
            🦊 Foxfire Library
          </span>
          <span>A personal library of tools, gear, and games to borrow or rent.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition hover:text-black dark:hover:text-white">
            Catalog
          </Link>
          <span>&copy; {year} Foxfire Library</span>
        </div>
      </div>
    </footer>
  );
}
