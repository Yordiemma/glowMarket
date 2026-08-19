import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (process.env.NODE_ENV === "development" && process.env.LOCAL_AUTH_BYPASS === "true") {
    return response;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Environment variables are configured separately in Vercel and are not
  // included in Git. Keep public pages available if deployment config is
  // incomplete, but never allow an unverified session into protected routes.
  if (!supabaseUrl || !supabaseKey) {
    if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("configuration", "missing");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/onboarding"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
