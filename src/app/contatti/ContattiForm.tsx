"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors bg-white";

export default function ContattiForm() {
  const [form, setForm] = useState({ nome: "", azienda: "", email: "", telefono: "", messaggio: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setFallback(false);
    try {
      const res = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setFallback(Boolean(json.fallback));
        setError(json.error || "Qualcosa è andato storto. Riprova.");
      }
    } catch {
      setStatus("error");
      setFallback(true);
      setError("Non siamo riusciti a inviare il messaggio.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12 px-6 bg-orange-50 rounded-2xl border border-orange-200">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle size={26} className="text-orange-500" />
        </div>
        <h3 className="font-display font-bold text-navy text-xl mb-2">Messaggio ricevuto!</h3>
        <p className="text-navy-500 text-sm">Ti ricontattiamo entro 24 ore.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-navy mb-1.5">
            Nome e Cognome <span className="text-orange-500">*</span>
          </label>
          <input id="nome" type="text" required placeholder="Mario Rossi" value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="azienda" className="block text-sm font-medium text-navy mb-1.5">Azienda</label>
          <input id="azienda" type="text" placeholder="Impresa Rossi Costruzioni" value={form.azienda}
            onChange={(e) => setForm((f) => ({ ...f, azienda: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
            Email <span className="text-orange-500">*</span>
          </label>
          <input id="email" type="email" required placeholder="tua@email.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-navy mb-1.5">Telefono</label>
          <input id="telefono" type="tel" placeholder="+39 333 000 0000" value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-navy mb-1.5">
          Messaggio <span className="text-orange-500">*</span>
        </label>
        <textarea id="messaggio" rows={4} required
          placeholder="Descrivici brevemente come lavori e cosa stai cercando..."
          value={form.messaggio}
          onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
          className={`${inputClass} resize-none`} />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
          {fallback && (
            <>
              {" "}Scrivici a{" "}
              <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline font-medium">
                info@cantierihub.com
              </a>.
            </>
          )}
        </p>
      )}

      <button type="submit" disabled={status === "loading"}
        className="cta-shimmer w-full py-3.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
        {status === "loading" ? "Invio in corso…" : (<>Invia messaggio <ArrowRight size={16} className="arrow" /></>)}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Inviando accetti la nostra{" "}
        <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
