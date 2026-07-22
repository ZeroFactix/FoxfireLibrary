# Foxfire Library

A personal catalog of tools, gear, and games available to lend or rent out to
friends. Built with Next.js, Tailwind CSS, a Neon Postgres database, and
Google sign-in via Auth.js.

## Getting started

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — a Neon Postgres connection string.
- `AUTH_SECRET` — generate with `npx auth secret`.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from a Google Cloud OAuth client
  (see below).

Then:

```bash
npm install
npm run db:push   # create tables from lib/db/schema.ts
npm run db:seed   # load data/items.json into the item table
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Google OAuth setup

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an OAuth 2.0 Client ID (Web application).
2. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://<your-production-domain>/api/auth/callback/google`
3. Copy the Client ID/Secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

## Project structure

- `lib/db/schema.ts` — Drizzle schema: Auth.js tables (`user`, `account`,
  `session`, `verificationToken`) plus the `item` catalog table.
- `lib/db/index.ts` — Neon/Drizzle client.
- `lib/items.ts` — data-access module (`getAllItems`, `getItemById`,
  `getAllCategories`), now backed by the database. Pages only ever import
  from here, never the DB client directly.
- `auth.ts` — Auth.js config (Google provider, Drizzle adapter).
- `app/api/auth/[...nextauth]/route.ts` — Auth.js route handlers.
- `components/SiteHeader.tsx` — shows sign-in/sign-out state.
- `scripts/seed.ts` — one-time loader from `data/items.json` into Postgres.
- `app/page.tsx` — catalog home page.
- `app/items/[id]/page.tsx` — item detail page.
- `components/Catalog.tsx` — client-side search/category/status filtering.

## Roadmap

1. ~~Static site~~ — done.
2. ~~Database~~ — done (Neon Postgres via Drizzle).
3. ~~Auth~~ — done (Google sign-in via Auth.js). Sign-in doesn't gate
   anything yet — that's next: restricting item management to the owner,
   and letting borrowers submit/track requests.
4. **Payments/reminders** — Stripe for rentals, email/SMS due-date reminders.
