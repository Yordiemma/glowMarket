import { NextRequest, NextResponse } from "next/server";
import { acceptedProductSchema } from "@/lib/ai-product";
import { createClient } from "@/lib/supabase/server";
import { getSellerAccess, localSellerBypassEnabled } from "@/lib/seller-access";

export const runtime = "nodejs";

export async function GET() {
  if (localSellerBypassEnabled()) return NextResponse.json({ products: [], localPreview: true });
  const access = await getSellerAccess();
  if (!access) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!access.businessId) return NextResponse.json({ products: [] });
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("id,name,brand,category,price_amount,stock_quantity,status,updated_at").eq("business_id", access.businessId).order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Products could not be loaded." }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: NextRequest) {
  const parsed = acceptedProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the listing fields and try again." }, { status: 400 });
  }
  if (localSellerBypassEnabled()) {
    return NextResponse.json({ saved: false, localPreview: true });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to save products." }, { status: 401 });
  }
  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .in("role", ["owner", "manager"])
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: "No seller business is connected to this account." }, { status: 403 });
  }

  const input = parsed.data;
  const { data: product, error } = await supabase.from("products").insert({
    business_id: membership.business_id,
    name: input.generated.title,
    brand: input.brand,
    category: input.generated.suggestedCategory,
    description: input.generated.description,
    benefits: input.generated.benefits,
    usage: input.generated.usage,
    tags: input.generated.tags,
    size: input.size,
    suitable_for: input.suitableFor,
    ingredients: input.ingredients,
    price_amount: Math.round(input.price * 100),
    stock_quantity: input.stock,
    status: "draft",
  }).select("id").single();
  if (error) {
    return NextResponse.json({ error: "The draft could not be saved." }, { status: 500 });
  }
  return NextResponse.json({ saved: true, productId: product.id });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null) as { productId?: string; action?: string } | null;
  if (!body?.productId || !["publish", "unpublish"].includes(body.action ?? "")) return NextResponse.json({ error: "Invalid product update." }, { status: 400 });
  if (localSellerBypassEnabled()) return NextResponse.json({ updated: true, localPreview: true });
  const access = await getSellerAccess();
  if (!access) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!access.businessId) return NextResponse.json({ error: "No seller business is connected to this account." }, { status: 403 });
  if (body.action === "publish") {
    if (!access.emailConfirmed) return NextResponse.json({ error: "Confirm your email before publishing." }, { status: 403 });
    if (access.verificationStatus !== "verified") return NextResponse.json({ error: "Your business must be verified before publishing." }, { status: 403 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").update({ status: body.action === "publish" ? "active" : "draft", updated_at: new Date().toISOString() }).eq("id", body.productId).eq("business_id", access.businessId).select("id,status").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "The product status could not be updated." }, { status: 500 });
  return NextResponse.json({ updated: true, product: data });
}
