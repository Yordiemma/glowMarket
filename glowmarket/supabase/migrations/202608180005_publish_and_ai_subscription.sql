alter table public.businesses
  add column if not exists ai_subscription_status text not null default 'inactive'
  check (ai_subscription_status in ('inactive', 'active', 'past_due', 'cancelled'));

create or replace function public.enforce_verified_product_publish()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'active' and old.status is distinct from 'active' and not exists (
    select 1 from public.businesses b where b.id = new.business_id and b.verification_status = 'verified'
  ) then raise exception 'Business verification is required before publishing'; end if;
  return new;
end;
$$;

drop trigger if exists verify_product_before_publish on public.products;
create trigger verify_product_before_publish before update of status on public.products
for each row execute procedure public.enforce_verified_product_publish();
