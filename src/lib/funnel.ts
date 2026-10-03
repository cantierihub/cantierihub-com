/**
 * La provenienza «da una notizia» di chi si candida per la demo (funnel delle Notizie, 03/10/2026).
 *
 * Chi arriva dal blocco in fondo a un articolo atterra su /demo/<prodotto>?da=<slug>. Il modulo rimanda lo slug al
 * server, e il server:
 * - aggiunge al contatto l'etichetta «notizie», così nel CRM si filtrano i lead che vengono dagli articoli;
 * - scrive in fondo al messaggio da quale articolo arriva, così il setter sa di cosa ha letto prima di chiamare.
 *
 * Gli UTM restano quelli misurati all'arrivo sul sito (Google, social…): sono il canale. L'articolo è un'altra cosa,
 * il contenuto che lo ha convinto, e per questo non li sovrascrive.
 *
 * Funzioni pure, senza import: si provano con `node --test src/lib/funnel.test.ts`.
 */

/** Uno slug di articolo come quelli della redazione: minuscole, numeri e trattini. Tutto il resto si scarta. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+){1,12}$/;

export function articoloValido(grezzo: unknown): string {
  const s = String(grezzo ?? "").trim().toLowerCase();
  return s.length <= 100 && SLUG.test(s) ? s : "";
}

export const ETICHETTA_NOTIZIE = "notizie";

/** Il messaggio che va nel CRM e nell'email: quello che ha scritto la persona, più la riga sull'articolo. */
export function messaggioConArticolo(messaggio: string, articolo: string, sito = "https://cantierihub.com"): string {
  if (!articolo) return messaggio;
  const riga = `Arriva dalla notizia: ${sito}/notizie/${articolo}`;
  return messaggio ? `${messaggio}\n\n${riga}` : riga;
}
