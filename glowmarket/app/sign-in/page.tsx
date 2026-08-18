"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { createClient } from "@/lib/supabase/client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    let signInError: { message: string } | null = null;
    try {
      const result = await createClient().auth.signInWithPassword({ email, password });
      signInError = result.error;
    } catch (caughtError) {
      signInError = caughtError instanceof Error ? caughtError : new Error("Unable to start sign in.");
    }
    if (signInError) {
      setError(signInError.message);
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
        <p className="kicker">SALON PORTAL</p>
        <h2>Sign in to<br/><em>GlowMarket.</em></h2>
        <p>Access is limited to registered salon accounts.</p>
      </div>
    </aside>
    <section className="sign-in-content">
      <p className="sign-in-register">New salon? <Link href="/register">Register</Link></p>
      <form className="sign-in-form" onSubmit={submit}>
        <p className="kicker">SALON SIGN IN</p>
        <h1>Welcome back.</h1>
        <p className="muted">Enter the email and password connected to your salon account.</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@salon.se"/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"/>
        {error && <p className="form-error sign-in-error" role="alert">{error}</p>}
        <button className="button button-dark full sign-in-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  </main>;
}
