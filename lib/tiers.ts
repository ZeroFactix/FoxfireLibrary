// Membership tiers. Add or rename tiers here; `freeRentals` controls whether a
// tier waives rental costs. Everything else in the app reads from this config.
export const TIERS = {
  standard: { label: "Standard", freeRentals: false },
  friend: { label: "Friend", freeRentals: true },
  family: { label: "Family", freeRentals: true },
} as const;

export type Tier = keyof typeof TIERS;

export const DEFAULT_TIER: Tier = "standard";

export const TIER_KEYS = Object.keys(TIERS) as Tier[];

export function isTier(value: string): value is Tier {
  return value in TIERS;
}

export function tierLabel(tier: string): string {
  return isTier(tier) ? TIERS[tier].label : tier;
}

export function tierGrantsFreeRentals(tier: string): boolean {
  return isTier(tier) && TIERS[tier].freeRentals;
}
