"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthMessage } from "@/lib/auth-message";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (process.env.NODE_ENV === "development") {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    let signInError: { message: string } | null = null;
    try {
      const result = await createClient().auth.signInWithPassword({ email, password });
      signInError = result.error;
    } catch (caughtError) {
      signInError = caughtError instanceof Error ? caughtError : new Error("Unable to start sign in.");
    }
    if (signInError) {
      setError(friendlyAuthMessage(signInError, "sign-in"));
      setLoading(false);
      return;
    }
    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.push(nextPath?.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  }

  return <main className="sign-in-page">
    <aside className="sign-in-intro">
      <BrandMark/>
      <div className="sign-in-copy">
        <p className="kicker">BEAUTY BUSINESS PORTAL</p>
        <h2>Sign in to<br/><em>GlowMarket.</em></h2>
        <p>Create listings with AI, manage products, and run your beauty store.</p>
      </div>
    </aside>
    <section className="sign-in-content">
      <p className="sign-in-register">New beauty business? <Link href="/register">Create an account</Link></p>
      <form className="sign-in-form" onSubmit={submit}>
        <p className="kicker">SELLER SIGN IN</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage your GlowMarket store.</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.se"/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"/>
        {searchParams.get("registered") === "1" && !error && <p className="verified-box" role="status">Account created. Confirm your email, then sign in.</p>}
        {searchParams.get("confirmation") === "failed" && !error && <p className="form-error sign-in-error" role="alert">That confirmation link is invalid or expired. Request a new signup email and try again.</p>}
        {error && <p className="form-error sign-in-error" role="alert">{error}</p>}
        <button className="button button-dark full sign-in-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  </main>;
}

export default function SignIn() {
  return <Suspense fallback={null}><SignInContent/></Suspense>;
}
