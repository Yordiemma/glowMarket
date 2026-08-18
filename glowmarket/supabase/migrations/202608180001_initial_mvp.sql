create extension if not exists pgcrypto;

create type public.platform_role as enum ('customer', 'admin');
create type public.business_member_role as enum ('owner', 'manager', 'staff');
create type public.verification_status as enum ('draft', 'pending', 'verified', 'rejected', 'suspended');
create type public.verification_check_type as enum ('organisation', 'identity', 'representation');
create type public.verification_check_status as enum ('not_started', 'pending', 'passed', 'failed', 'manual_review');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  platform_role public.platform_role not null default 'customer',
  created_at timestamptz not null default now()
);
create unique index profiles_email_unique on public.profiles (lower(email));

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  display_name text not null,
  slug text not null,
  organisation_number text not null check (organisation_number ~ '^\d{10}$'),
  description text not null default '',
  email text not null,
  address_line1 text not null,
  city text not null,
  country_code char(2) not null default 'SE',
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index businesses_slug_unique on public.businesses (lower(slug));
create unique index businesses_org_number_unique on public.businesses (organisation_number);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.business_member_role not null,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create table public.verification_checks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  check_type public.verification_check_type not null,
  status public.verification_check_status not null default 'not_started',
  provider text not null,
  provider_reference text,
  failure_reason text,
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, check_type)
);

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
    insert into public.businesses
      (legal_name, display_name, slug, organisation_number, description, email, address_line1, city)
    values (v_name, v_name, v_slug, v_org,
      trim(coalesce(new.raw_user_meta_data ->> 'description', '')), lower(new.email),
      trim(coalesce(new.raw_user_meta_data ->> 'address', '')),
      trim(coalesce(new.raw_user_meta_data ->> 'city', '')))
    returning id into v_business_id;
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
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.submit_business_application(
  p_organisation_number text, p_display_name text, p_city text,
  p_address_line1 text, p_description text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_org text := regexp_replace(p_organisation_number, '\D', '', 'g');
  v_slug text;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if v_org !~ '^\d{10}$' then raise exception 'Invalid Swedish organisation number'; end if;
  if trim(p_display_name) = '' or trim(p_city) = '' or trim(p_address_line1) = '' then
    raise exception 'Missing required salon information';
  end if;
  v_slug := trim(both '-' from regexp_replace(lower(p_display_name), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(gen_random_uuid()::text, 1, 6);
  insert into public.businesses
    (legal_name, display_name, slug, organisation_number, description, email, address_line1, city)
  select trim(p_display_name), trim(p_display_name), v_slug, v_org,
    trim(p_description), email, trim(p_address_line1), trim(p_city)
  from public.profiles where id = v_user_id returning id into v_business_id;
  insert into public.business_members (business_id, user_id, role)
    values (v_business_id, v_user_id, 'owner');
  insert into public.verification_checks (business_id, check_type, status, provider) values
    (v_business_id, 'organisation', 'pending', 'bolagsverket'),
    (v_business_id, 'identity', 'not_started', 'bankid'),
    (v_business_id, 'representation', 'not_started', 'manual');
  return v_business_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.verification_checks enable row level security;
create policy "profiles_read_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "members_read_own" on public.business_members for select using (user_id = auth.uid());
create policy "members_read_business" on public.businesses for select using (
  exists (select 1 from public.business_members m where m.business_id = id and m.user_id = auth.uid())
);
create policy "members_read_checks" on public.verification_checks for select using (
  exists (select 1 from public.business_members m where m.business_id = verification_checks.business_id and m.user_id = auth.uid())
);
revoke all on function public.submit_business_application(text, text, text, text, text) from public;
grant execute on function public.submit_business_application(text, text, text, text, text) to authenticated;
