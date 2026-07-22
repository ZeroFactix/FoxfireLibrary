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

// active: reserved, not yet picked up. lent_out: picked up. returned: complete.
// cancelled: cancelled by the borrower or declined by the owner.
export type BorrowRequestStatus = "active" | "lent_out" | "returned" | "cancelled";

export type BorrowRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  message?: string;
  startDate?: string;
  endDate?: string;
  status: BorrowRequestStatus;
  createdAt: string;
};

// A request enriched with the item name and requester details, for list views.
export type BorrowRequestDetail = BorrowRequest & {
  itemName: string;
  requesterName?: string;
  requesterEmail?: string;
};
