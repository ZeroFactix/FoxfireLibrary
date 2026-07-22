import Catalog from "@/components/Catalog";
import { getAllCategories, getAllItems } from "@/lib/items";

// Rendered per request so the catalog reflects the current database state.
export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getAllItems();
  const categories = await getAllCategories();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">The Lending Library</h1>
        <p className="text-black/60 dark:text-white/60">
          Tools, gear, and games available to borrow or rent. Reach out if
          something catches your eye.
        </p>
      </header>
      <Catalog items={items} categories={categories} />
    </main>
  );
}
