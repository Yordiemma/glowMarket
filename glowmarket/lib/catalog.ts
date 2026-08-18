import { createClient } from "@/lib/supabase/server";
export type CatalogProduct={id:string;name:string;brand:string;category:string;description:string;price_amount:number;currency:string;stock_quantity:number;image_path:string|null;salon_name:string;salon_slug:string;beauty_needs:string[];suitable_for:string};
export async function getPublishedProducts():Promise<CatalogProduct[]>{try{const supabase=await createClient();const{data,error}=await supabase.from("marketplace_products").select("*").order("name");return error?[]:(data??[]) as CatalogProduct[]}catch{return[]}}
