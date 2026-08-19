"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import type { GeneratedProduct, ProductInput } from "@/lib/ai-product";
import { BusinessVerification } from "@/components/BusinessVerification";

const emptyListing: GeneratedProduct = { title: "", brand: "", size: "", description: "", benefits: [], usage: "", tags: [], suggestedCategory: "", suitableFor: "", ingredients: "" };

export function AIProductBuilder({ onClose, onProductSaved, canUseAi = false }: { onClose: () => void; onProductSaved?: () => void; canUseAi?: boolean }) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [productHint, setProductHint] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState<ProductInput["category"]>("Hair Care");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [language, setLanguage] = useState<ProductInput["language"]>("Swedish");
  const [listing, setListing] = useState(emptyListing);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [aiUnlocked, setAiUnlocked] = useState(canUseAi);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  function readImage(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("The image could not be read."));
      reader.readAsDataURL(file);
    });
  }

  async function generate(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    if (!aiUnlocked) { setShowVerification(true); return; }
    if (!image) { setError("Upload a clear product photo first."); return; }
    if (image.size > 4_000_000) { setError("Use an image smaller than 4 MB."); return; }
    setLoading(true);
    try {
      const imageDataUrl = await readImage(image);
      const response = await fetch("/api/ai/generate-product", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl, productName, brand, size, category, productHint, price, stock, language }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "AI could not create the listing.");
      setListing(body.product);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "AI could not create the listing."); }
    finally { setLoading(false); }
  }

  async function saveDraft() {
    setError(""); setMessage("");
    if (!listing.title.trim() || !listing.description.trim()) { setError("Generate the AI listing before saving."); return; }
    setSaving(true);
    try {
      if (!image) throw new Error("The product photo is missing.");
      const imageDataUrl = await readImage(image);
      const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl, productName, brand, size, category, productHint, price, stock, language, generated: listing }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The draft could not be saved.");
      if (body.localPreview) {
        const saved = JSON.parse(localStorage.getItem("glowmarket-local-products") || "[]");
        saved.unshift({ id: crypto.randomUUID(), price, stock, generated: listing, imageName: image?.name, status: "draft", createdAt: new Date().toISOString() });
        localStorage.setItem("glowmarket-local-products", JSON.stringify(saved));
      }
      onProductSaved?.(); setMessage("AI listing saved as a draft. Review it, then publish from Products.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The draft could not be saved."); }
    finally { setSaving(false); }
  }

  return <div className="ai-builder-backdrop" onMouseDown={onClose}><section className="ai-builder ai-first-builder" onMouseDown={event => event.stopPropagation()} aria-modal="true" role="dialog" aria-labelledby="ai-builder-title"><header><div><p className="kicker">GLOWMARKET AI · INCLUDED FOR MVP</p><h2 id="ai-builder-title">Create a product listing</h2><p>Add the product facts. AI writes the professional copy, and you review it before publishing.</p></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close product builder">×</button></header>{showVerification ? <BusinessVerification onCancel={()=>setShowVerification(false)} onVerified={name=>{setAiUnlocked(true);setShowVerification(false);setMessage(`${name} is verified. You can now create the AI listing.`)}}/> : <div className="ai-builder-grid"><form className="ai-input-panel" onSubmit={generate}><h3>1. Basic product facts</h3><label>Product photo<input className="product-image-input" type="file" accept="image/jpeg,image/png,image/webp" required onChange={event => { const file = event.target.files?.[0] || null; if (imagePreview) URL.revokeObjectURL(imagePreview); setImage(file); setImagePreview(file ? URL.createObjectURL(file) : ""); setListing(emptyListing); }}/></label>{imagePreview && <div className="product-image-preview"><Image src={imagePreview} alt="Your selected product" width={110} height={110} unoptimized/><span><b>{image?.name}</b><small>This image will appear in the marketplace.</small></span></div>}<div className="field-row"><label>Product name<input required value={productName} onChange={event=>setProductName(event.target.value)}/></label><label>Brand<input required value={brand} onChange={event=>setBrand(event.target.value)}/></label></div><div className="field-row"><label>Size<input required value={size} onChange={event=>setSize(event.target.value)} placeholder="250 ml"/></label><label>Category<select value={category} onChange={event=>setCategory(event.target.value as ProductInput["category"])}>{["Hair Care","Skincare","Nails","Makeup","Hair Extensions","Beauty Tools"].map(value=><option key={value}>{value}</option>)}</select></label></div><div className="field-row"><label>Price (SEK)<input required type="number" min="1" step="0.01" value={price || ""} onChange={event => setPrice(Number(event.target.value))}/></label><label>Stock<input required type="number" min="0" value={stock} onChange={event => setStock(Number(event.target.value))}/></label></div><label>Notes for AI <span className="optional-label">Optional</span><textarea value={productHint} onChange={event => setProductHint(event.target.value)} placeholder="Only add facts you know are correct."/></label><label>Listing language<select value={language} onChange={event => setLanguage(event.target.value as ProductInput["language"])}><option>Swedish</option><option>English</option></select></label>{!aiUnlocked && <div className="ai-access-note"><b>Verification happens when you continue</b><span>Your product details are safe. We will verify the business before sending anything to AI.</span></div>}<button className="button button-dark full" disabled={loading}>{loading ? "AI is creating your listing…" : "Create listing with AI"}</button></form><section className="ai-review-panel"><h3>2. Review the AI draft</h3>{listing.title ? <><div className="ai-generated-summary"><span>AI GENERATED</span><h2>{listing.title}</h2><p>{brand} · {size}</p></div><label>Title<input value={listing.title} onChange={event=>setListing({...listing,title:event.target.value})}/></label><label>Description<textarea value={listing.description} onChange={event => setListing({ ...listing, description: event.target.value })}/></label><label>Benefits<textarea value={listing.benefits.join("\n")} onChange={event => setListing({ ...listing, benefits: event.target.value.split("\n").filter(Boolean) })}/></label><label>How to use<textarea value={listing.usage} onChange={event=>setListing({...listing,usage:event.target.value})}/></label><label>Search tags<input value={listing.tags.join(", ")} onChange={event=>setListing({...listing,tags:event.target.value.split(",").map(tag=>tag.trim()).filter(Boolean)})}/></label><label>Suggested category<input value={listing.suggestedCategory} onChange={event => setListing({ ...listing, suggestedCategory: event.target.value })}/></label><button type="button" className="button button-dark full" disabled={saving} onClick={saveDraft}>{saving ? "Saving…" : "Approve and save draft"}</button></> : <div className="ai-empty"><b>Your AI listing will appear here</b><span>Add the product facts and select “Create listing with AI.”</span></div>}{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="ai-success" role="status">{message}</p>}</section></div>}</section></div>;
}
