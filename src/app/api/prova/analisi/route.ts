import { NextRequest, NextResponse, after } from "next/server";
import {
  MAX_ANALISI,
  analisiDaRisposta,
  analisiDalBrowser,
  conAnalisi,
  conApprofondimento,
  corpoAnalisi,
  corpoApprofondimento,
  domandeDa,
  firmaConteggio,
  leggiConteggio,
  notaPerIlCrm,
  puoApprofondire,
  rimaste,
  validaRichiesta,
  validaRisposte,
  type Conteggio,
} from "@/lib/prova/analisi";
import { domandeDiRiserva } from "@/lib/prova/prodotto/priceAnalysisCategories";
import { chiamaAnalisi, provaConfigurata, provaFinta, type EsitoFunzione } from "@/lib/prova/preventivatore";
import { idContatto, proveDelContatto, segnaApprofondimento, segnaProva } from "@/lib/prova/crm";

// La prova dell'Analisi Prezzi su /prova/analisi-prezzi (07/10/2026). Regole e motivi in lib/prova/analisi.ts.
// Si conta solo ciò che è riuscito: un errore della funzione non consuma una prova.
// Con l'analisi d'esempio (sviluppo, anteprime) nel CRM non si scrive niente.

export const runtime = "nodejs";
// La funzione del Preventivatore impiega decine di secondi; il CRM si aggiorna dopo la risposta (after).
export const maxDuration = 120;
export const dynamic = "force-dynamic";

const COOKIE = "ch_prova_analisi";
const MAX_CORPO = 24 * 1024;

const MESSAGGI = {
  limite: "Le 2 analisi gratuite sono state usate. Le altre voci le vediamo insieme in chiamata, sul tuo computo.",
  limiteApprofondimento: "Nella prova l'approfondimento è uno per analisi. Nel Preventivatore puoi continuare finché la stima non ti torna.",
  "non-configurata": "La prova è ferma in questo momento. Scrivici su WhatsApp: l'analisi te la facciamo vedere noi.",
  esaurita: "Le prove gratuite sono esaurite per oggi. Scrivici su WhatsApp: l'analisi te la facciamo vedere noi.",
  occupata: "Troppe richieste in questo momento. Riprova fra un minuto: questa non è stata contata.",
  errore: "L'analisi non è arrivata. Riprova: questa non è stata contata.",
} as const;

function segreto(): string | null {
  if (process.env.PROVA_SEGRETO) return process.env.PROVA_SEGRETO;
  // Senza segreto la prova vera non parte; l'esempio (sviluppo, anteprime) sì, con un segreto che non vale niente.
  return provaFinta() ? "solo-esempio-non-in-produzione" : null;
}

function rifiuto(motivo: keyof typeof MESSAGGI | "non-valida", status: number, extra: Record<string, unknown> = {}, messaggio?: string) {
  return NextResponse.json({ ok: false, motivo, messaggio: messaggio ?? MESSAGGI[motivo as keyof typeof MESSAGGI], ...extra }, { status });
}

function erroreFunzione(e: Extract<EsitoFunzione, { ok: false }>) {
  console.error("[prova] analyze-price:", e.motivo, e.dettaglio);
  return rifiuto(e.motivo, e.motivo === "occupata" ? 429 : 503);
}

async function conCookie(risposta: NextResponse, c: Conteggio, s: string) {
  risposta.cookies.set(COOKIE, await firmaConteggio(c, s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/prova",
    maxAge: 60 * 60 * 24 * 90,
  });
  return risposta;
}

/** Quante prove ha già fatto: il più alto fra il cookie e le etichette del contatto (se c'è). */
async function fatte(c: Conteggio, contatto: string | null) {
  const dalContatto = contatto ? await proveDelContatto(contatto) : null;
  return { fatte: Math.max(c.a.length, dalContatto ?? 0), contattoLetto: dalContatto !== null };
}

export async function GET(req: NextRequest) {
  const s = segreto();
  const c = s ? await leggiConteggio(req.cookies.get(COOKIE)?.value, s) : { a: [], r: [] };
  const { fatte: n } = await fatte(c, idContatto(req.nextUrl.searchParams.get("c")));
  return NextResponse.json({ ok: true, rimaste: rimaste(n), disponibile: !!s && provaConfigurata(), esempio: provaFinta() });
}

export async function POST(req: NextRequest) {
  const s = segreto();
  if (!s || !provaConfigurata()) return rifiuto("non-configurata", 503);

  const lunghezza = Number(req.headers.get("content-length") ?? 0);
  if (lunghezza > MAX_CORPO) return rifiuto("non-valida", 413, {}, "Richiesta troppo lunga.");
  let corpo: Record<string, unknown>;
  try {
    corpo = (await req.json()) as Record<string, unknown>;
  } catch {
    return rifiuto("non-valida", 400, {}, "Richiesta non leggibile.");
  }

  const richiesta = validaRichiesta(corpo.richiesta);
  if (!richiesta.ok) return rifiuto("non-valida", 400, {}, richiesta.errore);
  const r = richiesta.valore;

  const c = await leggiConteggio(req.cookies.get(COOKIE)?.value, s);
  const contatto = idContatto(corpo.contatto);
  const { fatte: n, contattoLetto } = await fatte(c, contatto);
  const scriviNelCrm = !!contatto && contattoLetto && !provaFinta();

  // ── Il giro di approfondimento (uno per analisi) ──
  if (corpo.fase === "approfondimento") {
    const prima = analisiDalBrowser(corpo.analisi);
    const risposte = validaRisposte(corpo.risposte);
    if (!prima || !risposte) return rifiuto("non-valida", 400, {}, "Rispondi ad almeno una domanda.");
    if (!puoApprofondire(c, prima.id)) return rifiuto("limiteApprofondimento", 429, { rimaste: rimaste(n) });

    const esito = await chiamaAnalisi(corpoApprofondimento(r, prima, risposte));
    if (!esito.ok) return erroreFunzione(esito);
    const analisi = analisiDaRisposta(esito.json);
    if (!analisi) return erroreFunzione({ ok: false, motivo: "errore", dettaglio: "approfondimento senza prezzo" });
    analisi.id = prima.id;

    if (scriviNelCrm) {
      const numero = Math.max(1, c.a.indexOf(prima.id!) + 1);
      const nota = notaPerIlCrm({ numero, richiesta: r, analisi, approfondimento: { risposte, prezzoPrima: prima.prezzo } });
      after(() => segnaApprofondimento(contatto!, nota));
    }
    return conCookie(NextResponse.json({ ok: true, analisi, rimaste: rimaste(n) }), conApprofondimento(c, prima.id!), s);
  }

  // ── L'analisi ──
  if (n >= MAX_ANALISI) return rifiuto("limite", 429, { rimaste: 0 });

  const esito = await chiamaAnalisi(corpoAnalisi(r));
  if (!esito.ok) return erroreFunzione(esito);
  const analisi = analisiDaRisposta(esito.json);
  if (!analisi) return erroreFunzione({ ok: false, motivo: "errore", dettaglio: "analisi senza prezzo" });
  // Come il prodotto: se l'AI non propone domande, valgono quelle di riserva della categoria.
  if (analisi.domande.length === 0) analisi.domande = domandeDa(domandeDiRiserva(r.voce));

  const numero = n + 1;
  if (scriviNelCrm) {
    const nota = notaPerIlCrm({ numero, richiesta: r, analisi });
    after(() => segnaProva(contatto!, { numero, nota }));
  }
  // Il cookie segue le prove di questo telefono; se il contatto ne aveva già di più, si allinea a quelle.
  let nuovo = conAnalisi(c, analisi.id);
  while (nuovo.a.length < numero) nuovo = { a: [`dal-crm-${nuovo.a.length + 1}`, ...nuovo.a], r: nuovo.r };

  return conCookie(
    NextResponse.json({ ok: true, analisi, rimaste: rimaste(numero), approfondibile: !!analisi.id && analisi.domande.length > 0 }),
    nuovo,
    s,
  );
}
