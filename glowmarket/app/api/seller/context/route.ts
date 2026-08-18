import { NextResponse } from "next/server";
import { getSellerAccess } from "@/lib/seller-access";

export async function GET() {
  const access = await getSellerAccess();
  if (!access) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({ ...access, canPublish: access.emailConfirmed && access.verificationStatus === "verified", canUseAi: access.emailConfirmed && access.verificationStatus === "verified" && access.aiSubscriptionStatus === "active" });
}
