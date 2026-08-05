/**
 * Provenienza del visitatore: da dove arriva chi compila un form.
 *
 * Il problema che risolve: gli UTM stanno nell'URL solo sulla pagina di atterraggio.
 * Se la persona arriva su /preventivatore da un reel e poi va su /contatti per scrivere,
 * al momento dell'invio l'URL è pulito e la provenienza è persa. Qui la catturiamo al
 * primo arrivo e la teniamo per la durata della scheda.
 *
 * **First-touch:** vince il primo arrivo della sessione. Chi entra da Instagram, esce e
 * rientra da un link non taggato resta attribuito a Instagram.
 *
 * Usiamo `sessionStorage`, non i cookie: si svuota chiudendo la scheda, non segue la
 * persona tra siti diversi né tra sessioni, e non contiene dati personali. Serve solo ad
 * attribuire il form che la persona sta per inviare.
 *
 * La convenzione degli UTM sta nel vault: `Social/MD/Linee guida copy — SEO & GEO.md`.
 */

const CHIAVE = "ch-provenienza";

/** Tetto di sicurezza: i valori arrivano dall'URL, cioè da chiunque. */
const MAX_VALORE = 80;

type Provenienza = {
  source?: string;
  medium?: string;
  campagna?: string;
  contenuto?: string;
  term?: string;
  /** Da dove veniva il browser, quando gli UTM mancano (es. ricerca Google). */
  referrer?: string;
  /** Su quale pagina è atterrato. */
  pagina?: string;
  quando?: string;
};

function pulisci(valore: string | null): string | undefined {
  if (!valore) return undefined;
  const v = valore.trim().slice(0, MAX_VALORE);
  return v || undefined;
}

/**
 * Da chiamare a ogni caricamento di pagina. Se la sessione ha già una provenienza
 * non la tocca (first-touch); se non ce l'ha e c'è qualcosa da registrare, la scrive.
 */
export function catturaProvenienza(): void {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(CHIAVE)) return;

    const params = new URLSearchParams(window.location.search);
    const dati: Provenienza = {
      source: pulisci(params.get("utm_source")),
      medium: pulisci(params.get("utm_medium")),
      campagna: pulisci(params.get("utm_campaign")),
      contenuto: pulisci(params.get("utm_content")),
      term: pulisci(params.get("utm_term")),
    };

    // Senza UTM il referrer è comunque un'informazione: distingue chi ci ha trovato
    // su Google da chi ha digitato l'indirizzo. Ignoriamo i rimbalzi interni.
    if (!dati.source) {
      const ref = document.referrer;
      if (ref && !ref.startsWith(window.location.origin)) {
        dati.referrer = pulisci(new URL(ref).hostname);
      }
    }

    const haQualcosa = dati.source || dati.referrer;
    if (!haQualcosa) return;

    dati.pagina = pulisci(window.location.pathname);
    dati.quando = new Date().toISOString();

    window.sessionStorage.setItem(CHIAVE, JSON.stringify(dati));
  } catch {
    // sessionStorage può essere negato (navigazione privata, impostazioni restrittive).
    // Non è un errore da mostrare: si perde l'attribuzione, il form funziona lo stesso.
  }
}

/**
 * Una riga leggibile da allegare al lead. Stringa vuota se non sappiamo niente:
 * meglio un campo vuoto che un "diretto" inventato.
 */
export function descriviProvenienza(): string {
  if (typeof window === "undefined") return "";

  try {
    const grezzo = window.sessionStorage.getItem(CHIAVE);
    if (!grezzo) return "";

    const d: Provenienza = JSON.parse(grezzo);
    const pezzi: string[] = [];

    if (d.source) pezzi.push(`canale: ${d.source}${d.medium ? ` (${d.medium})` : ""}`);
    else if (d.referrer) pezzi.push(`arrivato da: ${d.referrer}`);

    if (d.campagna) pezzi.push(`campagna: ${d.campagna}`);
    if (d.contenuto) pezzi.push(`contenuto: ${d.contenuto}`);
    if (d.term) pezzi.push(`variante: ${d.term}`);
    if (d.pagina) pezzi.push(`atterrato su: ${d.pagina}`);

    return pezzi.join(" · ");
  } catch {
    return "";
  }
}

/**
 * Gli stessi dati, ma separati uno per uno.
 *
 * `descriviProvenienza()` produce una frase per l'email interna: si legge bene ma non ci
 * si può filtrare sopra. Questi valori finiscono invece nei campi nascosti del modulo, che
 * lo script di Salesflow legge dagli attributi `name` per riversarli nei campi
 * personalizzati del CRM — e su quelli le automazioni possono decidere.
 *
 * Perché serve: l'attribuzione nativa di Salesflow, al momento dell'invio del modulo, dice
 * «Direct traffic». Gli UTM li ha visti solo la pagina di atterraggio, e quella sessione lì
 * il CRM non la collega al contatto. Verificato dal vivo il 05/08/2026: due prove da
 * Instagram, due volte etichetta sbagliata.
 *
 * Quando gli UTM mancano ma il referrer c'è, il referrer diventa la sorgente: è così che
 * chi ci trova su Google risulta Google invece che «non lo sappiamo».
 */
export function valoriProvenienza(): { source: string; medium: string; campagna: string } {
  const vuoto = { source: "", medium: "", campagna: "" };
  if (typeof window === "undefined") return vuoto;

  try {
    const grezzo = window.sessionStorage.getItem(CHIAVE);
    if (!grezzo) return vuoto;

    const d: Provenienza = JSON.parse(grezzo);
    return {
      source: d.source ?? d.referrer ?? "",
      medium: d.medium ?? (d.referrer ? "referral" : ""),
      campagna: d.campagna ?? "",
    };
  } catch {
    return vuoto;
  }
}
