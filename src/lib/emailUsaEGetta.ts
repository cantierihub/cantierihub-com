/**
 * Caselle di posta usa-e-getta.
 *
 * ── Cosa fa, e cosa NON fa ───────────────────────────────────────────────────
 * Toglie i domini nati apposta per non essere veri: quelli che generano una
 * casella che muore in dieci minuti. **Non** verifica che l'indirizzo sia di chi
 * lo scrive: quello non si può fare al momento in cui viene digitato, si può
 * solo mandare qualcosa e vedere se arriva.
 *
 * ⚠️ **Non si bloccano gmail, libero, hotmail e simili.** Nella nostra nicchia
 * geometri e piccole imprese li usano come indirizzo di lavoro: rifiutarli
 * significherebbe scartare lead veri per prendere quelli finti. Il filtro qui
 * è volutamente stretto.
 *
 * L'elenco è corto di proposito: coprire tutto è impossibile e una lista lunga
 * invecchia male. Questi sono i più diffusi.
 */

const DOMINI_USA_E_GETTA = [
  "mailinator.com",
  "yopmail.com",
  "yopmail.fr",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "sharklasers.com",
  "grr.la",
  "temp-mail.org",
  "tempmail.com",
  "tempr.email",
  "throwawaymail.com",
  "fakeinbox.com",
  "trashmail.com",
  "dispostable.com",
  "maildrop.cc",
  "mailnesia.com",
  "getnada.com",
  "moakt.com",
  "emailondeck.com",
  "mailsac.com",
  "discard.email",
  "spam4.me",
  "mytemp.email",
  "mohmal.com",
  "tempmailo.com",
] as const;

/** Il messaggio da mostrare, uno solo e uguale ovunque. */
export const MESSAGGIO_USA_E_GETTA =
  "Questo indirizzo è una casella temporanea. Scrivine uno che leggi davvero.";

/**
 * `true` se l'indirizzo usa un dominio usa-e-getta.
 * Confronta anche i sottodomini: `x.mailinator.com` conta.
 */
export function eUsaEGetta(email: string): boolean {
  const at = String(email ?? "").trim().toLowerCase().lastIndexOf("@");
  if (at < 0) return false;
  const dominio = email.trim().toLowerCase().slice(at + 1);
  if (!dominio) return false;
  return DOMINI_USA_E_GETTA.some((d) => dominio === d || dominio.endsWith("." + d));
}
