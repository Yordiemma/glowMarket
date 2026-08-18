alter table public.businesses
  add column if not exists postal_code text,
  add column if not exists shipping_address_line1 text,
  add column if not exists shipping_postal_code text,
  add column if not exists shipping_city text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_business_id uuid;
  v_org text := regexp_replace(coalesce(new.raw_user_meta_data ->> 'organisation_number', ''), '\D', '', 'g');
  v_name text := trim(coalesce(new.raw_user_meta_data ->> 'salon_name', ''));
  v_slug text;
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  if v_name <> '' then
    if v_org !~ '^\d{10}$' then raise exception 'Invalid Swedish organisation number'; end if;
    v_slug := trim(both '-' from regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g'))
      || '-' || substr(gen_random_uuid()::text, 1, 6);

    insert into public.businesses (
      legal_name, display_name, slug, organisation_number, description, email,
      address_line1, postal_code, city,
      shipping_address_line1, shipping_postal_code, shipping_city
    ) values (
      v_name, v_name, v_slug, v_org,
      trim(coalesce(new.raw_user_meta_data ->> 'description', '')), lower(new.email),
      trim(coalesce(new.raw_user_meta_data ->> 'address', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'postal_code', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'city', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'shipping_address', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'shipping_postal_code', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'shipping_city', ''))
    ) returning id into v_business_id;

    insert into public.business_members (business_id, user_id, role)
      values (v_business_id, new.id, 'owner');
    insert into public.verification_checks (business_id, check_type, status, provider) values
      (v_business_id, 'organisation', 'pending', 'bolagsverket'),
      (v_business_id, 'identity', 'not_started', 'bankid'),
      (v_business_id, 'representation', 'not_started', 'manual');
  end if;
  return new;
end;
$$;
