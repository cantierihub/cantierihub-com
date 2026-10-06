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

/**
 * Nella candidatura il campo libero si chiama così, non «messaggio»: lo script di Salesflow legge i moduli dal nome dei
 * campi, e un «messaggio» con la sola nota potrebbe sovrascrivere quello composto (ruolo + nota + articolo). Non deve
 * essere il nome di nessun campo del CRM (prova in `funnel.test.ts`).
 */
export const NOME_CAMPO_NOTA = "nota";

/** Il messaggio della candidatura, uguale nel browser (campo nascosto per lo script) e sul server. */
export function messaggioCandidatura(ruolo: string, nota: string, articolo: string): string {
  return messaggioConArticolo([ruolo ? `Ruolo: ${ruolo}` : "", nota.trim()].filter(Boolean).join("\n\n"), articolo);
}
