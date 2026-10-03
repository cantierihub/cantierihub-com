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

function dividi(html: string): Sezione[] {
  const pezzi = html.split(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const sezioni: Sezione[] = [];
  if (pezzi[0].trim()) sezioni.push({ id: "apertura", titolo: null, html: pezzi[0], tipo: "testo" });
  for (let i = 1; i < pezzi.length; i += 2) {
    const titolo = pezzi[i].replace(/<[^>]+>/g, "").trim();
    const t = titolo.toLowerCase();
    const tipo = t.startsWith("cosa cambia") ? "cambia" : t.startsWith("cosa fare") ? "fare" : "testo";
    sezioni.push({ id: idDa(titolo), titolo, html: pezzi[i + 1] ?? "", tipo });
  }
  return sezioni;
}

const CARTELLA = path.join(process.cwd(), "content", "notizie");

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
    fonti: (fm.fonti ?? []) as Fonte[],
    faq: (fm.faq ?? []) as Domanda[],
    sezioni: dividi(marked.parse(content, { async: false }) as string),
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
