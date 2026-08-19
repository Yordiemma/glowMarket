create or replace function public.place_marketplace_order(p_customer jsonb,p_items jsonb)
returns table(order_id uuid,order_number bigint)
language plpgsql security definer set search_path=''
as $$
declare
  v_item jsonb; v_product public.products%rowtype; v_business uuid; v_order uuid;
  v_subtotal integer:=0; v_shipping integer:=5900; v_number bigint; v_quantity integer;
begin
  if jsonb_array_length(p_items)<1 then raise exception 'Cart is empty'; end if;
  if trim(coalesce(p_customer->>'name',''))='' or trim(coalesce(p_customer->>'email',''))='' then raise exception 'Customer details required'; end if;
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity:=(v_item->>'quantity')::integer;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid and status='active' for update;
    if not found then raise exception 'Product unavailable'; end if;
    if v_quantity<1 or v_product.stock_quantity<v_quantity then raise exception 'Insufficient stock'; end if;
    if v_business is null then v_business:=v_product.business_id; elsif v_business<>v_product.business_id then raise exception 'One seller per order'; end if;
    v_subtotal:=v_subtotal+(v_product.price_amount*v_quantity);
  end loop;
  insert into public.orders(customer_id,business_id,customer_email,status,payment_status,subtotal_amount,shipping_amount,total_amount,shipping_name,shipping_address)
  values(auth.uid(),v_business,lower(p_customer->>'email'),'pending_payment','unpaid',v_subtotal,v_shipping,v_subtotal+v_shipping,p_customer->>'name',jsonb_build_object('address',p_customer->>'address','postalCode',p_customer->>'postalCode','city',p_customer->>'city'))
  returning id,public.orders.order_number into v_order,v_number;
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity:=(v_item->>'quantity')::integer; select * into v_product from public.products where id=(v_item->>'productId')::uuid for update;
    insert into public.order_items(order_id,product_id,product_name,product_image_path,unit_price_amount,quantity,line_total_amount)
    values(v_order,v_product.id,v_product.name,v_product.image_path,v_product.price_amount,v_quantity,v_product.price_amount*v_quantity);
    update public.products set stock_quantity=stock_quantity-v_quantity,updated_at=now() where id=v_product.id;
  end loop;
  return query select v_order,v_number;
end;$$;
revoke all on function public.place_marketplace_order(jsonb,jsonb) from public;
grant execute on function public.place_marketplace_order(jsonb,jsonb) to anon,authenticated;

create policy "admins_read_businesses" on public.businesses for select to authenticated using(exists(select 1 from public.profiles p where p.id=auth.uid() and p.platform_role='admin'));
create policy "admins_update_businesses" on public.businesses for update to authenticated using(exists(select 1 from public.profiles p where p.id=auth.uid() and p.platform_role='admin'));
create policy "admins_read_products" on public.products for select to authenticated using(exists(select 1 from public.profiles p where p.id=auth.uid() and p.platform_role='admin'));

create policy "seller_delete_own_product_images" on storage.objects for delete to authenticated using(
  bucket_id='product-images' and exists(
    select 1 from public.business_members m
    where m.user_id=auth.uid() and (storage.foldername(name))[1]=m.business_id::text and m.role in('owner','manager')
  )
);
