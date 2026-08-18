# GlowMarket — Supabase MVP design

Status: architecture approved for implementation; no production Supabase project is connected yet.

## 1. MVP proof

The first release must prove one complete journey:

1. A salon owner creates an email/password account.
2. They submit a registered Swedish business and salon profile.
3. An administrator verifies or rejects that business.
4. A verified salon publishes products with images and stock.
5. A customer browses the public marketplace and places an order.
6. The salon sees and fulfils its own orders.

BankID, automated registry lookup, AI image enhancement, and live payments are later integrations. Their data boundaries are included now so they can be added without redesigning the core.

## 2. Identity and roles

Supabase Auth owns credentials and sessions in `auth.users`. Application identity belongs in `public.profiles`; credentials must never be copied into public tables.

### Platform roles

`profiles.platform_role`:

- `customer` — default account; can shop and manage only their own orders/profile.
- `admin` — platform operator; can review businesses and moderate the marketplace.

Being a seller is a business membership, not a global user role. `business_members` grants access to one salon:

- `owner` — full salon access and membership management.
- `manager` — products, orders, and storefront.
- `staff` — operational order access only.

This model supports one person owning multiple salons and a salon having multiple staff accounts.

## 3. Relationship model

```text
auth.users 1──1 profiles
profiles   1──* business_members *──1 businesses
businesses 1──* business_verifications
businesses 1──* products 1──* product_images
profiles   1──* orders 1──* order_items *──1 products
businesses 1──* orders
orders     1──* order_events
```

MVP rule: one order belongs to one business. A cart containing products from two salons becomes two orders at checkout. This keeps fulfilment, payouts, refunds, RLS, and seller views understandable.

## 4. Enums

| Enum | Values |
| --- | --- |
| `platform_role` | `customer`, `admin` |
| `business_member_role` | `owner`, `manager`, `staff` |
| `verification_status` | `draft`, `pending`, `verified`, `rejected`, `suspended` |
| `product_status` | `draft`, `active`, `archived` |
| `order_status` | `pending_payment`, `paid`, `processing`, `shipped`, `completed`, `cancelled`, `refunded` |
| `payment_status` | `unpaid`, `authorized`, `paid`, `partially_refunded`, `refunded`, `failed` |
| `image_kind` | `original`, `enhanced` |

Use PostgreSQL enums for stable workflow states. Changing a label requires a migration, which is desirable for security-sensitive states.

## 5. Tables

All primary keys are `uuid` with `gen_random_uuid()`. All timestamps are `timestamptz` in UTC. Mutable tables include `created_at` and `updated_at`; an update trigger manages `updated_at`.

### `profiles`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK; FK to `auth.users(id)` on delete cascade |
| `email` | `text` | informational snapshot; unique; lower-case |
| `full_name` | `text` | required |
| `phone` | `text` | nullable |
| `avatar_path` | `text` | nullable storage object path, not a permanent signed URL |
| `platform_role` | enum | required, default `customer`; only service/admin may change |
| `created_at`, `updated_at` | `timestamptz` | required |

A security-definer trigger creates a `profiles` row when a confirmed Auth user is created. The trigger copies only safe signup metadata. Users cannot update `platform_role`.

### `businesses`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `legal_name` | `text` | required; registered legal entity name |
| `display_name` | `text` | required; public salon name |
| `slug` | `text` | required; unique public URL key |
| `organisation_number` | `text` | required; unique; normalized 10 digits |
| `description` | `text` | nullable; max length enforced |
| `email`, `phone` | `text` | business contact fields |
| `address_line1`, `postal_code`, `city`, `country_code` | `text` | country defaults to `SE` |
| `logo_path`, `cover_path` | `text` | nullable storage paths |
| `verification_status` | enum | default `draft`; seller cannot update directly |
| `verified_at` | `timestamptz` | nullable; admin/server controlled |
| `payouts_ready` | `boolean` | default false; webhook/server controlled |
| `created_at`, `updated_at` | `timestamptz` | required |

The raw organisation number and address are visible only to members and admins. Public clients query a safe public view/RPC exposing display fields only.

### `business_members`

| Column | Type | Rules |
| --- | --- | --- |
| `business_id` | `uuid` | FK to businesses on delete cascade |
| `user_id` | `uuid` | FK to profiles on delete cascade |
| `role` | enum | required |
| `created_at` | `timestamptz` | required |

Composite PK: `(business_id, user_id)`. The salon onboarding transaction inserts the business and its initial `owner` membership together through a database function.

### `business_verifications`

Append-only audit history. Sellers can submit; only admins/service functions can decide.

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `business_id` | `uuid` | FK to businesses |
| `status` | enum | required |
| `provider` | `text` | e.g. `manual`, future registry provider |
| `provider_reference` | `text` | nullable; never expose publicly |
| `submitted_data` | `jsonb` | normalized request snapshot |
| `reason` | `text` | rejection/suspension explanation |
| `reviewed_by` | `uuid` | nullable FK to profiles |
| `reviewed_at`, `created_at` | `timestamptz` | timestamps |

Do not store unnecessary identity documents. If documents become mandatory, use a private bucket, short retention, and an explicit deletion policy.

### `products`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `business_id` | `uuid` | required FK to businesses |
| `name`, `slug` | `text` | required; unique together with `business_id` |
| `description` | `text` | required |
| `category` | `text` | controlled application value for MVP |
| `price_amount` | `integer` | required; positive; stored in öre |
| `currency` | `char(3)` | default `SEK`; MVP check requires `SEK` |
| `stock_quantity` | `integer` | required; nonnegative |
| `status` | enum | default `draft` |
| `created_at`, `updated_at` | `timestamptz` | required |

An `active` product is public only when its business is `verified`. Stock decrements in a locked database transaction after confirmed payment, never from an untrusted browser update.

### `product_images`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `product_id` | `uuid` | required FK to products on delete cascade |
| `storage_path` | `text` | required; unique |
| `kind` | enum | default `original` |
| `sort_order` | `smallint` | default 0; nonnegative |
| `alt_text` | `text` | required before product activation |
| `created_at` | `timestamptz` | required |

Store object paths, not public URLs, so bucket access strategy can change later.

### `orders`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `order_number` | `bigint generated always as identity` | unique customer-facing reference |
| `customer_id` | `uuid` | nullable FK to profiles; null supports guest checkout |
| `business_id` | `uuid` | required FK to businesses; one salon per order |
| `customer_email` | `text` | required snapshot |
| `status` | enum | default `pending_payment` |
| `payment_status` | enum | default `unpaid` |
| `currency` | `char(3)` | default `SEK` |
| `subtotal_amount`, `shipping_amount`, `total_amount` | `integer` | nonnegative öre values; server computed |
| `shipping_name` | `text` | required |
| `shipping_address` | `jsonb` | validated server-side; private |
| `payment_provider`, `payment_reference` | `text` | nullable; server controlled |
| `created_at`, `updated_at` | `timestamptz` | required |

Guests receive a signed, expiring order-access link; order rows must not be made public based on email alone.

### `order_items`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `order_id` | `uuid` | required FK to orders on delete cascade |
| `product_id` | `uuid` | nullable FK using `on delete set null` |
| `product_name`, `product_image_path` | `text` | immutable purchase-time snapshots |
| `unit_price_amount` | `integer` | positive; purchase-time price in öre |
| `quantity` | `integer` | positive |
| `line_total_amount` | `integer` | server generated/validated |

Historical orders stay correct when products are renamed, repriced, archived, or deleted.

### `order_events`

Append-only timeline for status changes and webhook processing.

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `order_id` | `uuid` | FK to orders |
| `event_type` | `text` | required |
| `actor_id` | `uuid` | nullable FK to profiles |
| `metadata` | `jsonb` | safe operational details; no secrets |
| `created_at` | `timestamptz` | required |

## 6. Indexes and constraints

- Unique, case-insensitive email index on `lower(profiles.email)`.
- Unique normalized `businesses.organisation_number`.
- Unique index on `lower(businesses.slug)`.
- Unique `(business_id, lower(products.slug))`.
- Marketplace index on `products(status, created_at desc)`.
- Seller product index on `products(business_id, status, updated_at desc)`.
- Seller order index on `orders(business_id, created_at desc)`.
- Customer order index on `orders(customer_id, created_at desc)` where customer is not null.
- Unique payment reference where non-null to make payment webhooks idempotent.
- Checks for trimmed nonempty names, ISO currency/country lengths, nonnegative money/stock, and Swedish organisation-number format.

Format validation is not business verification. A server-side verification process must confirm registry status before setting `verified`.

## 7. RLS authorization helpers

Place `security definer` helper functions in a non-exposed `private` schema, fix their `search_path`, revoke public execution by default, and grant only required functions.

```text
private.is_platform_admin(user_id)
private.is_business_member(business_id, user_id)
private.has_business_role(business_id, user_id, allowed_roles[])
```

Avoid user-editable Auth metadata for authorization. Database membership is the source of truth. Admin claims may be cached in `app_metadata`, but database checks remain authoritative for sensitive writes.

## 8. RLS matrix

Every public table has RLS enabled. First revoke automatic privileges from `anon` and `authenticated`, then grant back only the operations listed below.

| Resource | Anonymous | Customer | Business member | Platform admin |
| --- | --- | --- | --- | --- |
| Profile | none | select/update own safe fields | same | all |
| Public salon fields | read verified only | read verified only | read own full business | all |
| Business | none directly | none directly | select/update own safe fields | all |
| Membership | none | own rows | owner reads/manages own business members | all |
| Verification | none | none | insert/read own business submissions | all; decisions only |
| Product | read active + verified salon | same | CRUD own business products | all |
| Product image rows | read images of public products | same | CRUD own business product images | all |
| Order | none | read own orders | read/update fulfilment fields for own business | all |
| Order item | none | read items through own order | read items through own business order | all |
| Order event | none | read safe customer-visible events | read/append allowed events for own business | all |

Critical policy details:

- `INSERT` uses `with check`; `UPDATE` uses both `using` and `with check`.
- Seller product writes require an `owner` or `manager` membership.
- Sellers cannot set `businesses.verification_status`, `verified_at`, payout state, payment state, payment references, totals, or platform roles.
- Prefer RPCs for state transitions so column restrictions are explicit.
- Updates require a matching `SELECT` policy in PostgreSQL RLS.
- The service-role key bypasses RLS and exists only in trusted server/Edge Function environments.

## 9. Public read model

Do not expose `businesses` wholesale. Create `public.marketplace_products` as a PostgreSQL 15+ `security_invoker` view, or expose an RPC returning only:

- product id, name, slug, description, category, price, currency;
- product image paths and alt text;
- salon id, display name, slug, city, logo path;
- a server-derived verified badge.

The underlying predicate requires `products.status = 'active'` and `businesses.verification_status = 'verified'`.

## 10. Storage buckets

### `product-images` — public read, controlled writes

Object convention:

```text
{business_id}/{product_id}/{image_id}-original.webp
{business_id}/{product_id}/{image_id}-enhanced.webp
```

Anonymous users may read images belonging to active products of verified salons. Owner/manager members may upload, replace, and delete only under their business ID and only for products owned by that business. Validate MIME type, maximum size, and dimensions server-side; do not trust the extension.

### `business-assets` — public read, controlled writes

```text
{business_id}/logo/{asset_id}.webp
{business_id}/cover/{asset_id}.webp
```

Same ownership policy as product images.

### `verification-documents` — private, later only

No anonymous or ordinary authenticated reads. Uploads use short-lived signed operations; only the submitting business and authorised reviewers receive time-limited signed URLs. Add retention/deletion rules before enabling this bucket.

## 11. Trusted server operations

Use Next.js server routes or Supabase Edge Functions for:

- creating a business and initial owner membership atomically;
- submitting and deciding verification;
- creating checkout sessions from current database prices;
- payment webhooks and idempotent order/payment transitions;
- stock reservation/decrement with row locking;
- AI image jobs and secret API credentials;
- admin-only actions and audit events.

Never accept order totals, business verification state, payment status, AI provider keys, or storage ownership paths as trusted browser input.

## 12. Verification workflow

```text
draft
  → pending       seller submits complete business
  → verified      admin/provider confirms registration
  → rejected      review fails; reason required
verified
  → suspended     platform action; public products disappear
rejected
  → pending       seller corrects and resubmits
```

Each transition appends `business_verifications`; the current state is copied to `businesses.verification_status` in the same transaction. Only a trusted function can move to `verified`, `rejected`, or `suspended`.

## 13. Order workflow

```text
pending_payment → paid → processing → shipped → completed
       │            │         │
       └────────────┴─────────→ cancelled/refunded where allowed
```

- Checkout reads product prices and availability from PostgreSQL.
- Payment provider callbacks are verified and idempotent.
- The webhook changes payment/order state and adjusts stock transactionally.
- Sellers can move only fulfilment states for orders belonging to their business.
- Customers cannot write order or payment state directly.

## 14. Build sequence

1. Create Supabase environments and migration workflow.
2. Implement enums, tables, constraints, indexes, and timestamp/profile triggers.
3. Implement least-privilege grants, RLS helpers, policies, and policy tests.
4. Add email/password Auth and SSR session handling in Next.js.
5. Replace the demo salon onboarding with atomic business creation and pending verification.
6. Add an admin verification screen.
7. Replace demo dashboard products with product CRUD and Storage uploads.
8. Connect marketplace pages to the safe public read model.
9. Add one-salon cart, guest/account checkout, and order creation.
10. Integrate a payment provider and verified webhook flow.
11. Add AI enhancement, automated registry checks, and BankID only after the core loop works.

## 15. Decisions still needed before implementation

- Exact Swedish registry data provider and its permitted use/retention terms.
- Marketplace commission and payout model.
- Payment provider and whether the platform or salon is merchant of record.
- Shipping responsibility, pricing, and supported regions.
- Tax/VAT display and invoicing requirements.
- Whether salon staff invitations are included in MVP or only supported by the schema.
- Guest checkout versus mandatory customer accounts.

## 16. Security acceptance tests

Before launch, automated tests must prove:

- anonymous users cannot read draft products or unverified businesses;
- seller A cannot read private fields or mutate products/orders for seller B;
- a customer cannot change their role, any price, order total, payment state, or verification state;
- suspended businesses immediately disappear from public reads;
- storage uploads cannot escape the caller's business/product prefix;
- deleting/archiving a product does not corrupt historical order items;
- repeated payment webhooks do not duplicate orders, payments, or stock changes;
- service-role credentials are absent from browser bundles and logs.
