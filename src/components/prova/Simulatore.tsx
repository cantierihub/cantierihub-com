"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Loader2, Lock } from "lucide-react";
import {
  COMMITTENTI,
  FORNITURE,
  MAX_ANALISI,
  REGIONI,
  TIPI_LAVORO,
  UNITA,
  VOCE_MAX,
  VOCE_MIN,
  VOCI_ESEMPIO,
  euro,
  leggiPrezzo,
  scartoPercento,
  type AnalisiMostrata,
  type Angolo,
} from "@/lib/prova/analisi";
import RigaMercato from "./RigaMercato";

/**
 * Il simulatore dell'Analisi Prezzi (07/10/2026). Parla con /api/prova/analisi, che chiama la funzione vera del
 * Preventivatore; qui c'è solo la pagina. Il conto delle 2 analisi lo tiene il server: il browser lo mostra e basta.
 *
 * Il contatto del CRM arriva nel link di WhatsApp (`?c=`) e si rimanda al server così com'è.
 * Le analisi fatte restano nel telefono (localStorage), così una pagina ricaricata non le perde.
 */

type Campi = {
  voce: string;
  unita: string;
  regione: string;
  tipoLavoro: string;
  fornitura: string;
  committente: string;
  prezzoTuo: string;
};

type Prova = {
  n: number;
  campi: Campi;
  analisi: AnalisiMostrata;
  approfondibile: boolean;
  prima?: number;
};

const CAMPI_INIZIALI: Campi = {
  voce: "",
  unita: "m²",
  regione: "",
  tipoLavoro: "ristrutturazione_leggera",
  fornitura: "fornitura_posa",
  committente: "privato",
  prezzoTuo: "",
};

/** Quello che l'analisi fa davvero, nell'ordine del prompt del prodotto: si racconta il lavoro mentre si aspetta. */
const PASSAGGI = [
  "Lettura della voce",
  "Materiali, quantità e sfridi",
  "Ore di manodopera per la regione",
  "Noli e attrezzature",
  "Spese generali e utile",
  "Prezzi di mercato della regione",
];

// ── Le analisi fatte, conservate nel telefono ──
// Un archivio piccolo: in memoria e, se si può, in localStorage (in navigazione privata resta solo in memoria).
// Si legge con useSyncExternalStore, come `?da=` in TornaAllArticolo: la pagina resta statica e non c'è setState negli effetti.
const chiaveArchivio = (angolo: Angolo) => `ch-prova-analisi-${angolo}`;
const memoria: Record<string, string> = {};
const ascoltatori = new Set<() => void>();

function iscriviti(avvisa: () => void) {
  ascoltatori.add(avvisa);
  return () => ascoltatori.delete(avvisa);
}

function grezzo(angolo: Angolo): string {
  const k = chiaveArchivio(angolo);
  if (memoria[k] !== undefined) return memoria[k];
  try {
    return (memoria[k] = localStorage.getItem(k) ?? "[]");
  } catch {
    return (memoria[k] = "[]");
  }
}

function salva(angolo: Angolo, prove: Prova[]) {
  const k = chiaveArchivio(angolo);
  memoria[k] = JSON.stringify(prove.slice(0, MAX_ANALISI));
  try {
    localStorage.setItem(k, memoria[k]);
  } catch {
    /* navigazione privata o memoria piena: le analisi restano solo in questa pagina */
  }
  ascoltatori.forEach((a) => a());
}

function leggiProve(testo: string): Prova[] {
  try {
    const v = JSON.parse(testo);
    return Array.isArray(v) ? v.filter((p) => p && p.analisi && typeof p.analisi.prezzo === "number") : [];
  } catch {
    return [];
  }
}

/** Il contatto del CRM dal link di WhatsApp (`?c=`). Sul server non c'è. */
function useContatto(): string | null {
  return useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("c"),
    () => null,
  );
}

export default function Simulatore({
  angolo,
  prezzoTuoInVista,
  etichettaPrezzoTuo,
  aiutoPrezzoTuo,
  whatsapp,
}: {
  angolo: Angolo;
  prezzoTuoInVista: boolean;
  etichettaPrezzoTuo: string;
  aiutoPrezzoTuo: string;
  whatsapp: string;
}) {
  const [campi, setCampi] = useState<Campi>(CAMPI_INIZIALI);
  const [rimaste, setRimaste] = useState<number>(MAX_ANALISI);
  const [disponibile, setDisponibile] = useState(true);
  const [esempio, setEsempio] = useState(false);
  const contatto = useContatto();
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const archivio = useSyncExternalStore(iscriviti, () => grezzo(angolo), () => "[]");
  const prove = useMemo(() => leggiProve(archivio), [archivio]);
  const risultato = useRef<HTMLHeadingElement>(null);
  const id = useId();

  // Quante prove restano lo sa il server (cookie ed etichette del contatto).
  useEffect(() => {
    fetch(`/api/prova/analisi${contatto ? `?c=${encodeURIComponent(contatto)}` : ""}`)
      .then((r) => r.json())
      .then((d: { rimaste?: number; disponibile?: boolean; esempio?: boolean }) => {
        if (typeof d.rimaste === "number") setRimaste(d.rimaste);
        if (d.disponibile === false) setDisponibile(false);
        if (d.esempio) setEsempio(true);
      })
      .catch(() => {});
  }, [contatto]);

  const aggiorna = <K extends keyof Campi>(k: K, v: Campi[K]) => setCampi((c) => ({ ...c, [k]: v }));

  async function analizza(e: FormEvent) {
    e.preventDefault();
    setErrore(null);
    const voce = campi.voce.trim();
    if (voce.length < VOCE_MIN) return setErrore("Descrivi la lavorazione con qualche parola in più.");
    if (!campi.regione) return setErrore("Scegli la regione del cantiere.");
    if (campi.prezzoTuo && leggiPrezzo(campi.prezzoTuo) === null) return setErrore("Il tuo prezzo non sembra un numero: scrivilo come 45 o 45,50.");

    setInCorso(true);
    try {
      const r = await fetch("/api/prova/analisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fase: "analisi", angolo, contatto, richiesta: { ...campi, voce } }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        if (typeof d.rimaste === "number") setRimaste(d.rimaste);
        if (d.motivo === "non-configurata" || d.motivo === "esaurita") setDisponibile(false);
        setErrore(d.messaggio ?? "L'analisi non è arrivata. Riprova: questa non è stata contata.");
        return;
      }
      const nuove = [{ n: MAX_ANALISI - d.rimaste, campi: { ...campi, voce }, analisi: d.analisi, approfondibile: !!d.approfondibile }, ...prove];
      salva(angolo, nuove);
      setRimaste(d.rimaste);
      requestAnimationFrame(() => {
        risultato.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        risultato.current?.focus({ preventScroll: true });
      });
    } catch {
      setErrore("Connessione assente o lenta. Riprova: questa analisi non è stata contata.");
    } finally {
      setInCorso(false);
    }
  }

  function approfondita(indice: number, analisi: AnalisiMostrata) {
    salva(angolo, prove.map((p, i) => (i === indice ? { ...p, prima: p.analisi.prezzo, analisi, approfondibile: false } : p)));
  }

  const finite = rimaste <= 0;

  return (
    <div>
      <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-[0_24px_60px_rgba(2,6,23,0.12)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-navy md:text-2xl">Scegli una voce o scrivi la tua</h2>
          <p className="rounded-full bg-navy-50 px-3 py-1 text-[14px] font-semibold text-navy-700" aria-live="polite">
            Analisi gratuite: <span className="tabular-nums">{rimaste}</span> su {MAX_ANALISI}
          </p>
        </div>

        {esempio && (
          <p className="mt-4 rounded-xl border-2 border-dashed border-orange-500 bg-orange-50 px-4 py-3 text-[15px] leading-relaxed text-navy">
            <strong>Anteprima.</strong>{" "}Il risultato è sempre lo stesso esempio (un pozzetto in Lombardia), qualunque voce si
            scriva: la prova vera parte quando l&apos;account demo è collegato.
          </p>
        )}

        {!disponibile ? (
          <Avviso titolo="La prova è ferma in questo momento" whatsapp={whatsapp}>
            Scrivici su WhatsApp: l&apos;analisi te la facciamo vedere noi, su una voce tua.
          </Avviso>
        ) : finite ? (
          <Avviso titolo="Le 2 analisi gratuite sono state usate" whatsapp={whatsapp}>
            Le altre voci le vediamo insieme in chiamata, sul tuo computo. Tieni a portata di mano un computo vero, in PDF o Excel.
          </Avviso>
        ) : (
          <form onSubmit={analizza} className="mt-5" noValidate>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Voci di esempio">
              {VOCI_ESEMPIO.map((v) => {
                const scelta = campi.voce === v.voce;
                return (
                  <button
                    key={v.titolo}
                    type="button"
                    aria-pressed={scelta}
                    onClick={() => setCampi((c) => ({ ...c, voce: v.voce, unita: v.unita }))}
                    className={`min-h-11 rounded-full border px-4 text-[15px] font-medium transition-colors ${
                      scelta ? "border-orange-500 bg-orange-50 text-navy" : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                    }`}
                  >
                    {v.titolo}
                  </button>
                );
              })}
            </div>

            <label htmlFor={`${id}-voce`} className="mt-5 block font-display text-[15px] font-semibold text-navy">
              La lavorazione, come la scriveresti nel computo
            </label>
            <textarea
              id={`${id}-voce`}
              value={campi.voce}
              onChange={(e) => aggiorna("voce", e.target.value)}
              maxLength={VOCE_MAX}
              rows={3}
              placeholder="Es. Rifacimento intonaco civile su pareti interne, compresa la rimozione del vecchio"
              className="mt-2 w-full rounded-xl border border-navy-300 bg-white px-4 py-3 text-[17px] leading-relaxed text-navy placeholder:text-navy-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            />

            <div className={`mt-4 grid gap-4 ${prezzoTuoInVista ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              <Scelta etichetta="Unità di misura" valore={campi.unita} onCambia={(v) => aggiorna("unita", v)} opzioni={UNITA.map((u) => ({ valore: u, etichetta: u }))} />
              <Scelta
                etichetta="Regione del cantiere"
                valore={campi.regione}
                onCambia={(v) => aggiorna("regione", v)}
                opzioni={[{ valore: "", etichetta: "Scegli…" }, ...REGIONI.map((r) => ({ valore: r, etichetta: r }))]}
              />
              {prezzoTuoInVista && (
                <PrezzoTuo etichetta={etichettaPrezzoTuo} aiuto={aiutoPrezzoTuo} unita={campi.unita} valore={campi.prezzoTuo} onCambia={(v) => aggiorna("prezzoTuo", v)} />
              )}
            </div>

            <details className="group mt-4 rounded-xl border border-navy-200 open:bg-navy-50/60">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[15px] font-semibold text-navy-700 [&::-webkit-details-marker]:hidden">
                Altri dettagli del cantiere (facoltativi)
                <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="grid gap-4 px-4 pb-4 pt-1 sm:grid-cols-2">
                <Scelta etichetta="Tipo di lavoro" valore={campi.tipoLavoro} onCambia={(v) => aggiorna("tipoLavoro", v)} opzioni={[...TIPI_LAVORO]} />
                <Scelta etichetta="Fornitura" valore={campi.fornitura} onCambia={(v) => aggiorna("fornitura", v)} opzioni={[...FORNITURE]} />
                <Scelta etichetta="Committente" valore={campi.committente} onCambia={(v) => aggiorna("committente", v)} opzioni={[...COMMITTENTI]} />
                {!prezzoTuoInVista && (
                  <PrezzoTuo etichetta={etichettaPrezzoTuo} aiuto={aiutoPrezzoTuo} unita={campi.unita} valore={campi.prezzoTuo} onCambia={(v) => aggiorna("prezzoTuo", v)} />
                )}
              </div>
            </details>

            {errore && (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] leading-relaxed text-red-800">
                {errore}
              </p>
            )}

            {inCorso ? (
              <Attesa />
            ) : (
              <button type="submit" className="btn-funnel mt-5 w-full sm:w-auto">
                Analizza la voce <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
            {contatto && (
              <p className="mt-4 text-[14px] leading-relaxed text-navy-600">
                Le analisi che fai qui le vede anche chi ti chiamerà da Cantieri Hub, così parte dal tuo lavoro.
              </p>
            )}
          </form>
        )}
      </div>

      {prove.length > 0 && (
        <div className="mt-8 space-y-8">
          <h2 ref={risultato} tabIndex={-1} className="scroll-mt-24 font-display text-2xl font-bold tracking-[-0.01em] text-navy outline-none md:text-3xl">
            {prove.length > 1 ? "Le tue analisi" : "La tua analisi"}
          </h2>
          {prove.map((p, i) => (
            <FoglioAnalisi key={`${p.n}-${p.analisi.id ?? i}`} prova={p} angolo={angolo} contatto={contatto} onApprofondita={(a) => approfondita(i, a)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pezzi del modulo ────────────────────────────────────────────────────────────────────────────────────────────

function Scelta({ etichetta, valore, onCambia, opzioni }: { etichetta: string; valore: string; onCambia: (v: string) => void; opzioni: readonly { valore: string; etichetta: string }[] }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block font-display text-[15px] font-semibold text-navy">
        {etichetta}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          className="min-h-12 w-full appearance-none rounded-xl border border-navy-300 bg-white py-2 pl-4 pr-10 text-[17px] text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        >
          {opzioni.map((o) => (
            <option key={o.valore} value={o.valore}>
              {o.etichetta}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-500" aria-hidden="true" />
      </div>
    </div>
  );
}

function PrezzoTuo({ etichetta, aiuto, unita, valore, onCambia }: { etichetta: string; aiuto: string; unita: string; valore: string; onCambia: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block font-display text-[15px] font-semibold text-navy">
        {etichetta}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          placeholder="Es. 45,00"
          aria-describedby={`${id}-aiuto`}
          className="min-h-12 w-full rounded-xl border border-navy-300 bg-white py-2 pl-4 pr-20 text-[17px] tabular-nums text-navy placeholder:text-navy-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-navy-500">€/{unita}</span>
      </div>
      <p id={`${id}-aiuto`} className="mt-1.5 text-[14px] text-navy-600">
        {aiuto}
      </p>
    </div>
  );
}

function Attesa() {
  const [passo, setPasso] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPasso((p) => Math.min(p + 1, PASSAGGI.length - 1)), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-5 rounded-xl border border-navy-200 bg-navy-50 p-4" role="status" aria-live="polite">
      <p className="font-display text-[15px] font-semibold text-navy">Analisi in corso. Resta su questa pagina: il risultato arriva qui sotto.</p>
      <ol className="mt-3 space-y-2">
        {PASSAGGI.map((t, i) => (
          <li key={t} className={`flex items-center gap-2.5 text-[15px] ${i <= passo ? "text-navy" : "text-navy-400"}`}>
            {i < passo ? (
              <Check size={18} className="shrink-0 text-orange-700" aria-hidden="true" />
            ) : i === passo ? (
              <Loader2 size={18} className="shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <span className="mx-[5px] h-2 w-2 shrink-0 rounded-full bg-navy-300" aria-hidden="true" />
            )}
            {t}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Avviso({ titolo, children, whatsapp }: { titolo: string; children: ReactNode; whatsapp: string }) {
  return (
    <div className="mt-5 rounded-xl border border-navy-200 bg-navy-50 p-5">
      <p className="font-display text-lg font-semibold text-navy">{titolo}</p>
      <p className="mt-1.5 text-[16px] leading-relaxed text-navy-700">{children}</p>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-funnel mt-4">
        Scrivici su WhatsApp <ArrowRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

// ── Il foglio d'analisi ─────────────────────────────────────────────────────────────────────────────────────────

const etichettaDi = (elenco: readonly { valore: string; etichetta: string }[], v: string) => elenco.find((e) => e.valore === v)?.etichetta ?? v;

function FoglioAnalisi({ prova, angolo, contatto, onApprofondita }: { prova: Prova; angolo: Angolo; contatto: string | null; onApprofondita: (a: AnalisiMostrata) => void }) {
  const { analisi: a, campi } = prova;
  const u = campi.unita;
  const tuo = leggiPrezzo(campi.prezzoTuo);
  const sommaComponenti = Math.round((a.materiali + a.manodopera + a.noli) * 100) / 100;
  const correttivi = Math.round((a.costoDiretto - sommaComponenti) * 100) / 100;
  const ricarichi = Math.round((a.prezzo - a.costoDiretto) * 100) / 100;
  const variazione = prova.prima ? Math.round(((a.prezzo - prova.prima) / prova.prima) * 1000) / 10 : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-navy-200 bg-white">
      <header className="border-b border-navy-100 bg-navy-50 px-5 py-4 md:px-7">
        <p className="text-[14px] font-semibold text-navy-600">
          Analisi {prova.n} di {MAX_ANALISI} · {campi.regione} · {etichettaDi(TIPI_LAVORO, campi.tipoLavoro)}
        </p>
        <p className="mt-1 text-[16px] leading-snug text-navy">{campi.voce}</p>
      </header>

      <div className="px-5 py-5 md:px-7 md:py-6">
        <p className="text-[15px] font-semibold text-navy-600">{prova.prima ? "Prezzo dopo l'approfondimento" : "Prezzo suggerito"}</p>
        <p className="mt-1 font-display text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-navy tabular-nums md:text-[3rem]">
          {euro(a.prezzo)}
          <span className="ml-2 font-sans text-lg font-semibold tracking-normal text-navy-600">/{u}</span>
        </p>
        {variazione !== null && prova.prima && (
          <p className="mt-2 text-[15px] text-navy-700">
            Prima era <span className="tabular-nums">{euro(prova.prima)}</span>: {variazione > 0 ? "+" : ""}
            <span className="tabular-nums">{variazione.toLocaleString("it-IT")}%</span> con le tue risposte.
          </p>
        )}

        {a.mercato && <RigaMercato mercato={a.mercato} prezzo={a.prezzo} prezzoTuo={tuo} unita={u} regione={campi.regione} />}
        {tuo !== null && <Confronto tuo={tuo} prezzo={a.prezzo} unita={u} angolo={angolo} />}

        <h3 className="mt-7 font-display text-lg font-semibold text-navy">Come si arriva al prezzo</h3>
        <div className="mt-3 divide-y divide-navy-100 border-y border-navy-100 text-[16px]">
          <Componente nome="Materiali" valore={a.materiali} unita={u}>
            {a.righe.materiali.map((m) => (
              <RigaDettaglio key={m.nome} testo={m.nome} conto={`${num(m.quantita)} ${m.unita} × ${euro(m.prezzo)}`} valore={m.subtotale} />
            ))}
          </Componente>
          <Componente nome="Manodopera" valore={a.manodopera} unita={u}>
            {a.righe.manodopera.map((m) => (
              <RigaDettaglio key={m.categoria} testo={m.categoria} conto={`${num(m.ore)} h × ${euro(m.costoOrario)}/h`} valore={m.subtotale} />
            ))}
          </Componente>
          <Componente nome="Noli e attrezzature" valore={a.noli} unita={u}>
            {a.righe.noli.map((m) => (
              <RigaDettaglio key={m.tipo} testo={m.tipo} conto={`${num(m.quantita)} × ${euro(m.costo)}`} valore={m.subtotale} />
            ))}
          </Componente>
          {Math.abs(correttivi) >= 0.01 && <RigaSemplice nome="Correttivi del cantiere" valore={correttivi} />}
          <RigaSemplice nome="Costo diretto" valore={a.costoDiretto} forte />
          <RigaSemplice nome="Spese generali (15%) e utile (10%)" valore={ricarichi} segno />
          <RigaSemplice nome="Prezzo suggerito" valore={a.prezzo} forte />
        </div>

        {a.note && (
          <details className="group mt-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-[15px] font-semibold text-navy-700 [&::-webkit-details-marker]:hidden">
              <ChevronDown size={18} className="transition-transform group-open:rotate-180" aria-hidden="true" />
              Note dell&apos;analisi{a.confidenza ? ` · affidabilità ${a.confidenza}` : ""}
            </summary>
            <p className="pb-1 pl-[26px] text-[15px] leading-relaxed text-navy-700">{a.note}</p>
          </details>
        )}

        <p className="mt-4 text-[14px] leading-relaxed text-navy-600">
          Stima fatta con l&apos;intelligenza artificiale: è un punto di partenza da controllare, non un prezzo garantito.{" "}
          <a href="/ai-trasparenza" className="font-semibold text-navy underline underline-offset-2">
            Come usiamo l&apos;AI
          </a>
        </p>

        {prova.approfondibile && a.domande.length > 0 && <Approfondimento prova={prova} angolo={angolo} contatto={contatto} onFatto={onApprofondita} />}

        <AzioniChiuse />
      </div>
    </article>
  );
}

const num = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 3 });

function Componente({ nome, valore, unita, children }: { nome: string; valore: number; unita: string; children: ReactNode[] }) {
  if (children.length === 0) return <RigaSemplice nome={nome} valore={valore} />;
  return (
    <div>
      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 text-navy">
            <ChevronDown size={18} className="shrink-0 text-navy-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            {nome}
          </span>
          <span className="tabular-nums text-navy">{euro(valore)}</span>
        </summary>
        <ul className="mb-3 ml-[26px] space-y-2 rounded-lg bg-navy-50 p-3 text-[15px]">{children}</ul>
        <span className="sr-only">Importi per {unita}</span>
      </details>
    </div>
  );
}

function RigaDettaglio({ testo, conto, valore }: { testo: string; conto: string; valore: number }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="text-navy-700">
        {testo}
        <span className="block text-[14px] tabular-nums text-navy-600">{conto}</span>
      </span>
      <span className="shrink-0 tabular-nums text-navy">{euro(valore)}</span>
    </li>
  );
}

function RigaSemplice({ nome, valore, forte, segno }: { nome: string; valore: number; forte?: boolean; segno?: boolean }) {
  return (
    <div className={`flex min-h-12 items-center justify-between gap-3 py-2 ${forte ? "font-semibold" : ""}`}>
      <span className={`text-navy ${forte ? "" : "pl-[26px]"}`}>{nome}</span>
      <span className="shrink-0 tabular-nums text-navy">
        {segno && valore > 0 ? "+ " : ""}
        {euro(valore)}
      </span>
    </div>
  );
}

/** Le unità dove «cento» si dice: cento m² sì, cento «a corpo» no. */
const A_MISURA = new Set(["m²", "ml", "m³", "m"]);

function Confronto({ tuo, prezzo, unita, angolo }: { tuo: number; prezzo: number; unita: string; angolo: Angolo }) {
  const s = scartoPercento(tuo, prezzo);
  if (s === null) return null;
  const diff = euro(Math.abs(prezzo - tuo));
  const perc = `${Math.abs(s).toLocaleString("it-IT")}%`;
  let testo: ReactNode;
  if (Math.abs(s) < 3) testo = <>Il tuo prezzo è in linea con il prezzo suggerito.</>;
  else if (s < 0)
    testo =
      angolo === "margine" ? (
        <>
          Il tuo prezzo è <strong>{perc} sotto</strong> il prezzo suggerito: <strong className="tabular-nums">{diff} in meno per {unita}</strong>.
          {A_MISURA.has(unita) && (
            <>
              {" "}Su cento {unita} sono <span className="tabular-nums">{euro(Math.abs(prezzo - tuo) * 100)}</span>.
            </>
          )}
        </>
      ) : (
        <>
          Il tuo prezzo è {perc} sotto il prezzo suggerito: <span className="tabular-nums">{diff}</span> in meno per {unita}.
        </>
      );
  else
    testo = (
      <>
        Il tuo prezzo è {perc} sopra il prezzo suggerito. Può essere margine, o il motivo per cui il cliente ti trova caro: in chiamata lo guardiamo sul tuo computo.
      </>
    );
  return <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-[16px] leading-relaxed text-navy">{testo}</p>;
}

function Approfondimento({ prova, angolo, contatto, onFatto }: { prova: Prova; angolo: Angolo; contatto: string | null; onFatto: (a: AnalisiMostrata) => void }) {
  const [risposte, setRisposte] = useState<Record<string, string>>({});
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const date = Object.values(risposte).filter((v) => v.trim()).length;

  async function invia() {
    setErrore(null);
    setInCorso(true);
    try {
      const a = prova.analisi;
      const r = await fetch("/api/prova/analisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fase: "approfondimento",
          angolo,
          contatto,
          richiesta: prova.campi,
          analisi: { id: a.id, prezzo: a.prezzo, costoDiretto: a.costoDiretto, materiali: a.materiali, manodopera: a.manodopera, noli: a.noli },
          risposte: Object.entries(risposte).filter(([, v]) => v.trim()).map(([id, answer]) => ({ id, answer })),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) return setErrore(d.messaggio ?? "Il ricalcolo non è arrivato. Riprova.");
      onFatto(d.analisi);
    } catch {
      setErrore("Connessione assente o lenta. Riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-navy-200 p-4 md:p-5" aria-label="Approfondimento dell'analisi">
      <h3 className="font-display text-lg font-semibold text-navy">Vuoi approfondire?</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-navy-600">
        Le domande che si farebbe un computista su questa voce. Rispondi e il prezzo si ricalcola. Nella prova si può fare una volta per analisi.
      </p>
      <div className="mt-4 space-y-5">
        {prova.analisi.domande.map((q) => (
          <fieldset key={q.id}>
            <legend className="text-[16px] font-medium leading-snug text-navy">{q.testo}</legend>
            {q.tipo === "scelta" ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.opzioni.map((o) => {
                  const scelta = risposte[q.id] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={scelta}
                      onClick={() => setRisposte((r) => ({ ...r, [q.id]: scelta ? "" : o }))}
                      className={`min-h-11 rounded-xl border px-3.5 py-2 text-left text-[15px] leading-snug transition-colors ${
                        scelta ? "border-navy bg-navy text-white" : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                value={risposte[q.id] ?? ""}
                onChange={(e) => setRisposte((r) => ({ ...r, [q.id]: e.target.value }))}
                maxLength={200}
                className="mt-2 min-h-12 w-full rounded-xl border border-navy-300 px-4 text-[17px] text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
              />
            )}
          </fieldset>
        ))}
      </div>
      {errore && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800">
          {errore}
        </p>
      )}
      <button type="button" onClick={invia} disabled={date === 0 || inCorso} className="btn-funnel mt-5 w-full sm:w-auto">
        {inCorso ? (
          <>
            <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Ricalcolo in corso…
          </>
        ) : (
          <>Ricalcola il prezzo</>
        )}
      </button>
    </section>
  );
}

const AZIONI = ["Scarica il PDF col tuo logo", "Salva nel tuo prezzario", "Usa nel preventivo"];

function AzioniChiuse() {
  const [detto, setDetto] = useState(false);
  return (
    <div className="mt-6 border-t border-navy-100 pt-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {AZIONI.map((t) => (
          <button
            key={t}
            type="button"
            aria-disabled="true"
            onClick={() => setDetto(true)}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-navy-300 bg-navy-50 px-4 text-[15px] font-semibold text-navy-600"
          >
            <Lock size={16} aria-hidden="true" /> {t}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-navy-700" aria-live="polite">
        {detto ? "Si sbloccano col Preventivatore: te li facciamo vedere in chiamata, sul tuo computo." : "Nel Preventivatore, da qui, l'analisi va nel PDF, nel tuo prezzario e nel preventivo."}
      </p>
    </div>
  );
}
