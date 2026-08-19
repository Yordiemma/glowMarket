import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ready: false, reason: "configuration" }, { status: 503 });
  }

  try {
    const response = await fetch(`${url}/rest/v1/profiles?select=id&limit=0`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      return NextResponse.json({ ready: false, reason: "database" }, { status: 503 });
    }
    return NextResponse.json({ ready: true });
  } catch {
    return NextResponse.json({ ready: false, reason: "unavailable" }, { status: 503 });
  }
}
