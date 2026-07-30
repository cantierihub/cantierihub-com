/**
 * Meta Pixel.
 *
 * Pixel **CantieriHub**, id `2680874308975622`, creato il 23/07/2026. Fino al 30/07 non
 * aveva mai ricevuto un evento perché non era installato da nessuna parte.
 *
 * ⚠️ **Si carica solo dopo un sì esplicito** (`lib/consenso.ts`). È pubblicità: senza
 * consenso non deve nemmeno essere scaricato. Vedi la pagina `/cookie`, che lo dichiara.
 *
 * Cosa mandiamo a Meta: la visualizzazione di pagina e, quando qualcuno invia il modulo
 * contatti, un evento `Lead` con il **solo nome del prodotto** richiesto. Niente nome,
 * niente email, niente telefono, niente testo del messaggio: quei dati restano fra noi e
 * il CRM, e a Meta non servono per ottimizzare.
 */

export const ID_PIXEL = "2680874308975622";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Inserisce lo snippet ufficiale di Meta e registra la prima visualizzazione. */
export function caricaPixelMeta(): void {
  if (typeof window === "undefined") return;
  if (window.fbq) return; // già caricato: non si inizializza due volte

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const f = window as any;
  const n: Fbq = function (...args: unknown[]) {
    n.callMethod ? n.callMethod(...args) : n.queue!.push(args);
  } as Fbq;
  if (!f._fbq) f._fbq = n;
  n.queue = [];
  n.loaded = true;
  n.version = "2.0";
  f.fbq = n;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq!("init", ID_PIXEL);
  window.fbq!("track", "PageView");
}

/**
 * Segnala una richiesta di contatto andata a buon fine.
 *
 * Silenzioso se il pixel non c'è, che è il caso normale di chi ha rifiutato il consenso:
 * un evento non mandato non deve rompere l'invio del modulo.
 */
export function tracciaLead(prodotto?: string): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Lead", prodotto ? { content_name: prodotto } : undefined);
}
