"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("");
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  function checkBusiness() {
    setChecking(true); setTimeout(() => { setChecking(false); setVerified(/^\d{6}-?\d{4}$/.test(org)); }, 700);
  }
  function submit(e: FormEvent) { e.preventDefault(); router.push("/dashboard"); }
  return <div className="auth-panel"><div className="stepper"><span className={step >= 1 ? "active" : ""}>1</span><i/><span className={step >= 2 ? "active" : ""}>2</span><i/><span className={step >= 3 ? "active" : ""}>3</span></div>
    {step === 1 && <div><p className="kicker">STEP 1 OF 3</p><h1>Let’s verify your salon.</h1><p className="muted">Mane is exclusively for registered hair businesses. Enter your Swedish organisation number to begin.</p><label>Organisation number<input value={org} onChange={e => {setOrg(e.target.value); setVerified(false)}} placeholder="XXXXXX-XXXX" /></label><button className="button button-dark full" type="button" onClick={checkBusiness}>{checking ? "Checking registry…" : "Check business"}</button>{verified && <div className="verified-box"><b>✓ Format confirmed</b><span>Nordic Glow Hair AB</span><small>Demo result — official registry connection required before launch.</small></div>}{org && !verified && !checking && <p className="form-error">Enter a valid 10-digit Swedish organisation number.</p>}{verified && <button className="text-button" onClick={() => setStep(2)}>Continue →</button>}</div>}
    {step === 2 && <form onSubmit={e => {e.preventDefault(); setStep(3)}}><p className="kicker">STEP 2 OF 3</p><h1>Build your salon profile.</h1><div className="field-row"><label>Salon name<input required defaultValue="Nordic Glow Hair" /></label><label>City<input required placeholder="Stockholm" /></label></div><label>Salon address<input required placeholder="Street and number" /></label><label>Short description<textarea required placeholder="Tell customers what your salon is known for" /></label><button className="button button-dark full">Continue</button></form>}
    {step === 3 && <form onSubmit={submit}><p className="kicker">STEP 3 OF 3</p><h1>Create your admin login.</h1><label>Work email<input type="email" required placeholder="you@salon.se" /></label><label>Password<input type="password" minLength={8} required placeholder="At least 8 characters" /></label><label className="check"><input type="checkbox" required /> I confirm that I’m authorised to sell for this business.</label><button className="button button-dark full">Create salon account</button></form>}
  </div>;
}
