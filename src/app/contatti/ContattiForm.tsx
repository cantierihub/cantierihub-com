"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { descriviProvenienza, valoriProvenienza } from "@/lib/provenienza";
import { messaggioCandidatura, NOME_CAMPO_NOTA } from "@/lib/funnel";
import CampiProvenienza from "@/components/ui/CampiProvenienza";
import { useArticoloDiProvenienza } from "@/components/notizie/TornaAllArticolo";
import { PRODOTTI, PRODOTTI_DEMO, MOTIVAZIONI, CANALI, RUOLI, type Prodotto } from "@/data/moduloLead";

// text-base sul telefono: sotto i 16 px Safari su iPhone ingrandisce la pagina a ogni tocco su un campo.
// Bordo navy-500 (4,8:1) e non grigio chiaro: al sole un campo bianco con il bordo pallido sparisce (revisione 03/10).
// `invalid:text-navy-500` fa grigio «Scegli…» nei menu obbligatori ancora vuoti, così non sembra un valore scelto.
const inputClass =
  "w-full px-4 py-3 rounded-lg border border-navy-500 text-base md:text-sm text-navy placeholder:text-navy-500 invalid:text-navy-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors bg-white";
const labelClass = "block text-sm font-medium text-navy mb-1.5";
const Obbligatorio = () => <span className="text-orange-700" aria-hidden="true">*</span>;
const NASCOSTO: React.CSSProperties = { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 };

/**
 * Il modulo che porta un lead nel CRM. Due modi:
 * - la pagina **contatti** (senza props): la persona sceglie il servizio e scrive il messaggio;
 * - **la candidatura alla demo** delle Notizie (`modoDemo`, 03/10/2026): il prodotto è già scelto dalla pagina
 *   (`prodottoFisso`) o si sceglie fra i tre strumenti, si chiede il ruolo, il messaggio è facoltativo, e lo slug
 *   dell'articolo da cui arriva (`?da=` nell'indirizzo) va al server, che mette l'etichetta «notizie» (`lib/funnel.ts`).
 */
export default function ContattiForm({
  prodottoFisso = null,
  modoDemo = false,
  testoPulsante = "Invia messaggio",
}: {
  prodottoFisso?: Prodotto | null;
  modoDemo?: boolean;
  testoPulsante?: string;
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "", cognome: "", azienda: "", email: "", telefono: "",
    prodotto: prodottoFisso ?? "", motivazione: "", canale: "", messaggio: "", ruolo: "",
  });
  // L'articolo si legge dall'indirizzo nel browser: la pagina resta statica (niente useSearchParams). Il server lo
  // ricontrolla comunque (`lib/funnel.ts`).
  const daIndirizzo = useArticoloDiProvenienza();
  const articolo = modoDemo ? daIndirizzo : "";
  const [hp, setHp] = useState(""); // honeypot anti-spam
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);

  // Nella candidatura il messaggio è facoltativo, tranne con «Non lo so ancora»: senza, al setter arriverebbe solo «Altro».
  const messaggioObbligatorio = !modoDemo || form.prodotto === "Altro";
  const prodotti = modoDemo ? PRODOTTI_DEMO : PRODOTTI;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Lo stesso orario che legge lo script di tracciamento: vedi `lib/salesflow.ts`.
    const campoInvio = e.currentTarget.elements.namedItem("form_inviato_il");
    const inviatoIl = campoInvio instanceof HTMLInputElement ? campoInvio.value : "";
    setStatus("loading");
    setError("");
    setFallback(false);
    try {
      // Nella candidatura il ruolo apre il messaggio (nel CRM non c'è un campo apposta, e al setter serve). La riga
      // dell'articolo la aggiunge il server.
      const { ruolo, ...campi } = form;
      const messaggio = modoDemo ? messaggioCandidatura(ruolo, form.messaggio, "") : form.messaggio;
      const res = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...campi, messaggio, articolo,
          company_url: hp, provenienza: descriviProvenienza(), utm: valoriProvenienza(), inviato_il: inviatoIl,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        router.push(articolo ? `/grazie?da=${encodeURIComponent(articolo)}` : "/grazie");
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
        style={NASCOSTO}
      />

      {/* Da dove arriva chi scrive: tre campi che il CRM legge da solo. Vedi il componente. */}
      <CampiProvenienza />

      {modoDemo && (
        // Per lo script di Salesflow, che legge i moduli dal nome dei campi: se il server non riesce a scrivere nel CRM
        // e la persona ha accettato i cookie, il contatto lo crea lo script, e così ha lo stesso messaggio del server.
        <input type="text" name="messaggio" readOnly tabIndex={-1} aria-hidden="true" style={NASCOSTO}
          value={messaggioCandidatura(form.ruolo, form.messaggio, articolo)} />
      )}

      {/* Nome e cognome affiancati anche sul telefono: il modulo resta più corto. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="nome" className={labelClass}>Nome <Obbligatorio /></label>
          <input id="nome" name="first_name" type="text" required autoComplete="given-name" placeholder="Mario" value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cognome" className={labelClass}>Cognome <Obbligatorio /></label>
          <input id="cognome" name="last_name" type="text" required autoComplete="family-name" placeholder="Rossi" value={form.cognome}
            onChange={(e) => setForm((f) => ({ ...f, cognome: e.target.value }))} className={inputClass} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>Email <Obbligatorio /></label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="tua@email.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="telefono" className={labelClass}>Telefono <Obbligatorio /></label>
          <input id="telefono" name="phone" type="tel" required autoComplete="tel" placeholder="+39 333 000 0000" value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="azienda" className={labelClass}>Azienda</label>
        <input id="azienda" name="company_name" type="text" autoComplete="organization" placeholder="Rossi Costruzioni" value={form.azienda}
          onChange={(e) => setForm((f) => ({ ...f, azienda: e.target.value }))} className={inputClass} />
      </div>

      {prodottoFisso ? (
        // Il prodotto lo sceglie la pagina. Resta un campo vero (nascosto col CSS, come quelli della provenienza),
        // così lo script di Salesflow, che legge i moduli dal nome dei campi, lo vede come sempre.
        <input type="text" name="prodotto" value={prodottoFisso} readOnly tabIndex={-1} aria-hidden="true" style={NASCOSTO} />
      ) : (
        <div>
          <label htmlFor="prodotto" className={labelClass}>
            {modoDemo ? "Quale strumento vuoi vedere nella demo?" : "Per quale servizio stai chiedendo informazioni?"} <Obbligatorio />
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
            {prodotti.map((p) => (
              <option key={p.valore} value={p.valore}>{p.etichetta}</option>
            ))}
          </select>
        </div>
      )}

      {modoDemo && (
        <div>
          <label htmlFor="ruolo" className={labelClass}>Che ruolo hai? <Obbligatorio /></label>
          {/* name="ruolo": nessun campo del CRM si chiama così, quindi lo script di Salesflow non lo tocca.
              Il ruolo arriva al CRM dentro il messaggio, composto dal modulo. */}
          <select id="ruolo" name="ruolo" required value={form.ruolo}
            onChange={(e) => setForm((f) => ({ ...f, ruolo: e.target.value }))}
            className={inputClass}>
            <option value="">Scegli&hellip;</option>
            {RUOLI.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      {/* Compare solo dopo la scelta del prodotto, con le sue motivazioni: il modulo resta
          corto e la domanda arriva quando ha senso. Se per quel prodotto non ci sono motivazioni
          («Altro») la domanda si salta: è obbligatoria, e senza opzioni bloccherebbe l'invio. */}
      {form.prodotto && (MOTIVAZIONI[form.prodotto as Prodotto] ?? []).length > 0 && (
        <div>
          <label htmlFor="motivazione" className={labelClass}>Cosa ti serve risolvere? <Obbligatorio /></label>
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
        <label htmlFor="canale" className={labelClass}>
          Come ci hai conosciuti?{" "}
          {modoDemo ? <span className="font-normal text-navy-600">(facoltativo)</span> : <Obbligatorio />}
        </label>
        {/* Vale più di tutto il tracciamento tecnico messo insieme: è l'unico modo di sapere
            di chi ha visto un reel e ci ha cercato su Google tre giorni dopo. Nella candidatura è facoltativa: che
            arrivi da un articolo lo sa già il server (`?da=`). */}
        <select id="canale" name="come_ci_ha_conosciuti" required={!modoDemo}
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
        <label htmlFor="messaggio" className={labelClass}>
          {modoDemo ? (
            messaggioObbligatorio
              ? <>Dicci cosa ti serve <Obbligatorio /></>
              : <>Vuoi dirci qualcosa? <span className="font-normal text-navy-600">(facoltativo)</span></>
          ) : (
            <>Messaggio <Obbligatorio /></>
          )}
        </label>
        {/* Nella candidatura il campo si chiama «nota», non «messaggio»: il messaggio del CRM lo compone il modulo
            (ruolo + nota) e il server ci aggiunge l'articolo. Vedi `NOME_CAMPO_NOTA`. */}
        <textarea id="messaggio" name={modoDemo ? NOME_CAMPO_NOTA : "messaggio"} rows={modoDemo ? 3 : 4} required={messaggioObbligatorio}
          placeholder={modoDemo
            ? "Per esempio: quanti preventivi o computi fai al mese, su che lavori."
            : "Indicaci quanti computi o preventivi fai mensilmente, e se sei il titolare dell'azienda, un progettista o un collaboratore..."}
          value={form.messaggio}
          onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
          className={`${inputClass} resize-none`} />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
          {fallback && (
            <>
              {" "}Scrivici a{" "}
              <a href="mailto:info@cantierihub.com" className="font-medium text-orange-700 underline underline-offset-2">
                info@cantierihub.com
              </a>.
            </>
          )}
        </p>
      )}

      {modoDemo ? (
        <button type="submit" disabled={status === "loading"} className="btn-funnel w-full">
          {status === "loading" ? "Invio in corso…" : (<>{testoPulsante} <ArrowRight size={16} className="arrow" aria-hidden="true" /></>)}
        </button>
      ) : (
        <button type="submit" disabled={status === "loading"}
          className="cta-shimmer w-full py-3.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
          {status === "loading" ? "Invio in corso…" : (<>{testoPulsante} <ArrowRight size={16} className="arrow" /></>)}
        </button>
      )}

      <p className="text-sm text-navy-600 text-center">
        Inviando accetti la nostra{" "}
        <a href="/privacy" className="text-orange-700 underline underline-offset-2">Privacy Policy</a>.
      </p>
    </form>
  );
}
