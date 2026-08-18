# GlowMarket MVP

A marketplace for verified Swedish hair salons to create storefronts and sell their professional product selection.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Interactive salon onboarding and admin dashboard prototype
- Marketplace, salon profile, demo product publishing, and responsive UI

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## MVP boundaries

Authentication, database persistence, payouts, checkout, image uploads, and official business-registry verification are demo UI only. Production requires backend integrations and must not treat the local organisation-number format check as legal verification.

Visit `/register` for onboarding, `/sign-in` for salon login, `/dashboard` for admin tools, and `/marketplace` for the customer experience.

The complete Supabase data model, authorization matrix, storage layout, workflows, and implementation order are documented in [`docs/SUPABASE_DESIGN.md`](docs/SUPABASE_DESIGN.md).
