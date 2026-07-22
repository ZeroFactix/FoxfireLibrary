import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

// The Auth.js Drizzle adapter inspects a real database client at import time to
// detect the dialect, so `db` must be constructed eagerly. During `next build`
// DATABASE_URL may be absent (env vars are often scoped to runtime only); fall
// back to a dummy connection string so the build never requires it. neon() does
// not open a connection until a query runs, and every page/route is dynamic, so
// the dummy is never actually contacted — the real DATABASE_URL is used at
// request time.
const connectionString =
  process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build";

export const db = drizzle(neon(connectionString), { schema });
