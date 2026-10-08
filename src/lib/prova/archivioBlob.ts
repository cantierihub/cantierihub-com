import { BlobError, BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { Archivio } from "./limiti";

/**
 * L'archivio del limite delle prove su Vercel Blob (08/10/2026): uno store PRIVATO collegato al progetto `sito-web`,
 * che porta da solo `BLOB_READ_WRITE_TOKEN` nelle variabili. Le due scritture condizionate sono quelle dell'SDK:
 * `allowOverwrite: false` rifiuta un percorso che esiste già, `ifMatch` rifiuta una scheda cambiata dopo la lettura.
 * Le letture saltano la cache (`useCache: false`): un conteggio vecchio di un minuto farebbe passare una prova in più.
 */

const OPZIONI = { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 } as const;

export const archivioBlobConfigurato = () => !!process.env.BLOB_READ_WRITE_TOKEN;

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
      if (e instanceof BlobError && /already exists/i.test(e.message)) return false;
      throw e;
    }
  },

  async sostituisci(percorso, dati, etag) {
    try {
      await put(percorso, JSON.stringify(dati), { ...OPZIONI, ifMatch: etag });
      return true;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) return false;
      throw e;
    }
  },
};
