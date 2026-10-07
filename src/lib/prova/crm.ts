/**
 * La prova dell'Analisi Prezzi nel contatto Salesflow (07/10/2026).
 *
 * Il link che il flusso del CRM manda su WhatsApp porta il contatto: `cantierihub.com/prova/analisi-prezzi?c={{contact.id}}`.
 * Con quello, ogni analisi fatta sulla pagina lascia nel contatto:
 * - le etichette `prova-analisi` (ha provato) e, alla seconda, `prova-analisi-2` (ha finito le prove);
 * - una nota con voce, parametri del cantiere e prezzo uscito: il setter apre la chiamata da lì.
 *
 * Le etichette contano anche le prove: chi ha `prova-analisi-2` non ne fa altre, nemmeno da un altro telefono.
 * Senza `c`, o se il contatto non si trova, la prova funziona lo stesso col solo cookie e nel CRM non arriva niente.
 * Un errore del CRM non ferma mai l'analisi: si scrive nel log e basta.
 *
 * ⛔ Le etichette si AGGIUNGONO con `POST contacts/{id}/tags`: un `PUT` del contatto con `tags` sostituirebbe l'elenco
 * e cancellerebbe quelle del CRM (stessa regola di `lib/salesflow.ts`).
 */

const BASE = "https://services.leadconnectorhq.com";
const VERSIONE_API = "2021-07-28";
const TIMEOUT_MS = 6000;

export const ETICHETTA_PROVATA = "prova-analisi";
export const ETICHETTA_FINITE = "prova-analisi-2";

/** Gli id dei contatti di Salesflow sono lettere e cifre (20 di solito): altro non si manda nemmeno al CRM. */
export function idContatto(v: unknown): string | null {
  return typeof v === "string" && /^[A-Za-z0-9]{12,40}$/.test(v) ? v : null;
}

async function chiama(metodo: "GET" | "POST", percorso: string, corpo?: unknown): Promise<unknown> {
  const token = process.env.SALESFLOW_PIT;
  if (!token) throw new Error("SALESFLOW_PIT mancante");
  const risposta = await fetch(`${BASE}/${percorso}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${token}`, Version: VERSIONE_API, Accept: "application/json", "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const testo = await risposta.text();
  if (!risposta.ok) throw new Error(`${metodo} ${percorso}: ${risposta.status} ${testo.slice(0, 200)}`);
  return testo ? JSON.parse(testo) : {};
}

/**
 * Quante prove ha già fatto il contatto, dalle sue etichette: 0, 1 o 2. `null` se il contatto non si legge (id
 * inventato, CRM giù, chiave mancante): in quel caso vale solo il cookie.
 */
export async function proveDelContatto(id: string): Promise<number | null> {
  try {
    const dati = (await chiama("GET", `contacts/${id}`)) as { contact?: { tags?: unknown } };
    const etichette = Array.isArray(dati.contact?.tags) ? dati.contact.tags.map((t) => String(t).toLowerCase()) : null;
    if (!etichette) return null;
    if (etichette.includes(ETICHETTA_FINITE)) return 2;
    return etichette.includes(ETICHETTA_PROVATA) ? 1 : 0;
  } catch (e) {
    console.error("[prova] contatto non letto:", String(e));
    return null;
  }
}

export async function segnaProva(id: string, p: { numero: number; nota: string }): Promise<void> {
  const etichette = [ETICHETTA_PROVATA, ...(p.numero >= 2 ? [ETICHETTA_FINITE] : [])];
  const esiti = await Promise.allSettled([
    chiama("POST", `contacts/${id}/tags`, { tags: etichette }),
    chiama("POST", `contacts/${id}/notes`, { body: p.nota }),
  ]);
  for (const e of esiti) if (e.status === "rejected") console.error("[prova] CRM non aggiornato:", String(e.reason));
}

export async function segnaApprofondimento(id: string, nota: string): Promise<void> {
  try {
    await chiama("POST", `contacts/${id}/notes`, { body: nota });
  } catch (e) {
    console.error("[prova] nota dell'approfondimento non scritta:", String(e));
  }
}
