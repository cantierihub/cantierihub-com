/**
 * La prova dell'Analisi Prezzi del Preventivatore sul sito (07/10/2026).
 *
 * Il lead arriva da WhatsApp, scrive una lavorazione sua e la analizza come nel Preventivatore: il server del sito
 * chiama la STESSA funzione del prodotto (`analyze-price`) con un account demo che ha crediti suoi. Il prompt (costi
 * della manodopera regione per regione, prezzi dei materiali, sfridi, correttivi del cantiere, spese generali e
 * utile) resta nel prodotto e non si copia: quando lì migliora, migliora anche qui.
 *
 * Il modulo è una replica di `PriceAnalysisInline.tsx` del Preventivatore (origin/main 4eefacec, 07/10/2026): stessi
 * campi, stesse scelte, stessi predefiniti, stesso corpo mandato alla funzione. Se il prodotto cambia, si cambia qui.
 *
 * Questo file è PURO (niente Next, niente rete): le regole della prova, provate in `analisi.test.ts`.
 * - cosa torna al browser: solo i campi che la pagina mostra, letti con difesa;
 * - il limite: **2 analisi**, ognuna con **un** giro di approfondimento (il primo, che nel prodotto è gratuito). Il
 *   conto sta in un cookie firmato dal server; chi arriva col link del CRM ha il conto anche nelle etichette del
 *   contatto (`crm.ts`). Il tetto vero della spesa sono i crediti dell'account demo.
 */

export const MAX_ANALISI = 2;

type Opzione = { valore: string; etichetta: string };

// ── Gli elenchi del Preventivatore (src/lib/regions.ts, src/lib/units.ts, PriceAnalysisInline.tsx) ─────────────

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

export const TIPI_LAVORO: Opzione[] = [
  { valore: "nuovo", etichetta: "Nuovo" },
  { valore: "ristrutturazione_leggera", etichetta: "Ristr. leggera" },
  { valore: "ristrutturazione_pesante", etichetta: "Ristr. pesante" },
  { valore: "edificio_abitato", etichetta: "Edificio abitato" },
  { valore: "edificio_vincolato", etichetta: "Vincolato/storico" },
];

export const COMMITTENTI: Opzione[] = [
  { valore: "privato", etichetta: "Privato" },
  { valore: "pubblico", etichetta: "Ente Pubblico" },
  { valore: "impresa", etichetta: "Impresa" },
];

export const DIMENSIONI: Opzione[] = [
  { valore: "piccolo", etichetta: "Piccolo (<20k €)" },
  { valore: "medio_piccolo", etichetta: "Medio-piccolo (20-50k €)" },
  { valore: "medio", etichetta: "Medio (50-150k €)" },
  { valore: "grande", etichetta: "Grande (150-500k €)" },
  { valore: "molto_grande", etichetta: "Molto grande (>500k €)" },
];

export const FORNITURE: Opzione[] = [
  { valore: "solo_posa", etichetta: "Solo posa" },
  { valore: "fornitura_posa", etichetta: "Fornitura e posa" },
  { valore: "subappalto", etichetta: "Subappalto chiavi in mano" },
];

/** I parametri avanzati: «none» vuol dire non specificato e alla funzione non si manda. */
export const STAGIONI: Opzione[] = [
  { valore: "none", etichetta: "Non specificata" },
  { valore: "estate", etichetta: "Estate" },
  { valore: "inverno", etichetta: "Inverno" },
  { valore: "mezza_stagione", etichetta: "Mezza stagione" },
];
export const VINCOLI_ORARI: Opzione[] = [
  { valore: "none", etichetta: "Nessuno" },
  { valore: "notturno", etichetta: "Notturno" },
  { valore: "festivo", etichetta: "Festivo" },
  { valore: "h24", etichetta: "H24" },
];
export const URGENZE: Opzione[] = [
  { valore: "none", etichetta: "Normale" },
  { valore: "urgente", etichetta: "Urgente" },
  { valore: "emergenza", etichetta: "Emergenza" },
];
export const ACCESSIBILITA: Opzione[] = [
  { valore: "none", etichetta: "Non specificata" },
  { valore: "buona", etichetta: "Buona" },
  { valore: "limitata", etichetta: "Limitata" },
  { valore: "difficile", etichetta: "Difficile (ZTL, piano alto)" },
];
export const PIANI: Opzione[] = [
  { valore: "none", etichetta: "Non specificato" },
  { valore: "piano_terra", etichetta: "Piano terra / Interrato" },
  { valore: "piano_1_2", etichetta: "1°-2° piano" },
  { valore: "piano_3_4", etichetta: "3°-4° piano" },
  { valore: "piano_5_6", etichetta: "5°-6° piano" },
  { valore: "piano_7_plus", etichetta: "7° piano e oltre" },
  { valore: "copertura", etichetta: "Copertura / tetto" },
  { valore: "sotterraneo", etichetta: "Sotterraneo / cavità" },
];
export const DISTANZE: Opzione[] = [
  { valore: "none", etichetta: "Non specificata" },
  { valore: "entro_20km", etichetta: "Entro 20 km" },
  { valore: "20_40km", etichetta: "20-40 km" },
  { valore: "40_70km", etichetta: "40-70 km" },
  { valore: "oltre_70km", etichetta: "Oltre 70 km" },
];

/** I predefiniti del prodotto per chi non li ha ancora impostati in Impostazioni; i cursori vanno 0-30 e 0-25. */
export const SPESE_GENERALI = 15;
export const UTILE = 10;
export const SPESE_GENERALI_MAX = 30;
export const UTILE_MAX = 25;

// 2.000 caratteri (Raffaele, 10/10): il 09/10 un'impresa ha incollato un capitolato intero e la casella, ferma a 1.000,
// lo tagliava in silenzio a metà parola. Oltre il limite la pagina non taglia: dice di usarla una lavorazione alla volta.
export const VOCE_MAX = 2000;
export const VOCE_TROPPO_LUNGA = "Scrivi una lavorazione alla volta: questa descrizione è troppo lunga.";
export const NOTE_MAX = 800;

export type RichiestaProva = {
  voce: string;
  unita: string;
  quantita: number;
  regione: string;
  tipoLavoro: string;
  committente: string;
  dimensione: string;
  fornitura: string;
  stagione: string;
  vincoliOrari: string;
  urgenza: string;
  accessibilita: string;
  piano: string;
  distanza: string;
  note: string;
  speseGenerali: number;
  utile: number;
};

type Esito<T> = { ok: true; valore: T } | { ok: false; errore: string };

const valoriDi = (elenco: readonly Opzione[]) => elenco.map((e) => e.valore);

function scelta(v: unknown, ammessi: readonly string[], predefinito: string): string | null {
  if (v === undefined || v === null || v === "") return predefinito;
  return typeof v === "string" && ammessi.includes(v) ? v : null;
}

function intero(v: unknown, min: number, max: number, predefinito: number): number | null {
  if (v === undefined || v === null || v === "") return predefinito;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : null;
}

/** La quantità come la scrive un imprenditore: «12», «12,5», «1.250,5». Vuota vale 1, come nel prodotto. */
export function leggiQuantita(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return 1;
  let n: number;
  if (typeof v === "number") n = v;
  else {
    const s = String(v).replace(/\s/g, "");
    if (s.includes(",")) n = Number(s.replace(/\./g, "").replace(",", "."));
    else if (/^\d+\.\d{1,2}$/.test(s)) n = Number(s);
    else n = Number(s.replace(/\./g, ""));
  }
  return Number.isFinite(n) && n >= 0 && n < 10_000_000 ? Math.round(n * 100) / 100 : null;
}

export function validaRichiesta(x: unknown): Esito<RichiestaProva> {
  if (!x || typeof x !== "object") return { ok: false, errore: "Richiesta vuota." };
  const r = x as Record<string, unknown>;
  const voce = typeof r.voce === "string" ? r.voce.trim() : "";
  // Come il prodotto: servono descrizione e regione.
  if (!voce) return { ok: false, errore: "Compila descrizione e regione." };
  if (voce.length > VOCE_MAX) return { ok: false, errore: VOCE_TROPPO_LUNGA };
  const regione = scelta(r.regione, REGIONI, "");
  if (!regione) return { ok: false, errore: "Compila descrizione e regione." };
  const unita = scelta(r.unita, UNITA, "m²");
  const quantita = leggiQuantita(r.quantita);
  if (!unita || quantita === null) return { ok: false, errore: "Unità o quantità non valida." };

  const campi = {
    tipoLavoro: scelta(r.tipoLavoro, valoriDi(TIPI_LAVORO), "nuovo"),
    committente: scelta(r.committente, valoriDi(COMMITTENTI), "privato"),
    dimensione: scelta(r.dimensione, valoriDi(DIMENSIONI), "piccolo"),
    fornitura: scelta(r.fornitura, valoriDi(FORNITURE), "fornitura_posa"),
    stagione: scelta(r.stagione, valoriDi(STAGIONI), "none"),
    vincoliOrari: scelta(r.vincoliOrari, valoriDi(VINCOLI_ORARI), "none"),
    urgenza: scelta(r.urgenza, valoriDi(URGENZE), "none"),
    accessibilita: scelta(r.accessibilita, valoriDi(ACCESSIBILITA), "none"),
    piano: scelta(r.piano, valoriDi(PIANI), "none"),
    distanza: scelta(r.distanza, valoriDi(DISTANZE), "none"),
  };
  if (Object.values(campi).some((v) => v === null)) return { ok: false, errore: "Una delle scelte non è valida." };

  const speseGenerali = intero(r.speseGenerali, 0, SPESE_GENERALI_MAX, SPESE_GENERALI);
  const utile = intero(r.utile, 0, UTILE_MAX, UTILE);
  if (speseGenerali === null || utile === null) return { ok: false, errore: "Spese generali o utile fuori misura." };

  const note = typeof r.note === "string" ? r.note.trim().slice(0, NOTE_MAX) : "";
  return { ok: true, valore: { voce, unita, quantita, regione, ...(campi as Record<keyof typeof campi, string>), note, speseGenerali, utile } };
}

const seDetto = (v: string) => (v === "none" ? undefined : v);

/** Il corpo per `analyze-price`, campo per campo come lo manda `PriceAnalysisInline.tsx` (07/10/2026). */
export function corpoAnalisi(r: RichiestaProva): Record<string, unknown> {
  return {
    description: r.voce,
    unit: r.unita,
    region: r.regione,
    workType: r.tipoLavoro,
    quantity: r.quantita,
    clientType: r.committente,
    projectSize: r.dimensione,
    supplyType: r.fornitura,
    season: seDetto(r.stagione),
    timeConstraints: seDetto(r.vincoliOrari),
    urgency: seDetto(r.urgenza),
    accessibility: seDetto(r.accessibilita),
    floorLevel: seDetto(r.piano),
    travelDistance: seDetto(r.distanza),
    userNotes: r.note || undefined,
    overhead_percent: r.speseGenerali,
    profit_percent: r.utile,
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
  if (!Array.isArray(x) || x.length === 0 || x.length > 8) return null;
  const esito: Risposta[] = [];
  for (const v of x) {
    if (!v || typeof v !== "object") return null;
    const { id, answer } = v as Record<string, unknown>;
    if (typeof id !== "string" || !/^[\w-]{1,40}$/.test(id)) return null;
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
  confidenza: "alta" | "media" | "bassa";
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

/** Le domande come le disegna il prodotto: a scelta se hanno opzioni, altrimenti a risposta scritta. */
export function domandeDa(v: unknown): Domanda[] {
  return elenco(v).slice(0, 6).map((d, i) => {
    const opzioni = Array.isArray(d.options) ? d.options.map((o) => testo(o, 120)).filter(Boolean).slice(0, 6) : [];
    return {
      id: typeof d.id === "string" && /^[\w-]{1,40}$/.test(d.id) ? d.id : `q${i + 1}`,
      testo: testo(d.label, 240),
      tipo: d.type === "choice" && opzioni.length > 0 ? ("scelta" as const) : ("testo" as const),
      opzioni,
    };
  }).filter((d) => d.testo);
}

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

  const confidenza = r.confidence === "alta" || r.confidence === "bassa" ? r.confidence : "media";
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
    note: testo(r.notes, 1500),
    righe: {
      materiali: elenco(r.materials_breakdown).slice(0, 15).map((m) => ({
        nome: testo(m.name, 160),
        quantita: num(m.quantity) ?? 0,
        unita: testo(m.unit, 12),
        prezzo: num(m.unit_price) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.nome),
      manodopera: elenco(r.labor_breakdown).slice(0, 10).map((m) => ({
        categoria: testo(m.category, 120),
        ore: num(m.hours_per_unit) ?? 0,
        costoOrario: num(m.hourly_rate) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.categoria),
      noli: elenco(r.equipment_breakdown).slice(0, 10).map((m) => ({
        tipo: testo(m.type, 160),
        quantita: num(m.quantity) ?? 0,
        costo: num(m.unit_cost) ?? 0,
        subtotale: num(m.subtotal) ?? 0,
      })).filter((m) => m.tipo),
    },
    domande: domandeDa(r.refinement_questions),
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
    confidenza: "media",
    note: "",
    righe: { materiali: [], manodopera: [], noli: [] },
    domande: [],
  };
}

/** Il prezzo coi cursori di spese generali e utile, con la formula del prodotto (`recalculatedPrice`). */
export function prezzoRicalcolato(costoDiretto: number, speseGenerali: number, utile: number): number {
  return costoDiretto * (1 + speseGenerali / 100) * (1 + utile / 100);
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

// ── La nota per il CRM ──────────────────────────────────────────────────────────────────────────────────────────

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

export const etichettaDi = (elenco: readonly Opzione[], v: string) => elenco.find((e) => e.valore === v)?.etichetta ?? v;

export function notaPerIlCrm(p: {
  numero: number;
  richiesta: RichiestaProva;
  analisi: AnalisiMostrata;
  approfondimento?: { risposte: Risposta[]; prezzoPrima: number };
}): string {
  const { richiesta: r, analisi: a } = p;
  const u = r.unita;
  const avanzati = [
    [STAGIONI, r.stagione, "stagione"],
    [VINCOLI_ORARI, r.vincoliOrari, "vincoli"],
    [URGENZE, r.urgenza, "urgenza"],
    [ACCESSIBILITA, r.accessibilita, "accessibilità"],
    [PIANI, r.piano, "piano"],
    [DISTANZE, r.distanza, "distanza"],
  ] as const;
  const righe = [
    p.approfondimento
      ? `Prova dell'analisi prezzi dal sito: approfondimento dell'analisi ${p.numero} di ${MAX_ANALISI}`
      : `Prova dell'analisi prezzi dal sito: analisi ${p.numero} di ${MAX_ANALISI}`,
    `Voce: ${r.voce}`,
    `${r.quantita.toLocaleString("it-IT")} ${u} · ${r.regione} · ${etichettaDi(TIPI_LAVORO, r.tipoLavoro)} · committente ${etichettaDi(COMMITTENTI, r.committente)} · appalto ${etichettaDi(DIMENSIONI, r.dimensione)} · ${etichettaDi(FORNITURE, r.fornitura)}`,
  ];
  const detti = avanzati.filter(([, v]) => v !== "none").map(([elenco, v, nome]) => `${nome} ${etichettaDi(elenco, v).toLowerCase()}`);
  if (detti.length) righe.push(`Parametri avanzati: ${detti.join(" · ")}`);
  if (r.note) righe.push(`Note di cantiere: ${r.note}`);
  righe.push(
    `Prezzo suggerito: ${euro(a.prezzo)}/${u} (spese generali ${r.speseGenerali}%, utile ${r.utile}%)` +
      (a.mercato ? ` · mercato ${euro(a.mercato.basso)} – ${euro(a.mercato.alto)}` : ""),
  );
  if (p.approfondimento) {
    righe.push(`Prima dell'approfondimento: ${euro(p.approfondimento.prezzoPrima)}/${u}`);
    righe.push(`Risposte: ${p.approfondimento.risposte.map((x) => x.answer).join(" · ")}`);
  }
  return righe.join("\n");
}
