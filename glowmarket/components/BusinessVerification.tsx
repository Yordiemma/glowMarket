"use client";

import { FormEvent, useState } from "react";

export function BusinessVerification({ onVerified, onCancel }: { onVerified: (name: string) => void; onCancel?: () => void }) {
  const [organisationNumber, setOrganisationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    const response = await fetch("/api/business/verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ organisationNumber }) });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.verified) { setError(body?.error || "The business could not be verified."); setLoading(false); return; }
    onVerified(body.business?.name || "Business verified");
  }

  return <section className="verification-gate" aria-labelledby="verification-title">
    <p className="kicker">ONE-TIME BUSINESS CHECK</p><h2 id="verification-title">Verify before going live.</h2>
    <p>Your store is saved. To use AI or publish products, enter an organisation number included in Bolagsverket&apos;s Accept2 test environment.</p>
    <form onSubmit={submit}><label>Swedish organisation number<input required inputMode="numeric" autoComplete="off" value={organisationNumber} onChange={event => setOrganisationNumber(event.target.value)} placeholder="XXXXXX-XXXX" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-dark full" disabled={loading}>{loading ? "Checking test business…" : "Verify test business"}</button>
      {onCancel && <button className="text-button" type="button" onClick={onCancel}>Not now</button>}
    </form><small>This MVP uses test company data, never the live company register.</small>
  </section>;
}
