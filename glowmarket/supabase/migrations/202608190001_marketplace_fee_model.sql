alter table public.orders
  add column if not exists platform_fee_rate numeric(5,4) not null default 0.10
    check (platform_fee_rate >= 0 and platform_fee_rate <= 1),
  add column if not exists platform_fee_amount integer
    generated always as (round(subtotal_amount * platform_fee_rate)) stored,
  add column if not exists seller_product_proceeds integer
    generated always as (subtotal_amount - round(subtotal_amount * platform_fee_rate)) stored;

comment on column public.orders.platform_fee_rate is
  'GlowMarket commission rate applied to product subtotal only. Shipping is excluded.';
comment on column public.orders.platform_fee_amount is
  'GlowMarket commission in öre, calculated from subtotal_amount only.';
comment on column public.orders.seller_product_proceeds is
  'Product subtotal after GlowMarket commission, before payment-provider adjustments.';

alter table public.orders
  add constraint orders_total_matches_components
  check (total_amount = subtotal_amount + shipping_amount) not valid;
