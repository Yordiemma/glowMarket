import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSellerAccess } from "@/lib/seller-access";
import { BolagsverketAuthenticationError, BolagsverketConfigurationError, BolagsverketUnavailableError, findTestBusiness, isValidSwedishOrganisationNumber, normalizeOrganisationNumber } from "@/lib/bolagsverket";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const access = await getSellerAccess();
  if (!access?.businessId || access.local) return NextResponse.json({ error: access?.local ? "Local preview is already verified." : "Create your store before verifying it." }, { status: 400 });
  if (!access.emailConfirmed) return NextResponse.json({ error: "Confirm your email before verifying your business." }, { status: 403 });
  const body = await request.json().catch(() => null) as { organisationNumber?: unknown } | null;
  if (typeof body?.organisationNumber !== "string" || !isValidSwedishOrganisationNumber(body.organisationNumber)) return NextResponse.json({ error: "Enter a valid 10-digit Swedish organisation number." }, { status: 400 });
  try {
    const business = await findTestBusiness(normalizeOrganisationNumber(body.organisationNumber));
    if (!business) return NextResponse.json({ error: "That organisation number was not found in Bolagsverket’s test environment." }, { status: 404 });
    const supabase = await createClient();
    const { error } = await supabase.from("businesses").update({ organisation_number: business.organisationNumber, legal_name: business.name || access.businessName, verification_status: "verified", verified_at: new Date().toISOString() }).eq("id", access.businessId);
    if (error) return NextResponse.json({ error: error.code === "23505" ? "That organisation number is already connected to another store." : "The verified result could not be saved." }, { status: 400 });
    return NextResponse.json({ verified: true, business });
  } catch (error) {
    if (error instanceof BolagsverketConfigurationError) return NextResponse.json({ error: "Business verification is not configured yet. Contact GlowMarket support." }, { status: 503 });
    if (error instanceof BolagsverketAuthenticationError) return NextResponse.json({ error: "Bolagsverket test credentials were rejected. Contact GlowMarket support." }, { status: 502 });
    if (error instanceof BolagsverketUnavailableError) return NextResponse.json({ error: "Bolagsverket’s test service is temporarily unavailable. Try again shortly." }, { status: 502 });
    return NextResponse.json({ error: "Business verification failed. Please try again." }, { status: 502 });
  }
}
