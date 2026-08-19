import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { StoreOnboardingForm } from "@/components/StoreOnboardingForm";
import { getSellerAccess, localSellerBypassEnabled } from "@/lib/seller-access";

export default async function OnboardingPage() {
  if (localSellerBypassEnabled()) redirect("/dashboard");
  const access = await getSellerAccess();
  if (!access) redirect("/sign-in?next=/onboarding");
  if (access.businessId) redirect("/dashboard");
  return <main className="auth-layout"><section className="auth-art"><BrandMark/><div><p className="kicker">YOUR STORE, MADE SIMPLE</p><h2>You take care of beauty.<br/><em>We handle the store.</em></h2><p>No organisation number is needed yet. Verification happens only when you create with AI or publish.</p></div><small>No monthly seller fee · 10% on product sales</small></section><section className="auth-side"><StoreOnboardingForm/></section></main>;
}
