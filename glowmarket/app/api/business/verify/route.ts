import { NextRequest, NextResponse } from "next/server";
import {
  BolagsverketAuthenticationError,
  BolagsverketConfigurationError,
  BolagsverketUnavailableError,
  findTestBusiness,
  isValidSwedishOrganisationNumber,
  normalizeOrganisationNumber,
} from "@/lib/bolagsverket";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { organisationNumber?: unknown } | null;
  if (typeof body?.organisationNumber !== "string" || !isValidSwedishOrganisationNumber(body.organisationNumber)) {
    return NextResponse.json({ error: "Enter a valid Swedish organisation number." }, { status: 400 });
  }

  try {
    const business = await findTestBusiness(normalizeOrganisationNumber(body.organisationNumber));
    if (!business) {
      return NextResponse.json({ verified: false, error: "This business was not found in Bolagsverket's test data." }, { status: 404 });
    }
    return NextResponse.json({ verified: true, business });
  } catch (error) {
    if (error instanceof BolagsverketConfigurationError) {
      return NextResponse.json({ error: "Business verification is not configured yet." }, { status: 503 });
    }
    if (error instanceof BolagsverketAuthenticationError) {
      return NextResponse.json({ error: "Business verification credentials were rejected." }, { status: 502 });
    }
    if (error instanceof BolagsverketUnavailableError) {
      return NextResponse.json({ error: "Business verification is temporarily unavailable." }, { status: 502 });
    }
    return NextResponse.json({ error: "Business verification failed." }, { status: 502 });
  }
}
