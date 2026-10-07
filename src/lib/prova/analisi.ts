/**
 * La prova dell'Analisi Prezzi del Preventivatore sul sito (07/10/2026).
 *
 * Il lead arriva da WhatsApp, scrive una voce sua e vede la scomposizione vera: il sito chiama la stessa funzione del
 * prodotto (`analyze-price` del Preventivatore) con un account demo che ha crediti suoi. Il prompt non si copia: resta
 * nel prodotto, e qui arriva solo il risultato.
 *
 * Questo modulo è PURO (niente Next, niente rete): le regole della prova, provate in `analisi.test.ts`.
 * - cosa si può chiedere: gli stessi elenchi del Preventivatore (`src/lib/regions.ts`, `src/lib/units.ts`,
 *   `PriceAnalysisInline.tsx` del 07/10), così la funzione riceve quello che riceve dal prodotto;
 * - cosa torna al browser: solo i campi che la pagina mostra, letti con difesa (un campo che manca non fa cadere niente);
 * - il limite: **2 analisi**, ognuna con **un** giro di approfondimento (il primo, che nel prodotto è gratuito). Il
 *   conto sta in un cookie firmato dal server; chi arriva col link del CRM ha il conto anche nelle etichette del
 *   contatto (`crm.ts`), che una finestra in incognito non azzera. Il tetto vero della spesa sono i crediti dell'account.
 */

export const MAX_ANALISI = 2;

export const ANGOLI = ["margine", "fuori-prezzario"] as const;
export type Angolo = (typeof ANGOLI)[number];

export function eAngolo(v: unknown): v is Angolo {
  return typeof v === "string" && (ANGOLI as readonly string[]).includes(v);
}

export const REGIONI = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia",
  "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto",
] as const;

export const UNITA = [
  "m²", "ml", "m³", "m", "cm", "mm", "dm²",
  "cad", "nr", "a corpo",
  "kg", "t", "q", "lt",
  "ora", "giorno", "mese", "settimana",
] as const;

export const TIPI_LAVORO = [
  { valore: "nuovo", etichetta: "Nuova costruzione" },
  { valore: "ristrutturazione_leggera", etichetta: "Ristrutturazione leggera" },
  { valore: "ristrutturazione_pesante", etichetta: "Ristrutturazione pesante" },
  { valore: "edificio_abitato", etichetta: "Edificio abitato" },
  { valore: "edificio_vincolato", etichetta: "Edificio vincolato o storico" },
] as const;

export const FORNITURE = [
  { valore: "fornitura_posa", etichetta: "Fornitura e posa" },
  { valore: "solo_posa", etichetta: "Solo posa" },
  { valore: "subappalto", etichetta: "Subappalto chiavi in mano" },
] as const;

export const COMMITTENTI = [
  { valore: "privato", etichetta: "Privato" },
  { valore: "impresa", etichetta: "Impresa" },
  { valore: "pubblico", etichetta: "Ente pubblico" },
] as const;

/** Le voci da toccare sopra il campo: con la pagina bianca non si comincia. */
export const VOCI_ESEMPIO = [
  { titolo: "Cappotto termico", voce: "Cappotto termico in EPS da 10 cm, rasato e finito con intonachino", unita: "m²" },
  { titolo: "Massetto", voce: "Massetto in sabbia e cemento, spessore 5 cm, tirato a staggia", unita: "m²" },
  { titolo: "Cartongesso", voce: "Parete in cartongesso a doppia lastra con isolante in lana minerale", unita: "m²" },
  { titolo: "Tinteggiatura", voce: "Tinteggiatura di pareti interne con idropittura traspirante, due mani", unita: "m²" },
] as const;

export const VOCE_MIN = 8;
export const VOCE_MAX = 600;

export type RichiestaProva = {
  voce: string;
  unita: string;
  regione: string;
  tipoLavoro: string;
  fornitura: string;
  committente: string;
  /** Il prezzo che mette lui, per il confronto. Non va alla funzione: serve solo alla pagina e alla nota. */
  prezzoTuo: number | null;
};

type Esito<T> = { ok: true; valore: T } | { ok: false; errore: string };

const valoriDi = (elenco: readonly { valore: string }[]) => elenco.map((e) => e.valore);

function scelta(v: unknown, ammessi: readonly string[], predefinito: string): string | null {
  if (v === undefined || v === null || v === "") return predefinito;
  return typeof v === "string" && ammessi.includes(v) ? v : null;
}

/**
 * «45», «45,50», «1.250,00», «€ 45» e anche «45.50»: con la virgola i punti sono le migliaia; senza virgola, un punto
 * seguito da una o due cifre è il decimale (chi scrive dal telefono usa il punto della tastiera).
 */
export function leggiPrezzo(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  let n: number;
  if (typeof v === "number") n = v;
  else {
    const s = String(v).replace(/\s|€/g, "");
    if (s.includes(",")) n = Number(s.replace(/\./g, "").replace(",", "."));
    else if (/^\d+\.\d{1,2}$/.test(s)) n = Number(s);
    else n = Number(s.replace(/\./g, ""));
  }
  return Number.isFinite(n) && n > 0 && n < 1_000_000 ? Math.round(n * 100) / 100 : null;
}

export function validaRichiesta(x: unknown): Esito<RichiestaProva> {
  if (!x || typeof x !== "object") return { ok: false, errore: "Richiesta vuota." };
  const r = x as Record<string, unknown>;
  const voce = typeof r.voce === "string" ? r.voce.replace(/\s+/g, " ").trim() : "";
  if (voce.length < VOCE_MIN) return { ok: false, errore: "Descrivi la lavorazione con qualche parola in più." };
  if (voce.length > VOCE_MAX) return { ok: false, errore: `La descrizione supera i ${VOCE_MAX} caratteri.` };
  const unita = scelta(r.unita, UNITA, "");
  if (!unita) return { ok: false, errore: "Scegli l'unità di misura." };
  const regione = scelta(r.regione, REGIONI, "");
  if (!regione) return { ok: false, errore: "Scegli la regione del cantiere." };
  const tipoLavoro = scelta(r.tipoLavoro, valoriDi(TIPI_LAVORO), "ristrutturazione_leggera");
  const fornitura = scelta(r.fornitura, valoriDi(FORNITURE), "fornitura_posa");
  const committente = scelta(r.committente, valoriDi(COMMITTENTI), "privato");
  if (!tipoLavoro || !fornitura || !committente) return { ok: false, errore: "Una delle scelte non è valida." };
  return {
    ok: true,
    valore: { voce, unita, regione, tipoLavoro, fornitura, committente, prezzoTuo: leggiPrezzo(r.prezzoTuo) },
  };
}

/** Spese generali e utile della prova: i predefiniti del prodotto per chi non li ha ancora impostati. */
export const SPESE_GENERALI = 15;
export const UTILE = 10;

/** Il corpo per `analyze-price`, con i nomi del Preventivatore (`PriceAnalysisInline.tsx`, 07/10/2026). */
export function corpoAnalisi(r: RichiestaProva): Record<string, unknown> {
  return {
    description: r.voce,
    unit: r.unita,
    region: r.regione,
    workType: r.tipoLavoro,
    supplyType: r.fornitura,
    clientType: r.committente,
    projectSize: "piccolo",
    overhead_percent: SPESE_GENERALI,
    profit_percent: UTILE,
  };
}

export type Risposta = { id: string; answer: string };

/**
 * Il giro di approfondimento: la funzione vuole l'analisi di prima con `analisi_id` (è da lì che conta i giri) e i
 * cinque totali che rilegge nel prompt.
 */
export function corpoApprofondimento(r: RichiestaProva, a: AnalisiMostrata, risposte: Risposta[]): Record<string, unknown> {
  return {
    ...corpoAnalisi(r),
    phase: "refine",
    original_analysis: {
      analisi_id: a.id,
      suggested_price: a.prezzo,
      direct_cost: a.costoDiretto,
      materials_cost: a.materiali,
      labor_cost: a.manodopera,
      equipment_cost: a.noli,
    },
    refinement_answers: risposte,
  };
}

export function validaRisposte(x: unknown): Risposta[] | null {
  if (!Array.isArray(x) || x.length === 0 || x.length > 6) return null;
  const esito: Risposta[] = [];
  for (const v of x) {
    if (!v || typeof v !== "object") return null;
    const { id, answer } = v as Record<string, unknown>;
    if (typeof id !== "string" || !/^[\w-]{1,20}$/.test(id)) return null;
    if (typeof answer !== "string") return null;
    const testo = answer.replace(/\s+/g, " ").trim().slice(0, 200);
    if (testo) esito.push({ id, answer: testo });
  }
  return esito.length ? esito : null;
}

// ── Il risultato che va al browser ──────────────────────────────────────────────────────────────────────────────

export type RigaMateriale = { nome: string; quantita: number; unita: string; prezzo: number; subtotale: number };
export type RigaManodopera = { categoria: string; ore: number; costoOrario: number; subtotale: number };
export type RigaNolo = { tipo: string; quantita: number; costo: number; subtotale: number };
export type Domanda = { id: string; testo: string; tipo: "scelta" | "testo"; opzioni: string[] };

export type AnalisiMostrata = {
  /** L'`analisi_id` della funzione: senza, l'approfondimento non è gratuito e la prova non lo offre. */
  id: string | null;
  materiali: number;
  manodopera: number;
  noli: number;
  costoDiretto: number;
  prezzo: number;
  mercato: { basso: number; medio: number; alto: number } | null;
  confidenza: "alta" | "media" | "bassa" | null;
  note: string;
  righe: { materiali: RigaMateriale[]; manodopera: RigaManodopera[]; noli: RigaNolo[] };
  domande: Domanda[];
};

const num = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};
const testo = (v: unknown, max = 400): string => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const elenco = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object") : [];

const FORMA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Legge l'analisi della funzione. `null` se mancano i due numeri senza cui la pagina non ha niente da mostrare. */
export function analisiDaRisposta(json: unknown): AnalisiMostrata | null {
  const a = json && typeof json === "object" ? (json as Record<string, unknown>).analysis : null;
  if (!a || typeof a !== "object") return null;
  const r = a as Record<string, unknown>;
  const prezzo = num(r.suggested_price);
  const costoDiretto = num(r.direct_cost);
  if (prezzo === null || costoDiretto === null || prezzo <= 0) return null;

  const basso = num(r.market_low);
  const medio = num(r.market_mid);
  const alto = num(r.market_high);
  const mercato = basso !== null && medio !== null && alto !== null && basso > 0 && basso <= medio && medio <= alto
    ? { basso, medio, alto }
    : null;

  const confidenza = r.confidence === "alta" || r.confidence === "media" || r.confidence === "bassa" ? r.confidence : null;
  const id = typeof r.analisi_id === "string" && FORMA_UUID.test(r.analisi_id) ? r.analisi_id.toLowerCase() : null;

  return {
    id,
    materiali: num(r.materials_cost) ?? 0,
    manodopera: num(r.labor_cost) ?? 0,
    noli: num(r.equipment_cost) ?? 0,
    costoDiretto,
    prezzo,
    mercato,
    confidenza,
    note: testo(r.notes, 1200),
    righe: {
      materiali: elenco(r.materials_breakdown).slice(0, 12).map((m) => ({
        nome: testo(m.name, 160),
        quantita: num(m.quantity) ?? 0,
        unita: testo(m.unit, 12),
        prezzo: num(m.unit_price) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.nome),
      manodopera: elenco(r.labor_breakdown).slice(0, 8).map((m) => ({
        categoria: testo(m.category, 120),
        ore: num(m.hours_per_unit) ?? 0,
        costoOrario: num(m.hourly_rate) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.categoria),
      noli: elenco(r.equipment_breakdown).slice(0, 8).map((m) => ({
        tipo: testo(m.type, 160),
        quantita: num(m.quantity) ?? 0,
        costo: num(m.unit_cost) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.tipo),
    },
    domande: elenco(r.refinement_questions).slice(0, 4).map((d, i) => {
      const opzioni = Array.isArray(d.options) ? d.options.map((o) => testo(o, 120)).filter(Boolean).slice(0, 4) : [];
      return {
        id: typeof d.id === "string" && /^[\w-]{1,20}$/.test(d.id) ? d.id : `q${i + 1}`,
        testo: testo(d.label, 240),
        tipo: d.type === "choice" && opzioni.length >= 2 ? ("scelta" as const) : ("testo" as const),
        opzioni,
      };
    }).filter((d) => d.testo),
  };
}

/** L'analisi che il browser rimanda per l'approfondimento: si rileggono solo i numeri che servono, e l'id. */
export function analisiDalBrowser(x: unknown): AnalisiMostrata | null {
  if (!x || typeof x !== "object") return null;
  const r = x as Record<string, unknown>;
  const id = typeof r.id === "string" && FORMA_UUID.test(r.id) ? r.id.toLowerCase() : null;
  const prezzo = num(r.prezzo);
  const costoDiretto = num(r.costoDiretto);
  if (!id || prezzo === null || costoDiretto === null) return null;
  return {
    id,
    materiali: num(r.materiali) ?? 0,
    manodopera: num(r.manodopera) ?? 0,
    noli: num(r.noli) ?? 0,
    costoDiretto,
    prezzo,
    mercato: null,
    confidenza: null,
    note: "",
    righe: { materiali: [], manodopera: [], noli: [] },
    domande: [],
  };
}

// ── Il conto delle prove: un cookie firmato ─────────────────────────────────────────────────────────────────────

/** `a`: gli id delle analisi fatte (o un segnaposto se la funzione non ne ha dato uno) · `r`: quelle approfondite. */
export type Conteggio = { a: string[]; r: string[] };

export const CONTEGGIO_VUOTO: Conteggio = { a: [], r: [] };

const codifica = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const decodifica = (s: string) => Buffer.from(s, "base64url").toString("utf8");

async function impronta(dati: string, segreto: string): Promise<string> {
  const chiave = await crypto.subtle.importKey("raw", new TextEncoder().encode(segreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const firma = await crypto.subtle.sign("HMAC", chiave, new TextEncoder().encode(dati));
  return Buffer.from(firma).toString("base64url");
}

export async function firmaConteggio(c: Conteggio, segreto: string): Promise<string> {
  const corpo = codifica(JSON.stringify({ a: c.a.slice(0, 10), r: c.r.slice(0, 10) }));
  return `${corpo}.${await impronta(corpo, segreto)}`;
}

/** Un cookie assente, rotto o con la firma sbagliata vale come nessuna prova fatta: lo dice anche la prova. */
export async function leggiConteggio(valore: string | undefined | null, segreto: string): Promise<Conteggio> {
  if (!valore) return CONTEGGIO_VUOTO;
  const [corpo, firma] = valore.split(".");
  if (!corpo || !firma) return CONTEGGIO_VUOTO;
  if ((await impronta(corpo, segreto)) !== firma) return CONTEGGIO_VUOTO;
  try {
    const c = JSON.parse(decodifica(corpo)) as Partial<Conteggio>;
    const soloTesti = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    return { a: soloTesti(c.a), r: soloTesti(c.r) };
  } catch {
    return CONTEGGIO_VUOTO;
  }
}

export const rimaste = (fatte: number) => Math.max(0, MAX_ANALISI - fatte);

export function conAnalisi(c: Conteggio, id: string | null): Conteggio {
  return { a: [...c.a, id ?? `senza-id-${c.a.length + 1}`], r: c.r };
}

export function puoApprofondire(c: Conteggio, id: string | null): boolean {
  return !!id && c.a.includes(id) && !c.r.includes(id);
}

export function conApprofondimento(c: Conteggio, id: string): Conteggio {
  return { a: c.a, r: [...c.r, id] };
}

// ── Il confronto col prezzo suo e la nota per il CRM ────────────────────────────────────────────────────────────

/** Quanto il suo prezzo sta sotto (negativo) o sopra (positivo) il prezzo suggerito, in percentuale. */
export function scartoPercento(prezzoTuo: number | null, prezzo: number): number | null {
  if (prezzoTuo === null || prezzo <= 0) return null;
  return Math.round(((prezzoTuo - prezzo) / prezzo) * 1000) / 10;
}

/** «3.540,00 €»: in italiano Intl non separa le migliaia sotto i 10.000, e un imprenditore il punto se lo aspetta. */
const FORMATO_EURO = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
} as Intl.NumberFormatOptions);

export function euro(n: number): string {
  return FORMATO_EURO.format(n);
}

const etichettaDi = (elenco: readonly { valore: string; etichetta: string }[], v: string) =>
  elenco.find((e) => e.valore === v)?.etichetta ?? v;

export function notaPerIlCrm(p: {
  angolo: Angolo;
  numero: number;
  richiesta: RichiestaProva;
  analisi: AnalisiMostrata;
  approfondimento?: { risposte: Risposta[]; prezzoPrima: number };
}): string {
  const { richiesta: r, analisi: a } = p;
  const u = r.unita;
  const righe = [
    p.approfondimento
      ? `Prova dell'analisi prezzi dal sito: approfondimento dell'analisi ${p.numero} di ${MAX_ANALISI} (pagina «${p.angolo}»)`
      : `Prova dell'analisi prezzi dal sito: analisi ${p.numero} di ${MAX_ANALISI} (pagina «${p.angolo}»)`,
    `Voce: ${r.voce}`,
    `${u} · ${r.regione} · ${etichettaDi(TIPI_LAVORO, r.tipoLavoro)} · ${etichettaDi(FORNITURE, r.fornitura)} · committente ${etichettaDi(COMMITTENTI, r.committente).toLowerCase()}`,
    `Prezzo suggerito: ${euro(a.prezzo)}/${u}` + (a.mercato ? ` (mercato ${euro(a.mercato.basso)} – ${euro(a.mercato.alto)})` : ""),
  ];
  if (p.approfondimento) {
    righe.push(`Prima dell'approfondimento: ${euro(p.approfondimento.prezzoPrima)}/${u}`);
    righe.push(`Risposte: ${p.approfondimento.risposte.map((x) => x.answer).join(" · ")}`);
  }
  if (r.prezzoTuo !== null) {
    const s = scartoPercento(r.prezzoTuo, a.prezzo);
    righe.push(`Il suo prezzo: ${euro(r.prezzoTuo)}/${u}` + (s !== null ? ` (${s > 0 ? "+" : ""}${s.toLocaleString("it-IT")}% sul prezzo suggerito)` : ""));
  }
  return righe.join("\n");
}
