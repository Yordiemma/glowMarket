export function friendlyAuthMessage(error: unknown, action: "sign-in" | "register") {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const normalized = message.toLowerCase();
  if (normalized.includes("not configured")) return "Seller login is temporarily unavailable. The site owner needs to finish the secure account connection.";
  if (normalized.includes("invalid login credentials")) return "The email or password is incorrect. Check both fields and try again.";
  if (normalized.includes("email not confirmed")) return "Confirm your email using the link we sent before signing in.";
  if (normalized.includes("user already registered")) return "An account already exists for this email. Please sign in instead.";
  if (normalized.includes("password")) return "Use a password with at least 8 characters.";
  if (normalized.includes("rate") || normalized.includes("too many")) return "Too many attempts. Please wait a moment and try again.";
  return action === "sign-in" ? "We could not sign you in. Please try again." : "We could not create the account. Please check the details and try again.";
}
