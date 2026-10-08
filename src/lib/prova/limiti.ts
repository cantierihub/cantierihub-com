/**
 * Il limite delle 2 analisi lo tiene il server (08/10/2026).
 *
 * Fino al 07/10 le prove le contava solo il cookie del telefono: in incognito, cancellando i cookie, rimandando un
 * cookie vecchio o chiamando l'API a mano si ripartiva da zero; e dieci richieste mandate insieme passavano tutte,
 * perché il cookie si aggiornava solo alla risposta. Raffaele: «il cliente che viene da un singolo indirizzo IP ne
 * deve fare solo due, e non devono esserci modi per fotterci». Ora valgono tutti insieme e vince il più severo:
 *
 * - l'**indirizzo IP**: 2 analisi in 30 giorni. Un indirizzo IPv6 si conta per blocco /64, perché il telefono cambia
 *   da solo la seconda metà dell'indirizzo più volte al giorno;
 * - il **contatto del CRM**, quando la pagina è aperta dal link personale (`?c=`): 2 analisi in un anno;
 * - il **cookie** del telefono (in analisi.ts): ferma chi cambia rete ma non browser;
 * - un **tetto al giorno** per tutta la prova (`PROVA_TETTO_GIORNO`, predefinito 80): chi ha cento indirizzi non
 *   svuota i crediti dell'account demo in una notte.
 *
 * Una prova si PRENOTA prima di chiamare l'AI, con una scrittura che riesce solo se nessuno ha toccato la scheda nel
 * frattempo: di due richieste insieme ne passa una alla volta. Si RESTITUISCE se l'AI non risponde: un errore nostro
 * non consuma una prova. L'approfondimento è uno per analisi e parte dalla voce salvata qui, non da quella che rimanda
 * il browser: altrimenti «approfondire» con un'altra lavorazione sarebbe un'analisi in più.
 *
 * Nell'archivio non c'è l'indirizzo né l'id del contatto: c'è la loro impronta HMAC con PROVA_SEGRETO.
 * Modulo PURO: l'archivio arriva da fuori (Vercel Blob in archivioBlob.ts, la memoria nelle prove e sul Mac).
 */

import type { RichiestaProva } from "./analisi";

/** Quante volte si rilegge e si riprova una scrittura contesa da un'altra richiesta. */
const TENTATIVI = 6;

export const GIORNO_MS = 24 * 60 * 60 * 1000;
export const FINESTRA_IP_MS = 30 * GIORNO_MS;
export const FINESTRA_CONTATTO_MS = 365 * GIORNO_MS;
export const TETTO_GIORNO_PREDEFINITO = 80;
/** Gli approfondimenti di ogni analisi nella prova (nel Preventivatore si continua finché la stima non torna). */
export const GIRI_PROVA = 1;

// ── L'archivio ───────────────────────────────────────────────────────────────────────────────────────────────────

export type Letto = { dati: unknown; etag: string };

export interface Archivio {
  /** Il contenuto e la sua versione (etag); null se non c'è. */
  leggi(percorso: string): Promise<Letto | null>;
  /** Scrive solo se il percorso non esiste ancora: false se c'era già. */
  crea(percorso: string, dati: unknown): Promise<boolean>;
  /** Scrive solo se nessuno l'ha cambiato dopo la lettura (stesso etag): false se è cambiato. */
  sostituisci(percorso: string, dati: unknown, etag: string): Promise<boolean>;
}

/** L'archivio in memoria: le prove e lo sviluppo sul Mac. Fra lettura e scrittura lascia passare le altre richieste. */
export function archivioInMemoria(): Archivio {
  const mappa = new Map<string, { testo: string; etag: string }>();
  let versione = 0;
  const pausa = () => new Promise<void>((r) => setImmediate(r));
  return {
    async leggi(p) {
      await pausa();
      const x = mappa.get(p);
      return x ? { dati: JSON.parse(x.testo), etag: x.etag } : null;
    },
    async crea(p, dati) {
      await pausa();
      if (mappa.has(p)) return false;
      mappa.set(p, { testo: JSON.stringify(dati), etag: `v${++versione}` });
      return true;
    },
    async sostituisci(p, dati, etag) {
      await pausa();
      if (mappa.get(p)?.etag !== etag) return false;
      mappa.set(p, { testo: JSON.stringify(dati), etag: `v${++versione}` });
      return true;
    },
  };
}

// ── Chi chiede: l'indirizzo e le impronte ───────────────────────────────────────────────────────────────────────

/**
 * L'indirizzo del visitatore. Su Vercel `x-real-ip` e `x-forwarded-for` li scrive Vercel e non li inoltra dal
 * browser: non si possono falsificare dal telefono.
 */
export function ipDaIntestazioni(h: { get(nome: string): string | null }): string | null {
  const v = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0];
  return v?.trim() || null;
}

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

/** L'IPv4 in coda a un IPv6 («::ffff:1.2.3.4», «64:ff9b::1.2.3.4») diventa due gruppi esadecimali. */
function codaIpv4(parti: string[]): string[] {
  const ultima = parti.at(-1) ?? "";
  const m = ultima.match(IPV4);
  if (!m) return parti;
  const [a, b, c, d] = m.slice(1).map(Number);
  return [...parti.slice(0, -1), ((a << 8) | b).toString(16), ((c << 8) | d).toString(16)];
}

/**
 * La «connessione» che si conta: l'IPv4 intero; l'IPv6 per blocco /64 (le prime quattro parti), che a casa è la rete
 * del router e sul telefono è la linea; un IPv4 dentro un IPv6 (`::ffff:…`) torna IPv4.
 */
export function bloccoIp(ip: string | null): string {
  if (!ip) return "sconosciuto";
  let s = ip.trim().toLowerCase();
  if (s.startsWith("[")) s = s.slice(1, s.indexOf("]") > 0 ? s.indexOf("]") : undefined);
  const zona = s.indexOf("%");
  if (zona >= 0) s = s.slice(0, zona);
  const mappato = s.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mappato) s = mappato[1];
  if (IPV4.test(s)) return s.split(".").map(Number).every((n) => n <= 255) ? s : "non-valido";
  if (!s.includes(":")) return "non-valido";

  const doppi = s.split("::");
  if (doppi.length > 2) return "non-valido";
  const testa = codaIpv4(doppi[0] ? doppi[0].split(":") : []);
  const coda = doppi.length === 2 ? codaIpv4(doppi[1] ? doppi[1].split(":") : []) : [];
  const mancano = 8 - testa.length - coda.length;
  if (doppi.length === 1 ? testa.length !== 8 : mancano < 1) return "non-valido";
  const parti = doppi.length === 1 ? testa : [...testa, ...Array<string>(mancano).fill("0"), ...coda];
  if (parti.some((p) => !/^[0-9a-f]{1,4}$/.test(p))) return "non-valido";
  return `${parti.slice(0, 4).map((p) => p.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}

/** L'impronta che finisce nell'archivio al posto dell'indirizzo o del contatto: HMAC-SHA256, 32 cifre esadecimali. */
export async function impronta(testo: string, segreto: string): Promise<string> {
  const chiave = await crypto.subtle.importKey("raw", new TextEncoder().encode(segreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const firma = new Uint8Array(await crypto.subtle.sign("HMAC", chiave, new TextEncoder().encode(testo)));
  return Array.from(firma.slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Il giorno della prova, all'ora italiana: il tetto giornaliero riparte a mezzanotte di Roma. */
export const giornoDi = (ora: number) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" }).format(new Date(ora));

export const percorsoIp = (h: string) => `prova/ip/${h}.json`;
export const percorsoContatto = (h: string) => `prova/contatto/${h}.json`;
export const percorsoGiorno = (giorno: string) => `prova/giorno/${giorno}.json`;
export const percorsoAnalisi = (id: string) => `prova/analisi/${id}.json`;

/** Il tetto giornaliero da `PROVA_TETTO_GIORNO`; un valore storto vale il predefinito. */
export function tettoGiorno(valore: string | undefined): number {
  const n = Number(valore);
  return Number.isInteger(n) && n >= 1 ? n : TETTO_GIORNO_PREDEFINITO;
}

// ── Le schede: prenotare, restituire, contare ───────────────────────────────────────────────────────────────────

type Voce = { id: string; t: number };

function vociDa(dati: unknown, dal: number): Voce[] {
  const v = dati && typeof dati === "object" ? (dati as { v?: unknown }).v : null;
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is Voce => !!x && typeof x === "object" && typeof (x as Voce).id === "string" && typeof (x as Voce).t === "number" && (x as Voce).t >= dal);
}

export type Prenotazione = { esito: "presa"; dopo: number } | { esito: "piena" } | { esito: "contesa" };

/**
 * Prende un posto nella scheda `percorso` (al massimo `max` nella finestra). Le voci fuori finestra si tolgono alla
 * scrittura. Se la scheda contiene già `id`, il posto è nostro: una scrittura riuscita la cui risposta è andata persa.
 */
export async function prenota(a: Archivio, percorso: string, id: string, max: number, ora: number, finestraMs: number): Promise<Prenotazione> {
  for (let i = 0; i < TENTATIVI; i++) {
    const letto = await a.leggi(percorso);
    const voci = vociDa(letto?.dati, ora - finestraMs);
    if (voci.some((x) => x.id === id)) return { esito: "presa", dopo: voci.length };
    if (voci.length >= max) return { esito: "piena" };
    const nuove = [...voci, { id, t: ora }];
    const scritto = letto ? await a.sostituisci(percorso, { v: nuove }, letto.etag) : await a.crea(percorso, { v: nuove });
    if (scritto) return { esito: "presa", dopo: nuove.length };
  }
  return { esito: "contesa" };
}

/** Rende il posto `id` (l'AI non ha risposto). Se il posto non c'è più, non fa niente. */
export async function restituisci(a: Archivio, percorso: string, id: string): Promise<void> {
  for (let i = 0; i < TENTATIVI; i++) {
    const letto = await a.leggi(percorso);
    if (!letto) return;
    const voci = vociDa(letto.dati, 0);
    if (!voci.some((x) => x.id === id)) return;
    if (await a.sostituisci(percorso, { v: voci.filter((x) => x.id !== id) }, letto.etag)) return;
  }
}

/** I posti presi nella finestra. */
export async function usate(a: Archivio, percorso: string, ora: number, finestraMs: number): Promise<number> {
  return vociDa((await a.leggi(percorso))?.dati, ora - finestraMs).length;
}

// ── L'analisi salvata, per il suo approfondimento ───────────────────────────────────────────────────────────────

/** I numeri della prima stima che il Preventivatore vuole indietro nell'approfondimento (`original_analysis`). */
export type BaseAnalisi = { id: string; prezzo: number; costoDiretto: number; materiali: number; manodopera: number; noli: number };
export type SchedaAnalisi = { t: number; richiesta: RichiestaProva; base: BaseAnalisi; giri: number };

const numero = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : null);

function schedaDa(dati: unknown): SchedaAnalisi | null {
  if (!dati || typeof dati !== "object") return null;
  const s = dati as Partial<SchedaAnalisi>;
  const b = s.base as Partial<BaseAnalisi> | undefined;
  const r = s.richiesta as Partial<RichiestaProva> | undefined;
  if (!b || typeof b.id !== "string" || numero(b.prezzo) === null || numero(b.costoDiretto) === null) return null;
  if (!r || typeof r.voce !== "string" || typeof r.regione !== "string") return null;
  return {
    t: numero(s.t) ?? 0,
    richiesta: r as RichiestaProva,
    base: {
      id: b.id,
      prezzo: b.prezzo!,
      costoDiretto: b.costoDiretto!,
      materiali: numero(b.materiali) ?? 0,
      manodopera: numero(b.manodopera) ?? 0,
      noli: numero(b.noli) ?? 0,
    },
    giri: numero(s.giri) ?? 0,
  };
}

/** Salva l'analisi riuscita: senza questa scheda l'approfondimento non parte. */
export async function salvaAnalisi(a: Archivio, s: SchedaAnalisi): Promise<void> {
  await a.crea(percorsoAnalisi(s.base.id), s);
}

export type Giro = { esito: "preso"; scheda: SchedaAnalisi } | { esito: "sconosciuta" } | { esito: "fatto" } | { esito: "contesa" };

/**
 * Prende l'approfondimento dell'analisi `id`: solo se l'analisi l'ha fatta la prova (c'è la scheda) e non è già stata
 * approfondita. Torna la scheda: voce e numeri dell'approfondimento vengono da lì.
 */
export async function prenotaGiro(a: Archivio, id: string): Promise<Giro> {
  for (let i = 0; i < TENTATIVI; i++) {
    const letto = await a.leggi(percorsoAnalisi(id));
    const s = letto ? schedaDa(letto.dati) : null;
    if (!letto || !s) return { esito: "sconosciuta" };
    if (s.giri >= GIRI_PROVA) return { esito: "fatto" };
    if (await a.sostituisci(percorsoAnalisi(id), { ...s, giri: s.giri + 1 }, letto.etag)) return { esito: "preso", scheda: s };
  }
  return { esito: "contesa" };
}

/** Rende l'approfondimento (l'AI non ha risposto). */
export async function restituisciGiro(a: Archivio, id: string): Promise<void> {
  for (let i = 0; i < TENTATIVI; i++) {
    const letto = await a.leggi(percorsoAnalisi(id));
    const s = letto ? schedaDa(letto.dati) : null;
    if (!letto || !s || s.giri <= 0) return;
    if (await a.sostituisci(percorsoAnalisi(id), { ...s, giri: s.giri - 1 }, letto.etag)) return;
  }
}
