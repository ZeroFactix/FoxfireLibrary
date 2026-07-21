# The Lending Library

A personal catalog of tools, gear, and games available to lend or rent out to
friends. Built with Next.js and Tailwind CSS, exported as a fully static site.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `data/items.json` — the catalog data (name, category, condition, lend type,
  status, current holder).
- `lib/items.ts` — data-access module (`getAllItems`, `getItemById`,
  `getAllCategories`). Pages only ever import from here, never the JSON
  directly, so a future database swap only touches this file.
- `lib/types.ts` — the `Item` shape.
- `app/page.tsx` — catalog home page.
- `app/items/[id]/page.tsx` — item detail page.
- `components/Catalog.tsx` — client-side search/category/status filtering.

## Building

```bash
npm run build
```

`next.config.ts` sets `output: "export"`, so `npm run build` produces a static
`out/` directory that can be deployed to Vercel, GitHub Pages, or any static
host.

## Roadmap

1. **Static site (current)** — JSON-backed catalog, no backend.
2. **Database** — move `data/items.json` into Postgres (e.g. Vercel
   Postgres/Neon) via Prisma; swap the internals of `lib/items.ts` only.
3. **Auth** — NextAuth.js login for the owner to manage items, and for
   borrowers to submit and track borrow requests.
4. **Payments/reminders** — Stripe for rentals, email/SMS due-date reminders.
