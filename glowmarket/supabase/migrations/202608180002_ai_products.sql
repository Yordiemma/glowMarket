create type public.product_status as enum ('draft', 'active', 'archived');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 140),
  brand text not null,
  category text not null,
  description text not null,
  benefits text[] not null default '{}',
  usage text not null default '',
  tags text[] not null default '{}',
  size text not null,
  suitable_for text not null default '',
  ingredients text not null default '',
  price_amount integer not null check (price_amount > 0),
  currency char(3) not null default 'SEK' check (currency = 'SEK'),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_business_status_idx on public.products (business_id, status, updated_at desc);
alter table public.products enable row level security;

create policy "verified_products_public_read" on public.products for select using (
  status = 'active' and exists (
    select 1 from public.businesses b
    where b.id = products.business_id and b.verification_status = 'verified'
  )
);
create policy "seller_products_read" on public.products for select to authenticated using (
  exists (
    select 1 from public.business_members m
    where m.business_id = products.business_id and m.user_id = auth.uid()
  )
);
create policy "seller_products_insert" on public.products for insert to authenticated with check (
  exists (
    select 1 from public.business_members m
    where m.business_id = products.business_id and m.user_id = auth.uid() and m.role in ('owner', 'manager')
  )
);
create policy "seller_products_update" on public.products for update to authenticated using (
  exists (
    select 1 from public.business_members m
    where m.business_id = products.business_id and m.user_id = auth.uid() and m.role in ('owner', 'manager')
  )
) with check (
  exists (
    select 1 from public.business_members m
    where m.business_id = products.business_id and m.user_id = auth.uid() and m.role in ('owner', 'manager')
  )
);
