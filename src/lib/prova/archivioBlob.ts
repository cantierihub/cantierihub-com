import { BlobError, BlobPreconditionFailedError, BlobStoreNotFoundError, BlobStoreSuspendedError, del, get, list, put } from "@vercel/blob";
import { scaduta, type Archivio } from "./limiti";

/**
 * L'archivio del limite delle prove su Vercel Blob (08/10/2026): uno store PRIVATO collegato al progetto `sito-web`,
 * che porta da solo `BLOB_READ_WRITE_TOKEN` nelle variabili. Le due scritture condizionate sono quelle dell'SDK:
 * `allowOverwrite: false` rifiuta un percorso che esiste già, `ifMatch` rifiuta una scheda cambiata dopo la lettura.
 * Le letture saltano la cache (`useCache: false`): un conteggio vecchio di un minuto farebbe passare una prova in più.
 */

const OPZIONI = { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 } as const;

/**
 * Due scritture condizionate sulla stessa scheda nello stesso istante: il servizio non dice «precondition failed», dice
 * «The conditional request cannot succeed due to a conflicting operation» (visto il 08/10 con una raffica di 10 dalla
 * stessa connessione). È la stessa cosa, «qualcuno ha scritto prima di te»: si rilegge e si riprova.
 */
const conflitto = (e: unknown) => e instanceof BlobError && /conflicting operation/i.test(e.message);

export const archivioBlobConfigurato = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Lo store sospeso (sul piano gratuito di Vercel, finita la quota del mese) o sparito: non è «riprova fra un minuto»,
 * è la prova ferma. La pagina lo dice e manda su WhatsApp.
 */
export const archivioFermo = (e: unknown) => e instanceof BlobStoreSuspendedError || e instanceof BlobStoreNotFoundError;

export const archivioBlob: Archivio = {
  async leggi(percorso) {
    const r = await get(percorso, { access: "private", useCache: false });
    if (!r || r.statusCode !== 200) return null;
    const testo = await new Response(r.stream).text();
    let dati: unknown = null;
    try {
      dati = JSON.parse(testo);
    } catch {
      // Una scheda rovinata vale vuota per la lettura, ma la sua versione resta: la prossima scrittura la sostituisce.
    }
    return { dati, etag: r.blob.etag };
  },

  async crea(percorso, dati) {
    try {
      await put(percorso, JSON.stringify(dati), { ...OPZIONI, allowOverwrite: false });
      return true;
    } catch (e) {
      // Il servizio risponde «bad_request» con «This blob already exists…»: l'SDK lo passa come BlobError col messaggio.
      if ((e instanceof BlobError && /already exists/i.test(e.message)) || conflitto(e)) return false;
      throw e;
    }
  },

  async sostituisci(percorso, dati, etag) {
    try {
      await put(percorso, JSON.stringify(dati), { ...OPZIONI, ifMatch: etag });
      return true;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError || conflitto(e)) return false;
      throw e;
    }
  },
};

/** La pulizia di ogni notte: toglie le schede scadute (vedi `scaduta` in limiti.ts), a gruppi di 100. */
export async function pulisciArchivio(ora: number): Promise<{ guardate: number; cancellate: number }> {
  const via: string[] = [];
  let guardate = 0;
  let cursore: string | undefined;
  do {
    const pagina = await list({ prefix: "prova/", cursor: cursore, limit: 1000 });
    guardate += pagina.blobs.length;
    for (const b of pagina.blobs) if (scaduta(b.pathname, b.uploadedAt.getTime(), ora)) via.push(b.url);
    cursore = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursore);
  for (let i = 0; i < via.length; i += 100) await del(via.slice(i, i + 100));
  return { guardate, cancellate: via.length };
}
