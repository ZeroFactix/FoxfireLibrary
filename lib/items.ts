import itemsData from "@/data/items.json";
import type { Item } from "@/lib/types";

const items = itemsData as Item[];

export function getAllItems(): Item[] {
  return items;
}

export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(items.map((item) => item.category))).sort();
}
