import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

export const items = pgTable("item", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  condition: text("condition").notNull().$type<"new" | "good" | "fair" | "worn">(),
  lendType: text("lend_type").notNull().$type<"loan" | "rental">(),
  rentalRateAmount: integer("rental_rate_amount"),
  rentalRatePeriod: text("rental_rate_period").$type<"day" | "week">(),
  status: text("status")
    .notNull()
    .$type<"available" | "lent_out" | "reserved">(),
  currentHolderName: text("current_holder_name"),
  currentHolderDueBack: text("current_holder_due_back"),
  tags: text("tags").array(),
});

export const borrowRequests = pgTable("borrow_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  requesterId: text("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status")
    .notNull()
    .$type<"active" | "lent_out" | "returned" | "cancelled">(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});
