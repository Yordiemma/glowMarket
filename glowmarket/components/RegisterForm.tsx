"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("");
  const [verified, setVerified] = useState(false);
  const [salonName, setSalonName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function checkBusiness() {
    setError("");
    setVerified(/^\d{6}-?\d{4}$/.test(org));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: {
        organisation_number: org,
        salon_name: salonName,
        city,
        address,
        description,
      } },
    });
    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Account created. Confirm your email, then sign in.");
      setSubmitting(false);
    }
  }

  return <div className="auth-panel">
    <div className="stepper"><span className={step >= 1 ? "active" : ""}>1</span><i/><span className={step >= 2 ? "active" : ""}>2</span><i/><span className={step >= 3 ? "active" : ""}>3</span></div>
    {step === 1 && <div><p className="kicker">STEP 1 OF 3</p><h1>Let’s verify your salon.</h1><p className="muted">GlowMarket is exclusively for registered hair businesses. Enter your Swedish organisation number to begin.</p><label>Organisation number<input value={org} onChange={e => { setOrg(e.target.value); setVerified(false); }} placeholder="XXXXXX-XXXX" /></label><button className="button button-dark full" type="button" onClick={checkBusiness}>Continue with organisation number</button>{verified && <div className="verified-box"><b>✓ Valid format</b><small>Bolagsverket verification begins after account creation.</small></div>}{org && !verified && <p className="form-error">Enter a valid 10-digit Swedish organisation number.</p>}{verified && <button className="text-button" onClick={() => setStep(2)}>Continue →</button>}</div>}
    {step === 2 && <form onSubmit={e => { e.preventDefault(); setStep(3); }}><p className="kicker">STEP 2 OF 3</p><h1>Build your salon profile.</h1><div className="field-row"><label>Salon name<input required value={salonName} onChange={e => setSalonName(e.target.value)} /></label><label>City<input required value={city} onChange={e => setCity(e.target.value)} placeholder="Stockholm" /></label></div><label>Salon address<input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Street and number" /></label><label>Short description<textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell customers what your salon is known for" /></label><button className="button button-dark full">Continue</button></form>}
    {step === 3 && <form onSubmit={submit}><p className="kicker">STEP 3 OF 3</p><h1>Create your admin login.</h1><p className="muted">Next: Bolagsverket, BankID, and signatory verification.</p><label>Work email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@salon.se" /></label><label>Password<input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></label><label className="check"><input type="checkbox" required /> I confirm that I’m authorised to represent this business.</label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full" disabled={submitting}>{submitting ? "Creating account…" : "Create salon account"}</button></form>}
  </div>;
}
