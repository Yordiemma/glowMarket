alter table public.businesses
  alter column organisation_number drop not null,
  alter column address_line1 set default '',
  alter column city set default '';

alter table public.businesses drop constraint if exists businesses_organisation_number_check;
alter table public.businesses add constraint businesses_organisation_number_check
  check (organisation_number is null or organisation_number ~ '^\d{10}$');
alter table public.businesses add column if not exists business_type text;
alter table public.businesses add column if not exists logo_url text;

create or replace function public.create_unverified_store(p_name text,p_business_type text,p_description text default '',p_logo_url text default '')
returns uuid language plpgsql security definer set search_path=''
as $$
declare v_user uuid:=auth.uid();v_business uuid;v_slug text;v_email text;
begin
  if v_user is null then raise exception 'Authentication required';end if;
  if exists(select 1 from public.business_members where user_id=v_user) then raise exception 'Store already exists';end if;
  if trim(p_name)='' or p_business_type not in('Hair','Skincare','Nails','Makeup','Hair Extensions','Beauty Products','Other Beauty Business') then raise exception 'Invalid store details';end if;
  select email into v_email from public.profiles where id=v_user;
  v_slug:=trim(both '-' from regexp_replace(lower(p_name),'[^a-z0-9]+','-','g'))||'-'||substr(gen_random_uuid()::text,1,6);
  insert into public.businesses(legal_name,display_name,slug,organisation_number,description,email,address_line1,city,business_type,logo_url,verification_status)
  values(trim(p_name),trim(p_name),v_slug,null,trim(p_description),v_email,'','',p_business_type,nullif(trim(p_logo_url),''),'draft') returning id into v_business;
  insert into public.business_members(business_id,user_id,role) values(v_business,v_user,'owner');
  insert into public.verification_checks(business_id,check_type,status,provider) values
    (v_business,'organisation','not_started','bolagsverket'),(v_business,'identity','not_started','manual'),(v_business,'representation','not_started','manual');
  return v_business;
end;$$;
revoke all on function public.create_unverified_store(text,text,text,text) from public;
grant execute on function public.create_unverified_store(text,text,text,text) to authenticated;

create policy "members_update_business" on public.businesses for update to authenticated
using(exists(select 1 from public.business_members m where m.business_id=businesses.id and m.user_id=auth.uid() and m.role in('owner','manager')))
with check(exists(select 1 from public.business_members m where m.business_id=businesses.id and m.user_id=auth.uid() and m.role in('owner','manager')));
