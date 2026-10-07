/**
 * Il sito chiama l'Analisi Prezzi del Preventivatore come «Account demo del sito» (07/10/2026).
 *
 * La funzione `analyze-price` vuole un utente vero con un'azienda e dei crediti: il server del sito entra con email e
 * password dell'account demo (variabili sotto), tiene il token finché vale e lo rinnova da solo. I crediti
 * dell'account sono il tetto della spesa: finiti quelli, la prova si ferma per tutti e la pagina lo dice.
 *
 * Variabili su Vercel (mai nel repo):
 * - `PROVA_DEMO_EMAIL`, `PROVA_DEMO_PASSWORD`: l'account demo nel Preventivatore (azienda interna, crediti suoi);
 * - `PROVA_SUPABASE_ANON_KEY`: la chiave pubblica del Preventivatore (è quella che il browser del prodotto già usa);
 * - `PROVA_SUPABASE_URL`: facoltativa, il progetto del Preventivatore.
 *
 * L'ESEMPIO: torna sempre la stessa analisi vera fatta da un account interno (`esempioSviluppo.ts`), senza chiamare
 * niente. Vale in sviluppo con `PROVA_FINTA=1`, e da solo nelle anteprime di Vercel finché l'account demo non è
 * collegato: così le pagine si guardano dal telefono prima di accendere la prova. La pagina lo dice con un avviso.
 * In produzione (cantierihub.com) l'esempio non parte mai.
 */

import { ESEMPIO_ANALISI } from "./esempioSviluppo";

const URL_PREDEFINITO = "https://ktinttmharmlitfiqccb.supabase.co";
/** La funzione impiega di solito decine di secondi: oltre questo tempo si lascia perdere e si dice di riprovare. */
const ATTESA_MAX_MS = 100_000;

export type EsitoFunzione =
  | { ok: true; json: unknown }
  | { ok: false; motivo: "non-configurata" | "esaurita" | "occupata" | "errore"; dettaglio: string };

type Sessione = { token: string; scade: number };
let sessione: Sessione | null = null;

function configurazione() {
  const url = process.env.PROVA_SUPABASE_URL || URL_PREDEFINITO;
  const chiave = process.env.PROVA_SUPABASE_ANON_KEY;
  const email = process.env.PROVA_DEMO_EMAIL;
  const password = process.env.PROVA_DEMO_PASSWORD;
  if (!chiave || !email || !password) return null;
  return { url, chiave, email, password };
}

export const provaFinta = () =>
  (process.env.PROVA_FINTA === "1" && process.env.NODE_ENV !== "production") ||
  (process.env.VERCEL_ENV === "preview" && configurazione() === null);

export const provaConfigurata = () => provaFinta() || configurazione() !== null;

async function entra(c: NonNullable<ReturnType<typeof configurazione>>): Promise<string> {
  if (sessione && sessione.scade > Date.now() + 60_000) return sessione.token;
  const risposta = await fetch(`${c.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: c.chiave, "Content-Type": "application/json" },
    body: JSON.stringify({ email: c.email, password: c.password }),
    signal: AbortSignal.timeout(10_000),
  });
  const dati = (await risposta.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
  if (!risposta.ok || !dati.access_token) throw new Error(`accesso dell'account demo rifiutato: ${risposta.status}`);
  sessione = { token: dati.access_token, scade: Date.now() + (dati.expires_in ?? 3600) * 1000 };
  return sessione.token;
}

export async function chiamaAnalisi(corpo: Record<string, unknown>): Promise<EsitoFunzione> {
  if (provaFinta()) {
    await new Promise((r) => setTimeout(r, 2500));
    return { ok: true, json: esempioFinto(corpo) };
  }
  const c = configurazione();
  if (!c) return { ok: false, motivo: "non-configurata", dettaglio: "variabili PROVA_* mancanti" };

  for (let tentativo = 0; tentativo < 2; tentativo++) {
    try {
      const token = await entra(c);
      const risposta = await fetch(`${c.url}/functions/v1/analyze-price`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, apikey: c.chiave, "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
        signal: AbortSignal.timeout(ATTESA_MAX_MS),
      });
      const json = await risposta.json().catch(() => null);
      if (risposta.ok) return { ok: true, json };
      // Token scaduto prima del previsto: si rientra una volta.
      if (risposta.status === 401 && tentativo === 0) {
        sessione = null;
        continue;
      }
      const errore = String((json as { error?: unknown } | null)?.error ?? "");
      if (risposta.status === 403 && errore === "insufficient_credits") return { ok: false, motivo: "esaurita", dettaglio: errore };
      if (risposta.status === 429 || risposta.status === 503) return { ok: false, motivo: "occupata", dettaglio: errore };
      return { ok: false, motivo: "errore", dettaglio: `${risposta.status} ${errore}`.trim() };
    } catch (e) {
      return { ok: false, motivo: "errore", dettaglio: String(e) };
    }
  }
  return { ok: false, motivo: "errore", dettaglio: "accesso non riuscito" };
}

/** Solo in sviluppo: l'esempio vero, con un id nuovo; nell'approfondimento il prezzo cambia un poco e le domande no. */
function esempioFinto(corpo: Record<string, unknown>): unknown {
  const analisi = { ...ESEMPIO_ANALISI, analisi_id: crypto.randomUUID() };
  if (corpo.phase === "refine") {
    const prima = (corpo.original_analysis ?? {}) as { analisi_id?: string };
    return {
      analysis: { ...analisi, analisi_id: prima.analisi_id ?? analisi.analisi_id, suggested_price: 95.4, refinement_questions: [] },
      delta_percent: 4.1,
    };
  }
  return { analysis: analisi };
}
