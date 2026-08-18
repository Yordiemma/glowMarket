"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import type { GeneratedProduct, ProductInput } from "@/lib/ai-product";

const emptyInput: ProductInput = {
  productName: "", brand: "", category: "", price: 0, stock: 0, size: "",
  suitableFor: "", ingredients: "", notes: "", language: "Swedish",
};

export function AIProductBuilder({ onClose, onLocalProductSaved }: { onClose: () => void; onLocalProductSaved?: () => void }) {
  const [input, setInput] = useState<ProductInput>(emptyInput);
  const [generated, setGenerated] = useState<GeneratedProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setInput(current => ({ ...current, [key]: value }));
  }

  async function generate(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage(""); setLoading(true);
    if (!image) { setError("Add a clear product image before generating the listing."); setLoading(false); return; }
    try {
      const response = await fetch("/api/ai/generate-product", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Generation failed.");
      setGenerated(body.product);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Generation failed.");
    } finally { setLoading(false); }
  }

  async function saveDraft() {
    if (!generated) return;
    setError(""); setMessage(""); setSaving(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, generated }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Save failed.");
      if (body.localPreview) {
        const saved = JSON.parse(localStorage.getItem("glowmarket-local-products") || "[]");
        saved.unshift({ id: crypto.randomUUID(), ...input, generated, imageName: image?.name, status: "draft", createdAt: new Date().toISOString() });
        localStorage.setItem("glowmarket-local-products", JSON.stringify(saved));
        onLocalProductSaved?.();
        setMessage("Draft saved in this browser for local testing. It has not been published.");
      } else setMessage("Draft saved. It has not been published.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The draft could not be saved.");
    } finally { setSaving(false); }
  }

  return <div className="ai-builder-backdrop" onMouseDown={onClose}>
    <section className="ai-builder" onMouseDown={event => event.stopPropagation()}>
      <header><div><p className="kicker">AI PRODUCT BUILDER</p><h2>Create a product draft</h2><p>Enter verified product facts. AI prepares editable copy; nothing is published automatically.</p></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button></header>
      <div className="ai-builder-grid">
        <form className="ai-input-panel" onSubmit={generate}>
          <h3>Product facts</h3>
          <div className="field-row"><label>Product name<input required value={input.productName} onChange={e => update("productName", e.target.value)}/></label><label>Brand<input required value={input.brand} onChange={e => update("brand", e.target.value)}/></label></div>
          <div className="field-row"><label>Category<select required value={input.category} onChange={e => update("category", e.target.value)}><option value="">Select category</option><option>Hair Care</option><option>Skin Care</option><option>Nails</option><option>Makeup</option><option>Human Hair & Extensions</option><option>Wigs</option><option>Hair Tools</option><option>Beauty Tools</option><option>Professional Beauty Products</option></select></label><label>{input.category === "Human Hair & Extensions" || input.category === "Wigs" ? "Length / size" : "Size"}<input required value={input.size} onChange={e => update("size", e.target.value)} placeholder={input.category === "Human Hair & Extensions" || input.category === "Wigs" ? "e.g. 20 inches" : "e.g. 250 ml"}/></label></div>
          <div className="field-row"><label>Price (SEK)<input required type="number" min="1" step="0.01" value={input.price || ""} onChange={e => update("price", Number(e.target.value))}/></label><label>Stock<input required type="number" min="0" value={input.stock} onChange={e => update("stock", Number(e.target.value))}/></label></div>
          <label>Hair or skin type<input value={input.suitableFor} onChange={e => update("suitableFor", e.target.value)} placeholder="Only include confirmed suitability"/></label>
          <label>Ingredients<textarea value={input.ingredients} onChange={e => update("ingredients", e.target.value)} placeholder="Copy from the product label; leave blank if unknown"/></label>
          <label>Product notes<textarea value={input.notes} onChange={e => update("notes", e.target.value)} placeholder="Confirmed usage and product facts"/></label>
          <label>Product image<input className="product-image-input" type="file" accept="image/jpeg,image/png,image/webp" required={!image} onChange={event => { const file=event.target.files?.[0]||null; setImage(file); setImagePreview(file?URL.createObjectURL(file):""); }}/></label>
          {imagePreview && <div className="product-image-preview"><Image src={imagePreview} alt="Product upload preview" width={82} height={82} unoptimized/><span><b>{image?.name}</b><small>Image selected for this product draft</small></span></div>}
          <label>Listing language<select value={input.language} onChange={e => update("language", e.target.value as ProductInput["language"])}><option>Swedish</option><option>English</option></select></label>
          <button className="button button-dark full" disabled={loading}>{loading ? "Preparing draft…" : "Generate with AI"}</button>
        </form>
        <div className="ai-review-panel">
          <h3>Seller review</h3>
          {!generated && <div className="ai-empty"><b>Your editable draft will appear here.</b><span>Review every field before saving.</span></div>}
          {generated && <>
            <label>Title<input value={generated.title} onChange={e => setGenerated({...generated,title:e.target.value})}/></label>
            <label>Description<textarea value={generated.description} onChange={e => setGenerated({...generated,description:e.target.value})}/></label>
            <label>Benefits<textarea value={generated.benefits.join("\n")} onChange={e => setGenerated({...generated,benefits:e.target.value.split("\n").filter(Boolean)})}/></label>
            <label>How to use<textarea value={generated.usage} onChange={e => setGenerated({...generated,usage:e.target.value})}/></label>
            <label>Tags<input value={generated.tags.join(", ")} onChange={e => setGenerated({...generated,tags:e.target.value.split(",").map(tag=>tag.trim()).filter(Boolean)})}/></label>
            <label>Suggested category<input value={generated.suggestedCategory} onChange={e => setGenerated({...generated,suggestedCategory:e.target.value})}/></label>
            <button type="button" className="button button-dark full" disabled={saving} onClick={saveDraft}>{saving ? "Saving draft…" : "Accept and save draft"}</button>
          </>}
          {error && <p className="form-error sign-in-error" role="alert">{error}</p>}
          {message && <p className="ai-success" role="status">{message}</p>}
        </div>
      </div>
    </section>
  </div>;
}
