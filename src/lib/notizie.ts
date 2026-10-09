// La sezione «Notizie»: gli articoli della redazione di Cantieri Hub.
//
// Ogni articolo è un file `content/notizie/<slug>.md`: intestazione YAML (titolo, categoria, date, in breve, FAQ,
// fonti, immagine) e corpo in Markdown. Lo prepara la redazione (agenti Paperclip, reparto «Sito») e lo porta qui il
// Pubblicatore con una pull request: niente database, ogni articolo passa da un'anteprima Vercel prima di andare online.
// Procedura: vault, Business/cantieri-hub/sistemi/sito-seo/PUBBLICAZIONE.md.
//
// Le pagine sono statiche: un articolo nuovo arriva online con il deploy della sua pull request.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { PRODOTTO_DELLA_SEZIONE, schedaFunnel, type ProdottoFunnel } from "@/data/funnelNotizie";

export const CATEGORIE = [
  {
    slug: "normative-e-bonus",
    nome: "Normative e bonus",
    breve: "Leggi e decreti per l'edilizia, bonus e detrazioni, fisco dei lavori, titoli edilizi.",
  },
  {
    slug: "sicurezza-e-lavoro",
    nome: "Sicurezza e lavoro",
    breve: "Sicurezza in cantiere, patente a crediti, DURC e congruità, CCNL edile, Cassa Edile, INPS e INAIL.",
  },
  {
    slug: "prezzari-e-costi",
    nome: "Prezzari e costi",
    breve: "Prezzari regionali, costi di costruzione, materiali, revisione prezzi.",
  },
  {
    slug: "appalti-e-incentivi",
    nome: "Appalti e incentivi",
    breve: "Codice dei contratti, gare, PNRR, bandi e incentivi per le imprese.",
  },
  {
    slug: "guide-pratiche",
    nome: "Guide pratiche",
    breve: "Le guide che restano valide: preventivo, computo metrico, margine, contratti, clienti.",
  },
] as const;

export type SlugCategoria = (typeof CATEGORIE)[number]["slug"];

export interface Fonte {
  titolo: string;
  ente: string;
  url: string;
}

/** Le fonti di fila con lo stesso ente, messe insieme: nel riquadro Fonti l'ente si scrive una volta sola, sopra i loro
 *  link (CAN-272). Una guida cita gli articoli uno per uno, e 13 «Normattiva, D.Lgs. 81/2008» uguali erano solo rumore.
 *  L'ordine resta quello del frontmatter; una fonte da sola è un gruppo di uno. */
export function fontiPerEnte(fonti: Fonte[]): Fonte[][] {
  const gruppi: Fonte[][] = [];
  for (const f of fonti) {
    const ultimo = gruppi[gruppi.length - 1];
    if (ultimo && ultimo[0].ente === f.ente) ultimo.push(f);
    else gruppi.push([f]);
  }
  return gruppi;
}

export interface Domanda {
  domanda: string;
  risposta: string;
}

export interface Notizia {
  slug: string;
  titolo: string;
  descrizione: string;
  tipo: "notizia" | "guida";
  categoria: SlugCategoria;
  parolaChiave?: string;
  autore: string;
  dataPubblicazione: string; // AAAA-MM-GG
  dataAggiornamento: string; // AAAA-MM-GG, uguale alla pubblicazione se mai aggiornato
  notaAggiornamento?: string;
  inBreve: string;
  immagine?: string;
  immagineAlt?: string;
  /** La copertina è generata con l'AI: si dichiara a vista (vero se non c'è scritto il contrario). */
  immagineAi: boolean;
  /**
   * La riga «Scritto con l'aiuto dell'intelligenza artificiale…» in alto. Spenta di regola dal 03/10/2026 (basta il
   * riquadro in fondo, CONFORMITA §3.2): si riaccende con `nota_ai_in_alto: true` se un articolo esce senza la
   * lettura completa di Raffaele, perché allora l'esenzione dell'AI Act cade e la dichiarazione va all'inizio.
   */
  notaAiInAlto: boolean;
  /**
   * Il prodotto del blocco «Pubblicità» in fondo all'articolo (funnel delle Notizie). Dal frontmatter `prodotto:`;
   * se manca, quello della sezione; `nessuno` lo spegne (notizie tragiche). `null` = nessun blocco.
   */
  prodotto: ProdottoFunnel | null;
  /** La frase d'aggancio del blocco, se l'articolo ne ha una sua (`gancio:`); se no vale il titolo fisso del prodotto. */
  gancio?: string;
  fonti: Fonte[];
  faq: Domanda[];
  sezioni: Sezione[];
  minutiLettura: number;
}

/** Il corpo diviso ai sottotitoli H2. Le due sezioni di valore aggiunto si disegnano come riquadri. */
export interface Sezione {
  id: string;
  titolo: string | null;
  html: string;
  tipo: "testo" | "cambia" | "fare";
}

function idDa(titolo: string): string {
  return titolo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// marked scrive l'apostrofo come `&#39;`. Il titolo di una sezione esce dall'HTML e React lo stampa come testo: senza
// questa decodifica il lettore vedeva \u00abdell&#39;industria\u00bb (anteprima del 03/10/2026).
const ENTITA: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
export function decodifica(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tutto, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : tutto;
    }
    return ENTITA[e.toLowerCase()] ?? tutto;
  });
}

// Uno spazio che non va a capo (U+00A0) dove l'a capo inganna chi legge dal telefono. Il 07/10/2026 a 390 px una riga
// finiva con «dell'Allegato n.» e quella sotto cominciava con «1. Senza,», che sembrava il numero di un passo; e «dal 23»
// chiudeva la riga con «ottobre 2026» sotto (CAN-84). L'08/10, nella guida sul computo metrico, si spezzavano
// «20,25 / m²», «porta di 0,80 / × 2,10 m», «la DGR n. / XII/6071» e «Allegato / I.7» (CAN-164).
// Il testo dell'articolo non cambia: lo fa il modello, per tutti gli articoli.
// Va bene sul testo semplice e sull'HTML di marked: cambia solo il testo a vista, mai dentro un tag, un link o un
// `code`. I metadati, il feed e lo schema JSON-LD restano col testo com'è: si usa solo dove la pagina lo mostra.

// Fra le due parti può stare un grassetto o un corsivo (`n. **1**`), mai la fine di un paragrafo o un link.
const CHIUDE = String.raw`(?:<\/(?:strong|em|b|i)>)*`;
const APRE = String.raw`(?:<(?:strong|em|b|i)>)*`;
/** Gli spazi fra `prima` e `dopo`: la regola trova solo loro, il resto è il contesto. */
const fra = (prima: string, dopo: string, flag: string) =>
  new RegExp(String.raw`(?<=${prima}${CHIUDE})\s+(?=${APRE}${dopo})`, flag);

const SIGLA = String.raw`(?<![\p{L}\d.])(?:(?:n|nn|art|artt|co|c|lett|par|cap|all|p|pp|pag|pagg|tab|fig|l|d\.lgs|d\.l|d\.m|d\.p\.r|d\.p\.c\.m)\.|dpr|dpcm|comm[ai]|articol[oi]|punt[oi]|letter[ae])`;
const GIORNO = String.raw`(?<![\p{L}\d.,])\d{1,2}[°º]?`;
const MESE = "gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre";
// Da qui in giù le maiuscole contano: «XII» è un numero romano, «di» no; «t» è una tonnellata, «T» no.
const ROMANO = String.raw`[IVXLCDM]+(?![\p{L}\d])`;
const DAVANTI_AL_ROMANO = String.raw`(?<![\p{L}\d.])(?:[nN]n?\.|[aA]ll\.|[aA]llegat[oi]|[tT]itol[oi]|[cC]ap[oi]|[pP]art[ei]|[sS]ezion[ei]|[lL]ibr[oi])`;
const QUANTITA = String.raw`(?<![\p{L}\d.,])\d+(?:[.,]\d+)*`;
const UNITA = String.raw`(?:m[²³23qcl]?|cm²?|mm|km²?|kg|q|t|kWh?|MWh?|kN|°C|%|€|euro|mila|milion[ei]|miliard[oi])(?![\p{L}\d'’])`;

const REGOLE = [
  // «n. 1», «art. 4», «D.Lgs. 36/2023», «comma 13», «lett. a)»; e le pagine del prezzario scritte «p. -G-»
  fra(SIGLA, String.raw`(?:\d|\p{Ll}\)|-[A-Z\d]{1,3}-)`, "giu"),
  // «23 ottobre», «1° gennaio»
  fra(GIORNO, String.raw`(?:${MESE})(?!\p{L})`, "giu"),
  // «n. XII/6071», «Allegato I.7», «Titolo IV»
  fra(DAVANTI_AL_ROMANO, ROMANO, "gu"),
  // «Allegato A», «Allegato 1»
  fra(String.raw`(?<![\p{L}\d.])[aA]llegat[oi]`, String.raw`(?:[A-Z]\d*(?![\p{L}\d])|\d)`, "gu"),
  // «20,25 m²», «6,11 €», «15 %», «2,5 miliardi»; e «€ 6,11»
  fra(QUANTITA, UNITA, "gu"),
  fra("€", String.raw`\d`, "gu"),
  // Un segno non apre la riga: «0,80 ×», «2,70 =», «4,00 +» restano col numero prima, e «× 2,10» col numero dopo.
  fra(String.raw`[\d)²³%€]`, String.raw`(?:[=+×−÷]\s*|x\s+)[\d(]`, "gu"),
  fra(String.raw`[\d)]\s*[×x]`, String.raw`[\d(]`, "gu"),
];

// Il browser va a capo dopo un trattino, anche fra due cifre. Il 09/10/2026 si leggeva «comma 1-» con «bis)» sotto
// (1440 px) e, nelle Fonti, «a p. -» con «G-,» sotto (390 px, CAN-195); nella tabella delle regioni «DGR 12-» con
// «2656 del» sotto (360 px, CAN-226). Il trattino resta quello di prima, gli si mette dopo un «word joiner» (U+2060):
// non si vede, non occupa spazio e dice al browser di non andare a capo lì. Non il trattino che non va a capo (U+2011):
// Inter e Poppins non l'hanno, e il browser lo prenderebbe da un altro carattere.
const TRATTINI = [
  // «1-bis», «16-ter», «n. 127-quaterdicies», «Allegato II.2-bis», anche con un grassetto in mezzo
  new RegExp(String.raw`(?<=\d${CHIUDE})-(?=${APRE}\p{L})`, "gu"),
  // «DGR 12-2656», «artt. 1-5», «pp. 94-95», «10-15 giorni», «2024-2025», anche col trattino lungo degli intervalli
  // («1–5»). Il meno di «-0,4%» no: davanti non ha una cifra.
  new RegExp(String.raw`(?<=\d${CHIUDE})[-–](?=${APRE}\d)`, "gu"),
  // il primo trattino di «-G-»: il secondo ha dopo la virgola o lo spazio, e lì il browser non va a capo
  /(?<![\p{L}\d])-(?=[A-Z\d]{1,3}-)/gu,
];

/** Ogni regola con quello che mette al posto di ciò che trova. */
type Unione = [RegExp, (trovato: string) => string];
const UNIONI: Unione[] = [
  ...REGOLE.map((r): Unione => [r, () => "\u00a0"]),
  ...TRATTINI.map((r): Unione => [r, (trattino) => trattino + "\u2060"]),
];

// Le parti dell'HTML che non si toccano: i tag (con gli attributi, quindi gli indirizzi) e quello che sta dentro un
// link, un `code` o un `pre`.
function parteVietata(html: string): Uint8Array {
  const vietata = new Uint8Array(html.length);
  let dentro = 0;
  let fine = 0;
  for (const t of html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi)) {
    if (dentro > 0) vietata.fill(1, fine, t.index);
    fine = t.index + t[0].length;
    vietata.fill(1, t.index, fine);
    if (/^(a|code|pre)$/i.test(t[2])) dentro = Math.max(0, dentro + (t[1] ? -1 : 1));
  }
  if (dentro > 0) vietata.fill(1, fine);
  return vietata;
}

/** «art. 4», «n. XII/6071», «23 ottobre», «20,25 m²», «0,80 × 2,10 m», «comma 1-bis», «DGR 12-2656» restano sulla stessa riga. */
export function tieniInsieme(testo: string): string {
  return UNIONI.reduce((t, [regola, unito]) => {
    // La parte vietata si rifà a ogni regola: due spazi diventati uno spostano tutto quello che viene dopo.
    const vietata = parteVietata(t);
    return t.replace(regola, (trovato: string, dove: number) => (vietata[dove] ? trovato : unito(trovato)));
  }, testo);
}

const NUMERO = /^[+\-\u2212\u2013]?\s*(\u20ac\s*)?\d[\d.,\s]*(%|\u20ac|\s?punti)?$/;
// Anche un numero con la sua unit\u00e0 (\u00ab38,82 m\u00b2\u00bb, \u00ab6,11 \u20ac/m\u00b2\u00bb, \u00ab8 ore\u00bb) \u00e8 un numero: cos\u00ec non si spezza fra le due. Il
// 08/10/2026, a 390 px, \u00ab38,82\u00bb e \u00abm\u00b2\u00bb finivano su due righe nella tabella della guida sul computo metrico.
const MISURA = /^\d[\d.,]*\s?(m[\u00b2\u00b323]?|mq|mc|ml|cm|mm|kg|q|t|l|h|ore|giorni|\u20ac\/\s?[a-z\u00b2\u00b3]{1,4})$/i;

// Le colonne fatte solo di numeri si allineano a destra e con le cifre della stessa larghezza, cos\u00ec sul telefono si
// confrontano a colpo d'occhio. La tabella sta in un contenitore che scorre se proprio non ci sta.
function tabelle(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (_, dentro: string) => {
    const righe = [...dentro.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<(t[hd])([^>]*)>([\s\S]*?)<\/\1>/g)]);
    const colonne = Math.max(0, ...righe.map((r) => r.length));
    const numeriche = Array.from({ length: colonne }, (_, c) => {
      const celle = righe.flatMap((r) => (r[c] && r[c][1] === "td" ? [decodifica(r[c][3].replace(/<[^>]+>/g, "")).trim()] : []));
      return c > 0 && celle.length > 0 && celle.every((t) => t === "" || NUMERO.test(t) || MISURA.test(t));
    });
    const nuovo = dentro.replace(/<tr>([\s\S]*?)<\/tr>/g, (_t, celle: string) => {
      let c = -1;
      return `<tr>${celle.replace(/<(t[hd])([^>]*)>/g, (_m, tag: string, attr: string) => {
        c++;
        return numeriche[c] ? `<${tag}${attr} class="num">` : `<${tag}${attr}>`;
      })}</tr>`;
    });
    return `<div class="tabella" role="region" aria-label="Tabella" tabindex="0"><table>${nuovo}</table></div>`;
  });
}

// I riquadri sono due, col titolo esatto e una volta sola (DESIGN.md, «La pagina articolo»). Prima bastava che il
// titolo cominciasse con «Cosa cambia» o «Cosa fare»: «Cosa cambia per gli impiantisti?», a metà articolo, diventava un
// secondo riquadro arancio e toglieva peso a quello vero (controllo visivo del 07/10/2026, CAN-69).
const RIQUADRI: Record<string, Sezione["tipo"]> = {
  "cosa cambia per la tua impresa": "cambia",
  "cosa fare adesso": "fare",
};

function dividi(html: string): Sezione[] {
  const pezzi = tabelle(html).split(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const sezioni: Sezione[] = [];
  if (pezzi[0].trim()) sezioni.push({ id: "apertura", titolo: null, html: pezzi[0], tipo: "testo" });
  for (let i = 1; i < pezzi.length; i += 2) {
    const titolo = decodifica(pezzi[i].replace(/<[^>]+>/g, "")).trim();
    const riquadro = RIQUADRI[titolo.toLowerCase().replace(/\s+/g, " ").replace(/[\s?:.!]+$/, "")];
    const tipo = riquadro && !sezioni.some((s) => s.tipo === riquadro) ? riquadro : "testo";
    sezioni.push({ id: idDa(titolo), titolo, html: pezzi[i + 1] ?? "", tipo });
  }
  return sezioni;
}

const CARTELLA = path.join(process.cwd(), "content", "notizie");

function prodottoDi(valore: unknown, categoria: string, file: string): ProdottoFunnel | null {
  if (valore === undefined || valore === null || valore === "") return PRODOTTO_DELLA_SEZIONE[categoria] ?? null;
  const v = String(valore).trim().toLowerCase();
  if (v === "nessuno") return null;
  const scheda = schedaFunnel(v);
  // Un errore al build è meglio di un blocco pubblicitario sbagliato o vuoto.
  if (!scheda) throw new Error(`content/notizie/${file}: prodotto «${valore}» non valido`);
  return scheda.slug;
}

function data(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "").slice(0, 10);
}

function leggi(file: string): Notizia {
  const grezzo = fs.readFileSync(path.join(CARTELLA, file), "utf8");
  const { data: fm, content } = matter(grezzo);
  const slug = file.replace(/\.md$/, "");
  const categoria = CATEGORIE.find((c) => c.slug === fm.categoria)?.slug;
  if (!categoria) {
    // Un errore al build è meglio di un articolo in una categoria che non esiste.
    throw new Error(`content/notizie/${file}: categoria «${fm.categoria}» non valida`);
  }
  const pubblicazione = data(fm.data_pubblicazione);
  const parole = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    titolo: String(fm.titolo),
    descrizione: String(fm.descrizione),
    tipo: fm.tipo === "guida" ? "guida" : "notizia",
    categoria,
    parolaChiave: fm.parola_chiave,
    autore: fm.autore || "Redazione Cantieri Hub",
    dataPubblicazione: pubblicazione,
    dataAggiornamento: data(fm.data_aggiornamento) || pubblicazione,
    notaAggiornamento: fm.nota_aggiornamento,
    inBreve: String(fm.in_breve ?? ""),
    immagine: fm.immagine,
    immagineAlt: fm.immagine_alt,
    immagineAi: fm.immagine_ai !== false,
    notaAiInAlto: fm.nota_ai_in_alto === true,
    prodotto: prodottoDi(fm.prodotto, categoria, file),
    gancio: fm.gancio ? String(fm.gancio).trim() : undefined,
    fonti: (fm.fonti ?? []) as Fonte[],
    faq: (fm.faq ?? []) as Domanda[],
    sezioni: dividi(tieniInsieme(marked.parse(content, { async: false }) as string)),
    minutiLettura: Math.max(1, Math.round(parole / 200)),
  };
}

let cache: Notizia[] | null = null;

/** Tutte le notizie pubblicate, la più recente in cima. */
export function tutteLeNotizie(): Notizia[] {
  if (cache) return cache;
  const file = fs.existsSync(CARTELLA) ? fs.readdirSync(CARTELLA).filter((f) => f.endsWith(".md")) : [];
  cache = file
    .map(leggi)
    .sort((a, b) => b.dataPubblicazione.localeCompare(a.dataPubblicazione) || a.titolo.localeCompare(b.titolo));
  return cache;
}

export function notiziaDa(slug: string): Notizia | undefined {
  return tutteLeNotizie().find((n) => n.slug === slug);
}

export function categoriaDa(slug: string) {
  return CATEGORIE.find((c) => c.slug === slug);
}

export function notizieDellaCategoria(slug: string): Notizia[] {
  return tutteLeNotizie().filter((n) => n.categoria === slug);
}

/** «2 ottobre 2026» */
export function dataLeggibile(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}
