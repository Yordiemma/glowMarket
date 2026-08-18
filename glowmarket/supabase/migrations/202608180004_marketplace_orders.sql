alter table public.businesses
  add column if not exists logo_path text,
  add column if not exists cover_path text,
  add column if not exists expertise text[] not null default '{}';

alter table public.products
  add column if not exists image_path text,
  add column if not exists beauty_needs text[] not null default '{}';

create type public.order_status as enum ('pending_payment','paid','processing','shipped','completed','cancelled','refunded');
create type public.payment_status as enum ('unpaid','paid','failed','refunded');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid references public.profiles(id),
  business_id uuid not null references public.businesses(id),
  customer_email text not null,
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'unpaid',
  subtotal_amount integer not null check (subtotal_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  shipping_name text not null,
  shipping_address jsonb not null,
  payment_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image_path text,
  unit_price_amount integer not null check (unit_price_amount > 0),
  quantity integer not null check (quantity > 0),
  line_total_amount integer not null check (line_total_amount > 0)
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy "customer_reads_orders" on public.orders for select to authenticated using (customer_id = auth.uid());
create policy "seller_reads_orders" on public.orders for select to authenticated using (exists (select 1 from public.business_members m where m.business_id=orders.business_id and m.user_id=auth.uid()));
create policy "order_parties_read_items" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id=order_items.order_id and (o.customer_id=auth.uid() or exists (select 1 from public.business_members m where m.business_id=o.business_id and m.user_id=auth.uid()))));

create or replace view public.marketplace_products with (security_invoker=true) as
select p.id,p.name,p.brand,p.category,p.description,p.benefits,p.usage,p.tags,p.size,p.suitable_for,p.beauty_needs,p.price_amount,p.currency,p.stock_quantity,p.image_path,
  b.id business_id,b.display_name salon_name,b.slug salon_slug,b.city,b.logo_path
from public.products p join public.businesses b on b.id=p.business_id
where p.status='active' and p.stock_quantity>0 and b.verification_status='verified';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy "public_product_images" on storage.objects for select using (bucket_id='product-images');
create policy "seller_upload_product_images" on storage.objects for insert to authenticated with check (
  bucket_id='product-images' and exists (
    select 1 from public.business_members m where m.user_id=auth.uid() and (storage.foldername(name))[1]=m.business_id::text and m.role in ('owner','manager')
  )
);
