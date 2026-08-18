import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextRequest, NextResponse } from "next/server";
import { generatedProductSchema, productInputSchema } from "@/lib/ai-product";
import { takeAiGenerationSlot } from "@/lib/rate-limit";
import { getSellerAccess, localSellerBypassEnabled } from "@/lib/seller-access";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const localBypass = localSellerBypassEnabled();
  let userId: string | undefined;
  if (!localBypass) {
    const access = await getSellerAccess();
    if (!access) return NextResponse.json({ error: "Please sign in to use AI Studio." }, { status: 401 });
    if (!access.emailConfirmed) return NextResponse.json({ error: "Confirm your email before using AI Studio." }, { status: 403 });
    if (access.verificationStatus !== "verified") return NextResponse.json({ error: "Your beauty business must be verified before using AI Studio." }, { status: 403 });
    if (access.aiSubscriptionStatus !== "active") return NextResponse.json({ error: "An active AI subscription is required to generate product content." }, { status: 402 });
    userId = access.userId;
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = userId ?? forwardedFor ?? "local-development";
  const rateLimit = takeAiGenerationSlot(identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Generation limit reached. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const parsedInput = productInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsedInput.success) {
    return NextResponse.json({ error: "Check the product details and try again." }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI Studio is not configured yet." }, { status: 503 });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.parse({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: `You prepare accurate beauty product listings for a Swedish beauty marketplace.
Use only seller-provided facts. Never invent ingredients, size, certifications, test results, medical claims, or health claims. Never say a product treats or cures a condition. If a benefit or usage detail is unsupported, omit it. Write in the requested language. Return concise marketplace copy for seller review; it will not be auto-published.`,
        },
        { role: "user", content: JSON.stringify(parsedInput.data) },
      ],
      text: { format: zodTextFormat(generatedProductSchema, "product_listing") },
    });
    if (!response.output_parsed) {
      return NextResponse.json({ error: "AI could not prepare this listing. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ product: response.output_parsed });
  } catch (error) {
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return NextResponse.json({ error: "AI generation is unavailable because the usage limit has been reached." }, { status: 429 });
    }
    return NextResponse.json({ error: "AI generation is temporarily unavailable." }, { status: 502 });
  }
}
