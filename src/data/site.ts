// Costanti condivise del sito Cantieri Hub.
// WhatsApp del setter (stesso numero usato nei flussi email CRM).

// Davide, setter: e il numero di tutte le CTA commerciali del sito.
export const WHATSAPP_NUMBER = "393534843580";

// Dante (CEO): riceve le candidature, non le richieste commerciali.
// Sono due canali distinti, non intercambiabili.
export const WHATSAPP_CANDIDATURE = "393202299841";

/** Costruisce un link wa.me con messaggio precompilato (numero del setter). */
export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Come waLink ma verso Dante: da usare solo per le candidature. */
export function waLinkCandidature(text: string): string {
  return `https://wa.me/${WHATSAPP_CANDIDATURE}?text=${encodeURIComponent(text)}`;
}

// Link WhatsApp pronti, con prefill tarato sul contesto del pulsante.
export const WA_DEMO = waLink("Ciao! Vorrei prenotare una demo gratuita di Cantieri Hub.");
export const WA_GENERALE = waLink("Ciao! Vorrei delle informazioni su Cantieri Hub.");
export const WA_PREVENTIVATORE = waLink("Ciao! Vorrei vedere una demo del Preventivatore AI.");
export const WA_COMPUTATORE = waLink("Ciao! Vorrei vedere una demo del Computatore AI.");
export const WA_ANALISI_PREZZI = waLink("Ciao! Vorrei sapere di più sull'Analisi Prezzi AI di Cantieri Hub.");
export const WA_CALCOLA = waLink("Ciao! Vorrei calcolare un preventivo con l'AI di Cantieri Hub.");

export const WA_CANDIDATURA = waLinkCandidature(
  "Ciao Dante! Vi scrivo per una candidatura: ho visto la pagina Lavora con noi di Cantieri Hub.",
);

export const CONTACT_EMAIL = "info@cantierihub.com";
export const SITE_URL = "https://cantierihub.com";
