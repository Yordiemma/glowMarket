"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthMessage } from "@/lib/auth-message";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("");
  const [verified, setVerified] = useState(false);
  const [salonName, setSalonName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [sameShippingAddress, setSameShippingAddress] = useState(true);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  function checkBusiness() {
    setError("");
    setVerified(/^\d{6}-?\d{4}$/.test(org));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    let data;
    let authError: { message: string } | null = null;
    try {
      const result = await createClient().auth.signUp({
        email,
        password,
        options: { data: {
          organisation_number: org,
          salon_name: salonName,
          city,
          address,
          postal_code: postalCode,
          shipping_address: sameShippingAddress ? address : shippingAddress,
          shipping_postal_code: sameShippingAddress ? postalCode : shippingPostalCode,
          shipping_city: sameShippingAddress ? city : shippingCity,
          description,
        } },
      });
      data = result.data;
      authError = result.error;
    } catch (caughtError) {
      authError = caughtError instanceof Error ? caughtError : new Error("Unable to create account.");
    }
    if (authError) {
      setError(friendlyAuthMessage(authError, "register"));
      setSubmitting(false);
      return;
    }
    if (data?.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setAccountCreated(true);
      setSubmitting(false);
    }
  }

  if (accountCreated) {
    return <div className="auth-panel registration-success">
      <div className="success-mark">✓</div>
      <p className="kicker">ACCOUNT CREATED</p>
      <h1>Confirm your email.</h1>
      <p className="muted">We sent a confirmation link to <b>{email}</b>. Your business information was received and its verification status is <b>pending</b>. After confirming your email, sign in to create private product drafts while you wait for review.</p>
      <Link className="button button-dark full" href="/sign-in?registered=1">Continue to sign in</Link>
      <Link className="text-button success-home-link" href="/">Return to GlowMarket</Link>
    </div>;
  }

  return <div className="auth-panel">
    <div className="stepper"><span className={step >= 1 ? "active" : ""}>1</span><i/><span className={step >= 2 ? "active" : ""}>2</span><i/><span className={step >= 3 ? "active" : ""}>3</span></div>
    {step === 1 && <div><p className="kicker">STEP 1 OF 3</p><h1>Create your beauty store.</h1><p className="muted">Enter your Swedish organisation number. We will collect the application now and keep it pending until manual review or the registry provider is connected.</p><label>Organisation number<input value={org} onChange={e => { setOrg(e.target.value); setVerified(false); }} placeholder="XXXXXX-XXXX" /></label><button className="button button-dark full" type="button" onClick={checkBusiness}>Continue with organisation number</button>{verified && <div className="verified-box"><b>✓ Organisation number format accepted</b><small>This is not business verification. Your application will remain pending until GlowMarket reviews it.</small></div>}{org && !verified && <p className="form-error">Enter a valid 10-digit Swedish organisation number.</p>}{verified && <button className="text-button" onClick={() => setStep(2)}>Continue →</button>}</div>}
    {step === 2 && <form onSubmit={e => { e.preventDefault(); setStep(3); }}><p className="kicker">STEP 2 OF 3</p><h1>Store and dispatch details.</h1><p className="muted">Add your beauty store profile and the address used to dispatch products.</p><label>Store name<input required value={salonName} onChange={e => setSalonName(e.target.value)} /></label><label>Business street address<input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Street and number" /></label><div className="field-row"><label>Postal code<input required inputMode="numeric" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="111 22" /></label><label>City<input required value={city} onChange={e => setCity(e.target.value)} placeholder="Stockholm" /></label></div><label className="check"><input type="checkbox" checked={sameShippingAddress} onChange={e => setSameShippingAddress(e.target.checked)} /> Products are dispatched from this address</label>{!sameShippingAddress && <div className="shipping-address-fields"><label>Dispatch street address<input required value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} /></label><div className="field-row"><label>Dispatch postal code<input required inputMode="numeric" value={shippingPostalCode} onChange={e => setShippingPostalCode(e.target.value)} /></label><label>Dispatch city<input required value={shippingCity} onChange={e => setShippingCity(e.target.value)} /></label></div></div>}<label>Store description<textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell customers what your beauty business is known for" /></label><button className="button button-dark full">Continue</button></form>}
    {step === 3 && <form onSubmit={submit}><p className="kicker">STEP 3 OF 3</p><h1>Create your seller login.</h1><p className="muted">Use your business email to access and manage your beauty store.</p><label>Work email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.se" /></label><label>Password<input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></label><label className="check"><input type="checkbox" required /> I confirm that I’m authorised to represent this business.</label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full" disabled={submitting}>{submitting ? "Creating account…" : "Create beauty store"}</button></form>}
  </div>;
}
