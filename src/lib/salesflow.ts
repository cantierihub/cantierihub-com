/**
 * Porta nel CRM (Salesflow) chi compila il modulo contatti, direttamente dal server.
 *
 * **Perché serve.** Lo script di tracciamento di Salesflow crea il contatto solo se il
 * visitatore accetta i cookie (`lib/consenso.ts`). Chi non li accettava arrivava solo
 * come email a info@: nessun contatto nel CRM, nessuna card in pipeline, e nessuno se
 * ne accorgeva. È successo il 31/08 e il 09/09/2026. Da qui il lead entra sempre.
 *
 * **Cosa fa.**
 * 1. cerca il contatto per email
 * 2. se non c'è lo crea, già con l'etichetta del prodotto
 * 3. se c'è aggiorna i campi del modulo e aggiunge l'etichetta
 *
 * Il campo «Form inviato il» è quello che fa partire i workflow di Salesflow: card in
 * «Nuovo lead» per chi è nuovo, rientro in pipeline per chi c'era già.
 *
 * ⛔ Le etichette non vanno mai nell'aggiornamento di un contatto esistente: lì `tags`
 * sostituisce l'elenco e cancellerebbe in silenzio quelle messe dal CRM.
 *
 * ⚠️ «Form inviato il» arriva dal modulo (`CampiProvenienza`) ed è lo stesso valore che
 * legge lo script di tracciamento. Se i due valori fossero diversi, per chi accetta i
 * cookie il campo cambierebbe due volte e i workflow partirebbero due volte.
 */

const BASE = "https://services.leadconnectorhq.com";
const VERSIONE_API = "2021-07-28";
const TIMEOUT_MS = 6000;

/** Id dei campi personalizzati su Salesflow: Impostazioni, Campi personalizzati. */
const CAMPO = {
  prodotto: "QQkUmhxTMx91U6ZAzBQf",
  esigenza: "3trEQcWVZgCaegUKI1vw",
  comeCiHaConosciuti: "ki0TdNy1tJ4nrIdlskIV",
  messaggio: "0NCnRtwcjq9Rjsa2DmOu",
  utmSource: "TYczbK0bC2E7vCIDVhZ5",
  utmMedium: "BzgprhfNRjxHPtMdODe6",
  utmCampaign: "4TLIh2GV5Q1IWRRi1nCN",
  formInviatoIl: "hxC84rmJWPCI9Z6mPzFY",
} as const;

/**
 * Il prodotto va nell'etichetta, come per i lead delle campagne, e non nel nome della card.
 * Gestione Cantieri, Marketing e Altro non hanno un'etichetta: restano nel campo
 * «Prodotto richiesto».
 */
const ETICHETTA_PRODOTTO: Record<string, string> = {
  Preventivatore: "preventivatore",
  Computatore: "computatore",
};

export type LeadSito = {
  nome: string;
  cognome: string;
  azienda: string;
  email: string;
  telefono: string;
  prodotto: string;
  motivazione: string;
  canale: string;
  messaggio: string;
  utmSource: string;
  utmMedium: string;
  utmCampagna: string;
  inviatoIl: string;
};

export type EsitoCrm = { ok: true; contactId: string; nuovo: boolean } | { ok: false; errore: string };

type Contatto = { id: string; firstName?: string; lastName?: string; phone?: string; companyName?: string };

export async function portaNelCrm(lead: LeadSito): Promise<EsitoCrm> {
  const token = process.env.SALESFLOW_PIT;
  const locationId = process.env.SALESFLOW_LOCATION_ID;
  if (!token || !locationId) return { ok: false, errore: "SALESFLOW_PIT o SALESFLOW_LOCATION_ID mancanti" };

  const chiama = async (metodo: "GET" | "POST" | "PUT", percorso: string, corpo?: unknown) => {
    const controllo = new AbortController();
    const timer = setTimeout(() => controllo.abort(), TIMEOUT_MS);
    try {
      const risposta = await fetch(`${BASE}/${percorso}`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          Version: VERSIONE_API,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
        signal: controllo.signal,
      });
      const testo = await risposta.text();
      if (!risposta.ok) {
        throw new Error(`${metodo} ${percorso.split("?")[0]}: ${risposta.status} ${testo.slice(0, 200)}`);
      }
      return testo ? JSON.parse(testo) : {};
    } finally {
      clearTimeout(timer);
    }
  };

  const campi = [
    { id: CAMPO.prodotto, field_value: lead.prodotto },
    { id: CAMPO.esigenza, field_value: lead.motivazione },
    { id: CAMPO.comeCiHaConosciuti, field_value: lead.canale },
    { id: CAMPO.messaggio, field_value: lead.messaggio },
    { id: CAMPO.utmSource, field_value: lead.utmSource },
    { id: CAMPO.utmMedium, field_value: lead.utmMedium },
    { id: CAMPO.utmCampaign, field_value: lead.utmCampagna },
    { id: CAMPO.formInviatoIl, field_value: lead.inviatoIl },
  ].filter((c) => c.field_value);
  const etichetta = ETICHETTA_PRODOTTO[lead.prodotto];

  try {
    const duplicato = await chiama(
      "GET",
      `contacts/search/duplicate?locationId=${encodeURIComponent(locationId)}&email=${encodeURIComponent(lead.email)}`,
    );
    const esistente: Contatto | null = duplicato?.contact?.id ? duplicato.contact : null;

    if (esistente) {
      // Si completano i dati che mancano, senza sovrascrivere quelli già sistemati nel CRM.
      const aggiornamento: Record<string, unknown> = { customFields: campi };
      if (!esistente.firstName && lead.nome) aggiornamento.firstName = lead.nome;
      if (!esistente.lastName && lead.cognome) aggiornamento.lastName = lead.cognome;
      if (!esistente.phone && lead.telefono) aggiornamento.phone = lead.telefono;
      if (!esistente.companyName && lead.azienda) aggiornamento.companyName = lead.azienda;
      await chiama("PUT", `contacts/${esistente.id}`, aggiornamento);
      if (etichetta) await chiama("POST", `contacts/${esistente.id}/tags`, { tags: [etichetta] });
      return { ok: true, contactId: esistente.id, nuovo: false };
    }

    const nuovo = {
      locationId,
      firstName: lead.nome,
      lastName: lead.cognome,
      email: lead.email,
      phone: lead.telefono,
      companyName: lead.azienda || undefined,
      source: "Modulo contatti sito",
      customFields: campi,
    };
    try {
      // Creato già con l'etichetta: così un lead del Computatore non entra, nemmeno per un
      // istante, nel benvenuto del Preventivatore.
      const creato = await chiama("POST", "contacts/", { ...nuovo, tags: etichetta ? [etichetta] : [] });
      const id = creato?.contact?.id;
      if (!id) throw new Error("contatto creato ma senza id");
      return { ok: true, contactId: id, nuovo: true };
    } catch (errore) {
      // Stessa persona con un'altra email ma lo stesso telefono: il CRM rifiuta il doppione.
      // L'upsert la ritrova per telefono; l'etichetta si aggiunge a parte.
      if (!/duplicat/i.test(String(errore))) throw errore;
      const unito = await chiama("POST", "contacts/upsert", nuovo);
      const id = unito?.contact?.id;
      if (!id) throw new Error("upsert riuscito ma senza id del contatto");
      if (etichetta) await chiama("POST", `contacts/${id}/tags`, { tags: [etichetta] });
      return { ok: true, contactId: id, nuovo: Boolean(unito?.new) };
    }
  } catch (errore) {
    return { ok: false, errore: String(errore) };
  }
}
