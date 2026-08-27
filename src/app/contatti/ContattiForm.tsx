"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { descriviProvenienza, valoriProvenienza } from "@/lib/provenienza";
import CampiProvenienza from "@/components/ui/CampiProvenienza";
import { PRODOTTI, MOTIVAZIONI, CANALI, type Prodotto } from "@/data/moduloLead";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors bg-white";

export default function ContattiForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "", cognome: "", azienda: "", email: "", telefono: "",
    prodotto: "", motivazione: "", canale: "", messaggio: "",
  });
  const [hp, setHp] = useState(""); // honeypot anti-spam
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
        body: JSON.stringify({ ...form, company_url: hp, provenienza: descriviProvenienza(), utm: valoriProvenienza() }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        router.push("/grazie");
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

  return (
    <form id="sito-contatti" name="sito-contatti" onSubmit={handleSubmit} className="space-y-4">
      {/* honeypot: invisibile agli umani, compilato dai bot */}
      <input
        type="text"
        name="company_url"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {/* Da dove arriva chi scrive: tre campi che il CRM legge da solo. Vedi il componente. */}
      <CampiProvenienza />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-navy mb-1.5">
            Nome <span className="text-orange-500">*</span>
          </label>
          <input id="nome" name="first_name" type="text" required placeholder="Mario" value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cognome" className="block text-sm font-medium text-navy mb-1.5">
            Cognome <span className="text-orange-500">*</span>
          </label>
          <input id="cognome" name="last_name" type="text" required placeholder="Rossi" value={form.cognome}
            onChange={(e) => setForm((f) => ({ ...f, cognome: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="azienda" className="block text-sm font-medium text-navy mb-1.5">Azienda</label>
          <input id="azienda" name="company_name" type="text" placeholder="Impresa Rossi Costruzioni" value={form.azienda}
            onChange={(e) => setForm((f) => ({ ...f, azienda: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
            Email <span className="text-orange-500">*</span>
          </label>
          <input id="email" name="email" type="email" required placeholder="tua@email.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-navy mb-1.5">
            Telefono <span className="text-orange-500">*</span>
          </label>
          <input id="telefono" name="phone" type="tel" required placeholder="+39 333 000 0000" value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="prodotto" className="block text-sm font-medium text-navy mb-1.5">
          Per quale servizio stai chiedendo informazioni? <span className="text-orange-500">*</span>
        </label>
        {/* Scelta singola e non testo libero: il valore smista il lead nel CRM, quindi deve
            combaciare esattamente. Si mostra `etichetta` (con la descrizione) ma si invia
            `valore`, corto: è quello che finisce nel nome del cartellino in Salesflow. */}
        <select id="prodotto" name="prodotto" required
          value={form.prodotto}
          onChange={(e) =>
            // Cambiando prodotto la motivazione precedente non c'entra più: si azzera,
            // altrimenti al setter arriva un abbinamento che non sta in piedi.
            setForm((f) => ({ ...f, prodotto: e.target.value, motivazione: "" }))
          }
          className={inputClass}>
          <option value="">Scegli&hellip;</option>
          {PRODOTTI.map((p) => (
            <option key={p.valore} value={p.valore}>{p.etichetta}</option>
          ))}
        </select>
      </div>

      {/* Compare solo dopo la scelta del prodotto, con le sue motivazioni: il modulo resta
          corto e la domanda arriva quando ha senso. Se per quel prodotto non ci sono motivazioni
          («Altro») la domanda si salta: è obbligatoria, e senza opzioni bloccherebbe l'invio. */}
      {form.prodotto && (MOTIVAZIONI[form.prodotto as Prodotto] ?? []).length > 0 && (
        <div>
          <label htmlFor="motivazione" className="block text-sm font-medium text-navy mb-1.5">
            Cosa ti serve risolvere? <span className="text-orange-500">*</span>
          </label>
          <select id="motivazione" name="esigenza" required
            value={form.motivazione}
            onChange={(e) => setForm((f) => ({ ...f, motivazione: e.target.value }))}
            className={inputClass}>
            <option value="">Scegli&hellip;</option>
            {(MOTIVAZIONI[form.prodotto as Prodotto] ?? []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="canale" className="block text-sm font-medium text-navy mb-1.5">
          Come ci hai conosciuti? <span className="text-orange-500">*</span>
        </label>
        {/* Vale più di tutto il tracciamento tecnico messo insieme: è l'unico modo di sapere
            di chi ha visto un reel e ci ha cercato su Google tre giorni dopo. */}
        <select id="canale" name="come_ci_ha_conosciuti" required
          value={form.canale}
          onChange={(e) => setForm((f) => ({ ...f, canale: e.target.value }))}
          className={inputClass}>
          <option value="">Scegli&hellip;</option>
          {CANALI.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-navy mb-1.5">
          Messaggio <span className="text-orange-500">*</span>
        </label>
        <textarea id="messaggio" name="messaggio" rows={4} required
          placeholder="Indicaci quanti computi o preventivi fai mensilmente, e se sei il titolare dell'azienda, un progettista o un collaboratore..."
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
