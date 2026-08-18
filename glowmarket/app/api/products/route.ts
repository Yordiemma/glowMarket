import { NextRequest, NextResponse } from "next/server";
import { acceptedProductSchema } from "@/lib/ai-product";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const parsed = acceptedProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the listing fields and try again." }, { status: 400 });
  }
  if (process.env.NODE_ENV === "development" && process.env.LOCAL_AUTH_BYPASS === "true") {
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
