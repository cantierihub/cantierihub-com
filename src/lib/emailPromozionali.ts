/**
 * Le email promozionali (il benvenuto a 15 email e gli altri flussi di marketing del CRM): chi lascia i dati in un
 * modulo del sito le riceve, e lo legge PRIMA di inviare, sopra il pulsante.
 *
 * Raffaele, 06/10/2026: «io non voglio che debbano scegliere». Quindi niente casella: la frase dice chiaro che con la
 * richiesta arrivano anche le nostre email, e come smettere. Vale per /contatti, per la candidatura alla demo e per le
 * guide gratuite, con lo stesso testo.
 *
 * ⛔ La Conformità consigliava la casella non spuntata (vault, sito-seo, CONFORMITA §3.7, CAN-39): per l'art. 130 del
 * Codice privacy le email promozionali a chi non è cliente vogliono un consenso a parte. La frase è la versione più
 * difendibile della scelta di Raffaele, non una garanzia: va fatta confermare al legale (CONFORMITA §5, domanda 7).
 * ⛔ Per questo la frase sta SOPRA il pulsante, si legge senza ingrandire e non si accorcia: deve dire tutte e due le
 * cose, che arrivano le email e che si smette con un clic. La privacy (`/privacy`) dice lo stesso.
 *
 * Il 06/10 c'era stata per un'ora la casella con le etichette `consenso-email` / `senza-consenso-email`: tolta prima
 * di andare online, nel CRM non esiste nessuna delle due.
 */

export const TESTO_EMAIL_PROMOZIONALI =
  "Lasciando i tuoi dati ricevi anche le nostre email con consigli e novità. Puoi smettere quando vuoi con un clic.";
