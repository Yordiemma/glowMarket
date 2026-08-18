import { createClient } from "@/lib/supabase/server";

export function localSellerBypassEnabled() {
  return process.env.NODE_ENV === "development" && process.env.LOCAL_AUTH_BYPASS === "true";
}

export async function getSellerAccess() {
  if (localSellerBypassEnabled()) return { local: true, userId: "local-development", emailConfirmed: true, businessId: "local-development", businessName: "Local test store", verificationStatus: "verified", aiSubscriptionStatus: "active" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: membership } = await supabase.from("business_members").select("business_id, businesses(display_name, verification_status, ai_subscription_status)").eq("user_id", user.id).in("role", ["owner", "manager"]).limit(1).maybeSingle();
  const value = membership?.businesses as unknown;
  const business = (Array.isArray(value) ? value[0] : value) as { display_name?: string; verification_status?: string; ai_subscription_status?: string } | null;
  return { local: false, userId: user.id, emailConfirmed: Boolean(user.email_confirmed_at), businessId: membership?.business_id ?? null, businessName: business?.display_name ?? "Beauty store", verificationStatus: business?.verification_status ?? "pending", aiSubscriptionStatus: business?.ai_subscription_status ?? "inactive" };
}
