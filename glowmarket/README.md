# GlowMarket MVP

A marketplace for verified Swedish beauty businesses to create stores and sell beauty products.

## Business model

- GlowMarket earns 10% of the product subtotal when a sale is made.
- Customer-paid shipping is excluded from the commission calculation.
- There is no monthly store fee, and AI is included during MVP testing.
- Sellers upload a product photo, price, and stock; AI generates the listing for seller review before publication.

## Completed MVP journey

- Verified seller registration through Bolagsverket Accept2 with manual-review fallback when the provider is unavailable.
- Authenticated seller dashboard with Store, Products, and seller-scoped Orders.
- Supabase Storage product images, AI-assisted editable drafts, and verified-business publishing.
- Public real-product marketplace with search, category filters, product details, stock, and seller attribution.
- Single-seller cart, guest checkout, transactional order creation, stock reduction, and seller order visibility.
- Product-only 10% platform fee with customer-paid shipping excluded.
- Minimal role-protected admin business approval, rejection, and suspension.

The checkout records an unpaid order for MVP workflow testing; payment-provider collection is not represented as completed payment.

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

## Bolagsverket test verification

Registration verifies the organisation number through a server-only Next.js route. For local development, copy the four `BOLAGSVERKET_*` entries from `.env.example` to `.env.local` and add the test credentials issued by Bolagsverket.

For Vercel, add the same four variables under **Project → Settings → Environment Variables** for Preview and Production, then redeploy. Do not prefix them with `NEXT_PUBLIC_`; the browser only calls `/api/business/verify` and never receives the OAuth credentials or access token.

Both configured URLs point to Bolagsverket Accept2 and therefore return test data even when the app itself is deployed publicly. Use an organisation number from Bolagsverket's published Accept2 test-data document.

## Supabase setup

Create or select the Supabase project referenced by `NEXT_PUBLIC_SUPABASE_URL`, then apply every SQL file in `supabase/migrations` in filename order. Registration deliberately checks for the `public.profiles` table before creating an Auth user, preventing incomplete seller accounts when the database has not been initialized.

In **Supabase → Authentication → URL Configuration**, set the production Site URL and add both callback URLs to Redirect URLs:

```text
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

Email confirmation returns through `/auth/callback` and then opens the seller dashboard. Keep email/password signup enabled for the MVP.

## MVP boundaries

Supabase authentication and the initial database migration are included. Apply `supabase/migrations/202608180001_initial_mvp.sql` to the connected project before testing registration. Bolagsverket test-data lookup is connected; it confirms only that a record exists in Accept2 and is not proof that the registrant may represent the business. BankID, signatory verification, payouts, checkout, and image uploads still require provider integrations.

Visit `/register` to create a beauty store, `/sign-in` for seller login, `/dashboard` for seller tools, and `/marketplace` for customers.

The complete Supabase data model, authorization matrix, storage layout, workflows, and implementation order are documented in [`docs/SUPABASE_DESIGN.md`](docs/SUPABASE_DESIGN.md).
