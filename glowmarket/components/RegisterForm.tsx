"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthMessage } from "@/lib/auth-message";

export function RegisterForm({ demoMode = false }: { demoMode?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("The passwords do not match.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (demoMode) {
      localStorage.setItem("glowmarket-demo-email", email);
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setSubmitting(true);
    try {
      const readiness = await fetch("/api/auth/readiness", { cache: "no-store" });
      if (!readiness.ok) throw new Error("Seller registration is being set up. Please try again shortly.");
      const { data, error: signUpError } = await createClient().auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`, data: { account_type: "seller" } },
      });
      if (signUpError) throw signUpError;
      if (data.user?.identities?.length === 0) throw new Error("User already registered");
      if (data.session) { router.push("/onboarding"); router.refresh(); } else setCreated(true);
    } catch (caught) {
      setError(caught instanceof Error && caught.message.startsWith("Seller registration") ? caught.message : friendlyAuthMessage(caught, "register"));
    } finally { setSubmitting(false); }
  }

  async function resendConfirmation() {
    setError(""); setResent(false); setResending(true);
    const { error: resendError } = await createClient().auth.resend({ type: "signup", email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` } });
    if (resendError) setError(friendlyAuthMessage(resendError, "register")); else setResent(true);
    setResending(false);
  }

  if (created) return <div className="auth-panel registration-success">
    <div className="success-mark" aria-hidden="true">✓</div><p className="kicker">ONE MORE STEP</p><h1>Check your email.</h1>
    <p className="muted">We sent a confirmation link to <b>{email}</b>. Open it to confirm your account and create your beauty store.</p>
    {resent && <p className="verified-box" role="status">A new confirmation email has been sent.</p>}{error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-light full" type="button" onClick={resendConfirmation} disabled={resending}>{resending ? "Sending…" : "Resend confirmation email"}</button>
    <Link className="button button-dark full" href="/sign-in?registered=1">Back to sign in</Link>
  </div>;

  return <form className="auth-panel compact-register" onSubmit={submit}>
    <p className="kicker">SELLER ACCOUNT</p><h1>Create your account.</h1><p className="muted">Start with your login. Store details and business verification come later.</p>
    <label>Work email<input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@business.se" /></label>
    <label>Password<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Minimum 8 characters" /></label>
    <label>Confirm password<input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Repeat your password" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark full" disabled={submitting}>{submitting ? "Creating account…" : "Create seller account"}</button>
  </form>;
}
