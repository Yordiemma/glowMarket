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
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.push(nextPath?.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  }

  return <main className="simple-auth"><BrandMark/><form onSubmit={submit}><p className="kicker">SALON ADMIN</p><h1>Welcome back.</h1><p className="muted">Sign in to manage your storefront and orders.</p><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@salon.se"/></label><label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"/></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button><p className="center muted">New to GlowMarket? <Link href="/register">Register your salon</Link></p></form></main>;
}
