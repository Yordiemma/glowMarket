"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const types = ["Hair", "Skincare", "Nails", "Makeup", "Hair Extensions", "Beauty Products", "Other Beauty Business"] as const;

export function StoreOnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/store", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), businessType: form.get("businessType"), description: form.get("description"), logoUrl: form.get("logoUrl") }) });
    const body = await response.json().catch(() => null);
    if (!response.ok) { setError(body?.error || "Your store could not be created. Please try again."); setLoading(false); return; }
    router.replace("/dashboard"); router.refresh();
  }

  return <form className="auth-panel onboarding-form" onSubmit={submit}>
    <p className="kicker">WELCOME TO GLOWMARKET</p><h1>Create your beauty store.</h1>
    <p className="muted">Just the essentials for now. You can improve these details later.</p>
    <label>Store name<input name="name" required minLength={2} autoComplete="organization" placeholder="Your beauty store" /></label>
    <label>Beauty business type<select name="businessType" required defaultValue=""><option value="" disabled>Choose one</option>{types.map(type => <option key={type}>{type}</option>)}</select></label>
    <label>Short description <span className="optional-label">Optional</span><textarea name="description" maxLength={500} placeholder="What does your store specialise in?" /></label>
    <label>Logo image URL <span className="optional-label">Optional</span><input name="logoUrl" type="url" inputMode="url" placeholder="https://…" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark full" disabled={loading}>{loading ? "Creating your store…" : "Create store and continue"}</button>
  </form>;
}
