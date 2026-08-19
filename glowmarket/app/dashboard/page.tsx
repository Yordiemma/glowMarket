import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/DashboardClient";
import { getSellerAccess } from "@/lib/seller-access";

export default async function Dashboard() {
  const access = await getSellerAccess();
  if (!access) redirect("/sign-in?next=/dashboard");
  if (!access.businessId) redirect("/onboarding");
  return <DashboardClient/>;
}
