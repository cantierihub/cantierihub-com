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
  rimaste,
  validaRichiesta,
  validaRisposte,
  type Conteggio,
} from "@/lib/prova/analisi";
import { domandeDiRiserva } from "@/lib/prova/prodotto/priceAnalysisCategories";
import { chiamaAnalisi, provaConfigurata, provaFinta, type EsitoFunzione } from "@/lib/prova/preventivatore";
import { idContatto, proveDelContatto, segnaApprofondimento, segnaProva } from "@/lib/prova/crm";
import {
  FINESTRA_CONTATTO_MS,
  FINESTRA_IP_MS,
  GIORNO_MS,
  archivioInMemoria,
  bloccoIp,
  giornoDi,
  impronta,
  ipDaIntestazioni,
  percorsoContatto,
  percorsoGiorno,
  percorsoIp,
  prenota,
  prenotaGiro,
  restituisci,
  restituisciGiro,
  salvaAnalisi,
  tettoGiorno,
  usate,
  type Archivio,
} from "@/lib/prova/limiti";
import { archivioBlob, archivioBlobConfigurato, archivioFermo } from "@/lib/prova/archivioBlob";

// La prova dell'Analisi Prezzi su /prova/analisi-prezzi (07/10/2026). Regole della richiesta in lib/prova/analisi.ts,
// il limite delle 2 analisi (IP, contatto, cookie, tetto del giorno) in lib/prova/limiti.ts.
// Una prova si prenota prima di chiamare l'AI e si restituisce se l'AI non risponde: un errore non consuma una prova.
// Con l'analisi d'esempio (solo in sviluppo sul Mac) l'archivio è in memoria e nel CRM non si scrive niente.

export const runtime = "nodejs";
// La funzione del Preventivatore impiega decine di secondi; il CRM si aggiorna dopo la risposta (after).
export const maxDuration = 120;
export const dynamic = "force-dynamic";

const COOKIE = "ch_prova_analisi";
const MAX_CORPO = 24 * 1024;

const MESSAGGI = {
  limite: "Le 2 analisi gratuite sono state usate. Le altre voci le vediamo insieme in chiamata, sul tuo computo.",
  // Chi divide la connessione con chi le ha già usate (stesso ufficio, stesso operatore) legge questo, non un'accusa.
  limiteConnessione: "Da questa connessione sono già state fatte le 2 analisi gratuite. Scrivici su WhatsApp: le altre voci le vediamo insieme, sul tuo computo.",
  limiteApprofondimento: "Nella prova l'approfondimento è uno per analisi. Nel Preventivatore puoi continuare finché la stima non ti torna.",
  "non-configurata": "La prova è ferma in questo momento. Scrivici su WhatsApp: l'analisi te la facciamo vedere noi.",
  esaurita: "Le prove gratuite sono esaurite per oggi. Scrivici su WhatsApp: l'analisi te la facciamo vedere noi.",
  occupata: "Troppe richieste in questo momento. Riprova fra un minuto: questa non è stata contata.",
  lenta: "L'analisi ci ha messo troppo. Questa è contata: se il risultato non ti è arrivato, scrivici su WhatsApp e la facciamo insieme.",
  errore: "L'analisi non è arrivata. Riprova: questa non è stata contata.",
} as const;

type Motivo = keyof typeof MESSAGGI | "non-valida";

function segreto(): string | null {
  if (process.env.PROVA_SEGRETO) return process.env.PROVA_SEGRETO;
  // Senza segreto la prova non parte; solo l'esempio in sviluppo sul Mac usa un segreto che non vale niente.
  return provaFinta() ? "solo-sviluppo-sul-mac" : null;
}

// Sul sito l'archivio è Vercel Blob e senza la prova non parte. Sul Mac è in memoria: con l'esempio, o con
// `PROVA_ARCHIVIO=memoria` per provare la rotta col Preventivatore vero (su Vercel VERCEL c'è sempre: lì non vale).
const memoria = archivioInMemoria();
const memoriaSulMac = () => provaFinta() || (process.env.PROVA_ARCHIVIO === "memoria" && !process.env.VERCEL);
const archivio = (): Archivio | null => (archivioBlobConfigurato() ? archivioBlob : memoriaSulMac() ? memoria : null);

function rifiuto(motivo: Motivo, status: number, extra: Record<string, unknown> = {}, messaggio?: string) {
  return NextResponse.json({ ok: false, motivo, messaggio: messaggio ?? MESSAGGI[motivo as keyof typeof MESSAGGI], ...extra }, { status });
}

/** L'archivio non risponde: di solito è un attimo («riprova»); se lo store è sospeso o sparito, la prova è ferma. */
function erroreArchivio(dove: string, e: unknown) {
  console.error(`[prova] archivio (${dove}):`, e);
  return archivioFermo(e) ? rifiuto("non-configurata", 503) : rifiuto("occupata", 503);
}

function erroreFunzione(e: Extract<EsitoFunzione, { ok: false }>) {
  console.error("[prova] analyze-price:", e.motivo, e.dettaglio);
  return rifiuto(e.motivo, e.motivo === "occupata" ? 429 : e.motivo === "lenta" ? 504 : 503);
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

/** Un'altra pagina non può usare la prova dal browser di chi la visita. Chi chiama senza Origin lo ferma il limite. */
function stessaOrigine(req: NextRequest): boolean {
  const origine = req.headers.get("origin");
  if (!origine) return true;
  try {
    return new URL(origine).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Le schede di chi chiede: la sua connessione e, se è arrivato dal link del CRM, il suo contatto. */
async function schedeDi(req: NextRequest, s: string, contatto: string | null) {
  return {
    ip: percorsoIp(await impronta(`ip|${bloccoIp(ipDaIntestazioni(req.headers))}`, s)),
    contatto: contatto ? percorsoContatto(await impronta(`contatto|${contatto}`, s)) : null,
  };
}

/** Quante prove ha già fatto: il più alto fra cookie, etichette del CRM, connessione e contatto. */
async function giaFatte(a: Archivio, schede: Awaited<ReturnType<typeof schedeDi>>, c: Conteggio, contatto: string | null, ora: number) {
  const [dalCrm, daIp, daContatto] = await Promise.all([
    contatto ? proveDelContatto(contatto) : Promise.resolve(null),
    usate(a, schede.ip, ora, FINESTRA_IP_MS),
    schede.contatto ? usate(a, schede.contatto, ora, FINESTRA_CONTATTO_MS) : Promise.resolve(0),
  ]);
  const altrove = Math.max(c.a.length, dalCrm ?? 0, daContatto);
  return { n: Math.max(altrove, daIp), soloConnessione: daIp >= MAX_ANALISI && altrove < MAX_ANALISI, contattoLetto: dalCrm !== null };
}

export async function GET(req: NextRequest) {
  const s = segreto();
  const a = archivio();
  if (!s || !a || !provaConfigurata()) return NextResponse.json({ ok: true, rimaste: rimaste(0), disponibile: false });
  const c = await leggiConteggio(req.cookies.get(COOKIE)?.value, s);
  const contatto = idContatto(req.nextUrl.searchParams.get("c"));
  try {
    const { n } = await giaFatte(a, await schedeDi(req, s, contatto), c, contatto, Date.now());
    return NextResponse.json({ ok: true, rimaste: rimaste(n), disponibile: true });
  } catch (e) {
    console.error("[prova] archivio (lettura):", e);
    return NextResponse.json({ ok: true, rimaste: rimaste(c.a.length), disponibile: !archivioFermo(e) });
  }
}

export async function POST(req: NextRequest) {
  const s = segreto();
  const a = archivio();
  if (!s || !a || !provaConfigurata()) return rifiuto("non-configurata", 503);
  if (!stessaOrigine(req)) return rifiuto("non-valida", 403, {}, "Richiesta non valida.");

  const lunghezza = Number(req.headers.get("content-length") ?? 0);
  if (lunghezza > MAX_CORPO) return rifiuto("non-valida", 413, {}, "Richiesta troppo lunga.");
  let corpo: Record<string, unknown>;
  try {
    corpo = (await req.json()) as Record<string, unknown>;
  } catch {
    return rifiuto("non-valida", 400, {}, "Richiesta non leggibile.");
  }

  const ora = Date.now();
  const c = await leggiConteggio(req.cookies.get(COOKIE)?.value, s);
  const contatto = idContatto(corpo.contatto);
  const schede = await schedeDi(req, s, contatto);

  // ── Il giro di approfondimento: uno per analisi, sulla voce e sui numeri salvati dal server ──
  if (corpo.fase === "approfondimento") {
    const id = analisiDalBrowser(corpo.analisi)?.id ?? null;
    const risposte = validaRisposte(corpo.risposte);
    if (!id || !risposte) return rifiuto("non-valida", 400, {}, "Rispondi ad almeno una domanda.");

    let giro: Awaited<ReturnType<typeof prenotaGiro>>;
    try {
      giro = await prenotaGiro(a, id);
    } catch (e) {
      return erroreArchivio("approfondimento", e);
    }
    if (giro.esito === "sconosciuta") return rifiuto("non-valida", 400, {}, "Questa analisi non viene dalla prova: rifalla dalla pagina.");
    if (giro.esito === "fatto") return rifiuto("limiteApprofondimento", 429);
    if (giro.esito === "contesa") return rifiuto("occupata", 429);

    const { richiesta: r, base } = giro.scheda;
    const rendi = () => restituisciGiro(a, id).catch((e) => console.error("[prova] restituzione del giro:", e));
    const esito = await chiamaAnalisi(corpoApprofondimento(r, analisiDalBrowser(base)!, risposte));
    if (!esito.ok) {
      if (esito.motivo !== "lenta") await rendi();
      return erroreFunzione(esito);
    }
    const analisi = analisiDaRisposta(esito.json);
    if (!analisi) {
      await rendi();
      return erroreFunzione({ ok: false, motivo: "errore", dettaglio: "approfondimento senza prezzo" });
    }
    analisi.id = id;

    const { n, contattoLetto } = await giaFatte(a, schede, c, contatto, ora).catch(() => ({ n: c.a.length, contattoLetto: false }));
    if (contatto && contattoLetto && !provaFinta()) {
      const numero = Math.max(1, c.a.indexOf(id) + 1);
      const nota = notaPerIlCrm({ numero, richiesta: r, analisi, approfondimento: { risposte, prezzoPrima: base.prezzo } });
      after(() => segnaApprofondimento(contatto, nota));
    }
    return conCookie(NextResponse.json({ ok: true, analisi, rimaste: rimaste(n) }), conApprofondimento(c, id), s);
  }

  // ── L'analisi ──
  const richiesta = validaRichiesta(corpo.richiesta);
  if (!richiesta.ok) return rifiuto("non-valida", 400, {}, richiesta.errore);
  const r = richiesta.valore;

  let fatte: Awaited<ReturnType<typeof giaFatte>>;
  try {
    fatte = await giaFatte(a, schede, c, contatto, ora);
  } catch (e) {
    return erroreArchivio("conteggio", e);
  }
  if (fatte.n >= MAX_ANALISI) return rifiuto("limite", 429, { rimaste: 0 }, fatte.soloConnessione ? MESSAGGI.limiteConnessione : undefined);

  // Il posto si prende in tre schede (connessione, contatto, giorno): se una è piena, si rendono quelle già prese.
  const posto = crypto.randomUUID();
  const prese: string[] = [];
  const rendi = () => Promise.all(prese.map((p) => restituisci(a, p, posto).catch((e) => console.error("[prova] restituzione:", p, e))));
  let dopo = 0;
  try {
    const daIp = await prenota(a, schede.ip, posto, MAX_ANALISI, ora, FINESTRA_IP_MS);
    if (daIp.esito === "piena") return rifiuto("limite", 429, { rimaste: 0 }, MESSAGGI.limiteConnessione);
    if (daIp.esito === "contesa") return rifiuto("occupata", 429);
    prese.push(schede.ip);
    dopo = daIp.dopo;

    if (schede.contatto) {
      const daContatto = await prenota(a, schede.contatto, posto, MAX_ANALISI, ora, FINESTRA_CONTATTO_MS);
      if (daContatto.esito !== "presa") {
        await rendi();
        return daContatto.esito === "piena" ? rifiuto("limite", 429, { rimaste: 0 }) : rifiuto("occupata", 429);
      }
      prese.push(schede.contatto);
      dopo = Math.max(dopo, daContatto.dopo);
    }

    const giorno = percorsoGiorno(giornoDi(ora));
    const delGiorno = await prenota(a, giorno, posto, tettoGiorno(process.env.PROVA_TETTO_GIORNO), ora, 2 * GIORNO_MS);
    if (delGiorno.esito !== "presa") {
      await rendi();
      if (delGiorno.esito === "piena") console.warn("[prova] tetto del giorno raggiunto:", giorno);
      return delGiorno.esito === "piena" ? rifiuto("esaurita", 429) : rifiuto("occupata", 429);
    }
    prese.push(giorno);
  } catch (e) {
    await rendi();
    return erroreArchivio("prenotazione", e);
  }

  const esito = await chiamaAnalisi(corpoAnalisi(r));
  if (!esito.ok) {
    if (esito.motivo !== "lenta") await rendi();
    return erroreFunzione(esito);
  }
  const analisi = analisiDaRisposta(esito.json);
  if (!analisi) {
    await rendi();
    return erroreFunzione({ ok: false, motivo: "errore", dettaglio: "analisi senza prezzo" });
  }
  // Come il prodotto: se l'AI non propone domande, valgono quelle di riserva della categoria.
  if (analisi.domande.length === 0) analisi.domande = domandeDa(domandeDiRiserva(r.voce));

  // La scheda dell'analisi: senza, l'approfondimento non parte (e non parte da numeri rimandati dal browser).
  let approfondibile = !!analisi.id && analisi.domande.length > 0;
  if (analisi.id) {
    const { id, prezzo, costoDiretto, materiali, manodopera, noli } = analisi;
    try {
      await salvaAnalisi(a, { t: ora, richiesta: r, base: { id, prezzo, costoDiretto, materiali, manodopera, noli }, giri: 0 });
    } catch (e) {
      console.error("[prova] archivio (scheda dell'analisi):", e);
      approfondibile = false;
    }
  }

  const numero = Math.max(fatte.n + 1, dopo);
  if (contatto && fatte.contattoLetto && !provaFinta()) {
    const nota = notaPerIlCrm({ numero, richiesta: r, analisi });
    after(() => segnaProva(contatto, { numero, nota }));
  }
  // Il cookie segue le prove di questo telefono; se altrove ne risultano di più, si allinea a quelle.
  let nuovo = conAnalisi(c, analisi.id);
  while (nuovo.a.length < numero) nuovo = { a: [`altrove-${nuovo.a.length + 1}`, ...nuovo.a], r: nuovo.r };

  return conCookie(NextResponse.json({ ok: true, analisi, rimaste: rimaste(numero), approfondibile }), nuovo, s);
}
