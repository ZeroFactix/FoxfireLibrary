export type ItemCondition = "new" | "good" | "fair" | "worn";

export type ItemStatus = "available" | "lent_out" | "reserved";

export type LendType = "loan" | "rental";

export type RentalRate = {
  amount: number;
  period: "day" | "week";
};

export type CurrentHolder = {
  name: string;
  dueBack?: string;
};

export type Item = {
  id: string;
  name: string;
  category: string;
  description: string;
  photoUrl?: string;
  condition: ItemCondition;
  lendType: LendType;
  rentalRate?: RentalRate;
  status: ItemStatus;
  currentHolder?: CurrentHolder;
  tags?: string[];
};
