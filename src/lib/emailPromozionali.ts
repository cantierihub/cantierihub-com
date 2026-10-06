/**
 * Le email promozionali solo a chi le ha chieste (Raffaele, 06/10/2026: «casella dappertutto»).
 *
 * Chi chiede una demo o scrive da /contatti ci chiede di essere richiamato, non di ricevere il benvenuto a 15 email:
 * per mandargli email promozionali serve un consenso a parte (art. 130 del Codice privacy; vault, sito-seo,
 * CONFORMITA §1.4 e §3.7, CAN-39). Quindi nel modulo c'è una casella NON spuntata, staccata dal pulsante, e il server
 * mette al contatto una di queste due etichette:
 * - `consenso-email` a chi la spunta;
 * - `senza-consenso-email` a chi no. È questa che il CRM guarda: il benvenuto, dopo la sua prima attesa, fa uscire chi
 *   ce l'ha e non ha anche `consenso-email`.
 *
 * ⛔ Perché due etichette e non una sola. Il benvenuto parte per OGNI contatto nuovo, anche per i lead delle campagne
 * Meta, che una casella non ce l'hanno. Con la sola `consenso-email` il CRM dovrebbe fermare chiunque non l'abbia, e i
 * lead Meta perderebbero il benvenuto. Con l'etichetta del «no» il blocco tocca solo chi ha compilato un modulo del sito.
 * ⛔ Chi ha già `consenso-email` e riscrive senza spuntare la casella resta col suo consenso: non spuntarla una seconda
 * volta non vale come ritiro. Il ritiro passa dal link in fondo a ogni email o da info@ (vedi /privacy).
 *
 * Funzioni pure, senza import: si provano con `node --test src/lib/emailPromozionali.test.ts`.
 */

export const ETICHETTA_CONSENSO_EMAIL = "consenso-email";
export const ETICHETTA_SENZA_CONSENSO_EMAIL = "senza-consenso-email";

/**
 * Il nome della casella nel modulo. Lo script di Salesflow legge i moduli dal nome dei campi: questo non deve essere il
 * nome di nessun campo del CRM (prova in `emailPromozionali.test.ts`). Il consenso al CRM lo porta il server, come
 * etichetta.
 */
export const NOME_CAMPO_CONSENSO_EMAIL = "consenso_email";

/** Il testo accanto alla casella (CONFORMITA §3.7). Uguale su /contatti e sulla demo. */
export const TESTO_CONSENSO_EMAIL =
  "Voglio ricevere via email consigli e novità sui prodotti di Cantieri Hub. Posso smettere quando voglio.";

/** Vale come consenso solo un `true` vero: una stringa, un numero o un campo che manca (modulo vecchio in cache) no. */
export function consensoEmailDato(grezzo: unknown): boolean {
  return grezzo === true;
}

export function etichettaConsensoEmail(consenso: boolean): string {
  return consenso ? ETICHETTA_CONSENSO_EMAIL : ETICHETTA_SENZA_CONSENSO_EMAIL;
}
