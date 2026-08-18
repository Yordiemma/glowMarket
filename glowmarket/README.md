# GlowMarket MVP

A marketplace for verified Swedish beauty businesses to create stores and sell beauty products.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Interactive beauty business onboarding and seller dashboard
- Marketplace, store profiles, product publishing, and responsive UI

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## MVP boundaries

Supabase authentication and the initial database migration are included. Apply `supabase/migrations/202608180001_initial_mvp.sql` to the connected project before testing registration. Bolagsverket, BankID, signatory verification, payouts, checkout, and image uploads still require provider integrations. The local organisation-number check is format validation only and is never legal verification.

Visit `/register` to create a beauty store, `/sign-in` for seller login, `/dashboard` for seller tools, and `/marketplace` for customers.

The complete Supabase data model, authorization matrix, storage layout, workflows, and implementation order are documented in [`docs/SUPABASE_DESIGN.md`](docs/SUPABASE_DESIGN.md).
