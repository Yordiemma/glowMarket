export function friendlyAuthMessage(error: unknown, action: "sign-in" | "register") {
  const message = error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "";
  const normalized = message.toLowerCase();
  if (normalized.includes("not configured")) return "Seller login is temporarily unavailable. The site owner needs to finish the secure account connection.";
  if (normalized.includes("invalid login credentials")) return "The email or password is incorrect. Check both fields and try again.";
  if (normalized.includes("email not confirmed")) return "Confirm your email using the link we sent before signing in.";
  if (normalized.includes("user already registered")) return "An account already exists for this email. Please sign in instead.";
  if (normalized.includes("database error") || normalized.includes("saving new user")) return "GlowMarket's seller database is not ready yet. The site owner needs to apply the Supabase migrations.";
  if (normalized.includes("email rate limit") || normalized.includes("email rate")) return "The confirmation email limit was reached. Please wait a few minutes and try again.";
  if (normalized.includes("email address") && normalized.includes("invalid")) return "Enter a valid email address and check for typing mistakes.";
  if (normalized.includes("password")) return "Use a password with at least 8 characters.";
  if (normalized.includes("rate") || normalized.includes("too many")) return "Too many attempts. Please wait a moment and try again.";
  return action === "sign-in" ? "We could not sign you in. Please try again." : "We could not create the account. Please check the details and try again.";
}
