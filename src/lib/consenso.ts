/**
 * Consenso al tracciamento.
 *
 * Regola: **niente tracciamento di terze parti prima di un sì esplicito.** Gli script
 * che identificano le persone (Salesflow, e in futuro il pixel Meta) si caricano solo
 * dopo che l'utente ha accettato, e non partono affatto se rifiuta o se non risponde.
 *
 * Cosa NON passa da qui, perché non serve consenso:
 * - la memoria tecnica del sito (`ch-consenso`, `ch-provenienza`)
 * - Vercel Web Analytics, che non usa cookie e non profila
 */

const CHIAVE = "ch-consenso";

/** Cambio di scelta: chi carica script si mette in ascolto per reagire senza ricaricare. */
export const EVENTO_CONSENSO = "ch-consenso-cambiato";

export type Consenso = "accettato" | "rifiutato" | null;

/** `null` = non ha ancora scelto. Va trattato come un no, non come un sì implicito. */
export function leggiConsenso(): Consenso {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CHIAVE);
    return v === "accettato" || v === "rifiutato" ? v : null;
  } catch {
    // Storage negato (navigazione privata): nessun consenso registrabile,
    // quindi nessun tracciamento. È il comportamento corretto, non un errore.
    return null;
  }
}

export function salvaConsenso(scelta: "accettato" | "rifiutato"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHIAVE, scelta);
  } catch {
    // Se non si può scrivere, la scelta vale per questa pagina e basta:
    // meglio che perderla, e comunque senza consenso non si carica nulla.
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENSO, { detail: scelta }));
}

/**
 * Torna allo stato "non ha scelto" e ricarica.
 *
 * La ricarica non è pigrizia: uno script di tracciamento già caricato non si può
 * "scaricare", ha già i suoi ascoltatori attaccati alla pagina. L'unico modo onesto
 * di far valere una revoca subito è ripartire da una pagina dove non c'è.
 */
export function revocaConsenso(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHIAVE);
  } catch {
    /* niente da fare */
  }
  window.location.reload();
}
