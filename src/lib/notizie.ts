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

// Uno spazio che non va a capo (U+00A0) dove l'a capo inganna chi legge dal telefono: dopo «n.», «art.» e simili
// davanti al numero, e fra il giorno e il mese. Il 07/10/2026 a 390 px una riga finiva con «dell'Allegato n.» e quella
// sotto cominciava con «1. Senza,», che sembrava il numero di un passo; e «dal 23» chiudeva la riga con «ottobre 2026»
// sotto (CAN-84). Il testo dell'articolo non cambia: lo fa il modello, per tutti gli articoli.
// Va bene sul testo semplice e sull'HTML di marked: cambia solo il testo a vista, mai dentro un tag, un link o un
// `code`. I metadati, il feed e lo schema JSON-LD restano col testo com'è: si usa solo dove la pagina lo mostra.
const SIGLA = String.raw`(?<![\p{L}\d.])(?:(?:n|nn|art|artt|co|c|lett|par|cap|all|p|pag|pagg|tab|fig|l|d\.lgs|d\.l|d\.m|d\.p\.r|d\.p\.c\.m)\.|dpr|dpcm)`;
const GIORNO = String.raw`(?<![\p{L}\d.,])\d{1,2}[°º]?`;
const MESE = "gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre";
// Fra le due parole può stare un grassetto o un corsivo (`n. **1**`), mai la fine di un paragrafo o un link.
const CHIUDE = String.raw`(?:<\/(?:strong|em|b|i)>)*`;
const APRE = String.raw`(?:<(?:strong|em|b|i)>)*`;
const DA_TENERE_INSIEME = new RegExp(
  String.raw`${SIGLA}${CHIUDE}(\s+)${APRE}(?=\d|\p{Ll}\))|${GIORNO}${CHIUDE}(\s+)${APRE}(?=(?:${MESE})(?!\p{L}))`,
  "giu",
);

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

/** «art. 4», «n. 1», «23 ottobre» restano sulla stessa riga. */
export function tieniInsieme(testo: string): string {
  const vietata = parteVietata(testo);
  return testo.replace(DA_TENERE_INSIEME, (pezzo: string, dopoSigla: string | undefined, dopoGiorno: string | undefined, dove: number) => {
    const spazi = (dopoSigla ?? dopoGiorno)!;
    // Prima degli spazi ci sono solo la sigla (o il giorno) e i tag che chiudono: il primo spazio è il loro.
    const i = pezzo.search(/\s/);
    if (vietata[dove + i]) return pezzo;
    return pezzo.slice(0, i) + "\u00a0" + pezzo.slice(i + spazi.length);
  });
}

const NUMERO = /^[+\-\u2212\u2013]?\s*(\u20ac\s*)?\d[\d.,\s]*(%|\u20ac|\s?punti)?$/;

// Le colonne fatte solo di numeri si allineano a destra e con le cifre della stessa larghezza, cos\u00ec sul telefono si
// confrontano a colpo d'occhio. La tabella sta in un contenitore che scorre se proprio non ci sta.
function tabelle(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (_, dentro: string) => {
    const righe = [...dentro.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<(t[hd])([^>]*)>([\s\S]*?)<\/\1>/g)]);
    const colonne = Math.max(0, ...righe.map((r) => r.length));
    const numeriche = Array.from({ length: colonne }, (_, c) => {
      const celle = righe.flatMap((r) => (r[c] && r[c][1] === "td" ? [decodifica(r[c][3].replace(/<[^>]+>/g, "")).trim()] : []));
      return c > 0 && celle.length > 0 && celle.every((t) => t === "" || NUMERO.test(t));
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

function dividi(html: string): Sezione[] {
  const pezzi = tabelle(html).split(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const sezioni: Sezione[] = [];
  if (pezzi[0].trim()) sezioni.push({ id: "apertura", titolo: null, html: pezzi[0], tipo: "testo" });
  for (let i = 1; i < pezzi.length; i += 2) {
    const titolo = decodifica(pezzi[i].replace(/<[^>]+>/g, "")).trim();
    const t = titolo.toLowerCase();
    const tipo = t.startsWith("cosa cambia") ? "cambia" : t.startsWith("cosa fare") ? "fare" : "testo";
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
