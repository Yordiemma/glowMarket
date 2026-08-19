grant usage on schema public to anon, authenticated;

-- Public marketplace reads are still filtered by row-level security.
grant select on public.profiles, public.businesses, public.products to anon;

-- Signed-in sellers receive only the operations used by the MVP. Every table
-- below has row-level policies restricting access to the current user/store.
grant select, update on public.profiles to authenticated;
grant select, update on public.businesses to authenticated;
grant select on public.business_members, public.verification_checks to authenticated;
grant select, insert, update on public.products to authenticated;
grant select on public.orders, public.order_items to authenticated;
