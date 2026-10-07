/**
 * I testi della pagina di prova dell'Analisi Prezzi (/prova/analisi-prezzi, 07/10/2026). La pagina si manda su
 * WhatsApp al lead subito dopo la richiesta. Decisi da Raffaele: il titolo, una spiegazione di come si usa, la prova
 * uguale al Preventivatore e sotto «E non finisce qui» con le altre quattro cose dell'app. Niente altro.
 */

export const TITOLO_PROVA = "Prova l'analisi prezzi su una voce tua";

export const COME_SI_USA =
  "Scrivi la lavorazione come la scrivi nel computo, scegli unità, quantità e regione e imposta il cantiere. Premi «Analizza Prezzo»: vedi il costo diviso in materiali, manodopera e noli, il prezzo suggerito e il range di mercato della tua regione. Poi rispondi alle domande sotto il risultato e la stima si ricalcola.";

export const DESCRIZIONE_META =
  "La stessa analisi prezzi del Preventivatore di Cantieri Hub, da provare su una lavorazione tua: materiali, manodopera, noli, spese generali, utile e range di mercato.";

/** «E non finisce qui»: le quattro cose dette da Raffaele, ognuna con una clip muta del programma vero. */
export const ANCHE = [
  { file: "pdf-voci", larghezza: 1046, altezza: 548, testo: "Importare dal tuo PDF, in un minuto, tutta la lista delle voci" },
  { file: "prezzario", larghezza: 1046, altezza: 548, testo: "Abbinare ogni voce al suo prezzo del prezzario regionale" },
  { file: "pdf-finale", larghezza: 1046, altezza: 548, testo: "Stampare con un clic il preventivo completo e professionale" },
  { file: "quadro-economico", larghezza: 840, altezza: 452, testo: "Analizzare con un clic il quadro economico e vedere l'utile che ti resta" },
] as const;

export const MESSAGGIO_WHATSAPP = "Ciao! Ho provato l'analisi prezzi sul sito e vorrei vedere il Preventivatore sul mio computo.";
