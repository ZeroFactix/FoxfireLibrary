import itemsData from "../data/items.json";
import { db } from "../lib/db";
import { items } from "../lib/db/schema";
import type { Item } from "../lib/types";

async function seed() {
  const rows = (itemsData as Item[]).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    photoUrl: item.photoUrl,
    condition: item.condition,
    lendType: item.lendType,
    rentalRateAmount: item.rentalRate?.amount,
    rentalRatePeriod: item.rentalRate?.period,
    status: item.status,
    currentHolderName: item.currentHolder?.name,
    currentHolderDueBack: item.currentHolder?.dueBack,
    tags: item.tags,
  }));

  for (const row of rows) {
    await db
      .insert(items)
      .values(row)
      .onConflictDoUpdate({ target: items.id, set: row });
  }

  console.log(`Seeded ${rows.length} items.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
