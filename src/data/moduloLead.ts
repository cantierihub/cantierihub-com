/**
 * Domande del modulo lead del sito.
 *
 * Ricalca lo schema dei moduli lead di Meta, ricostruito dai 447 invii reali arrivati in
 * Salesflow: per ogni prodotto due domande di qualifica, una sul **ruolo** e una sul
 * **problema**. Serve al setter per sapere di cosa parlare prima di chiamare.
 *
 * ⚠️ **Etichetta e valore sono due cose diverse, di proposito.** L'utente legge `etichetta`
 * (con la descrizione fra parentesi), ma nel CRM finisce `valore`, che è corto. Il nome del
 * cartellino in Salesflow si compone come «nome contatto - Prodotto richiesto»: se salvassimo
 * la frase intera il commerciale si troverebbe una bacheca di titoli lunghi tre righe.
 *
 * ⚠️ Il `valore` **smista il lead nel CRM**: è un valore, non testo libero. Cambiarlo significa
 * che i lead vecchi e quelli nuovi non si filtrano più insieme.
 */

export const PRODOTTI = [
  {
    valore: "Preventivatore",
    // 03/10/2026: tolto «in 3 minuti» dalle etichette (FONDAMENTA §7.1: la promessa di tempo non è decisa). Il valore,
    // che smista il lead nel CRM, è lo stesso di prima.
    etichetta: "Preventivatore (dal computo metrico al preventivo)",
  },
  {
    valore: "Computatore",
    etichetta: "Computatore (dal sopralluogo al computo metrico)",
  },
  {
    // Aggiunta il 03/10/2026 per il funnel delle Notizie: prima chi arrivava per l'Analisi Prezzi doveva scegliere
    // «Altro». Il campo «Prodotto richiesto» del CRM è testo libero (letto dalla definizione del campo), quindi un
    // valore nuovo non rompe niente: finisce nel nome del cartellino come gli altri.
    valore: "Analisi Prezzi",
    etichetta: "Analisi Prezzi (il prezzo di ogni voce, scomposto in materiali, manodopera e noli)",
  },
  {
    valore: "Gestione Cantieri",
    etichetta: "Gestione Cantieri (soluzione personalizzata, da valutare insieme)",
  },
  {
    valore: "Marketing",
    etichetta: "Marketing (gestione social media, sito web e aumento clienti)",
  },
  {
    valore: "Altro",
    etichetta: "Altro (indicalo nel messaggio)",
  },
] as const;

export type Prodotto = (typeof PRODOTTI)[number]["valore"];

/**
 * Le motivazioni cambiano col prodotto: compare solo quella che serve, così il modulo resta corto.
 *
 * Elenco vuoto = la seconda domanda **non compare**. È il caso di «Altro», dove la richiesta la
 * scrive lui nel messaggio: chiedergli di scegliere fra opzioni che non lo riguardano lo
 * bloccherebbe soltanto.
 */
export const MOTIVAZIONI: Record<Prodotto, readonly string[]> = {
  Preventivatore: [
    "Ci metto troppo tempo a fare i preventivi",
    "Arrivo dopo i concorrenti e perdo il lavoro",
    "Non sono sicuro dei margini che sto facendo",
    "Voglio consegnare preventivi più professionali",
    "Altro",
  ],
  Computatore: [
    "Faccio i computi a mano e ci perdo giornate",
    "Devo trasformare disegni e PDF in un computo",
    "Sbaglio le quantità e me ne accorgo in cantiere",
    "Voglio portare il computo direttamente nel preventivo",
    "Altro",
  ],
  "Analisi Prezzi": [
    "Ho voci fuori prezzario e le stimo a occhio",
    "Voglio sapere quanto mi costa davvero ogni lavorazione",
    "I costi si sono mossi e devo rifare i prezzi",
    "Altro",
  ],
  "Gestione Cantieri": [
    "Non ho controllo su squadre e materiali in cantiere",
    "Non so mai a che punto è davvero l'avanzamento",
    "Devo gestire la sicurezza e i documenti di cantiere",
    "Altro",
  ],
  Marketing: [
    "Il sito non mi porta richieste",
    "Non ho tempo di curare i social",
    "Voglio farmi conoscere nella mia zona",
    "Voglio più richieste di preventivo",
    "Altro",
  ],
  Altro: [],
};

/**
 * Il ruolo di chi compila. Nei moduli lead di Meta c'è, in quello del sito no: lo chiede la pagina della demo delle
 * Notizie, e finisce nel messaggio (nel CRM non c'è un campo apposta).
 */
export const RUOLI = [
  "Titolare dell'impresa",
  "Socio o direttore tecnico",
  "Geometra o tecnico dell'impresa",
  "Progettista o libero professionista",
  "Altro",
] as const;

/**
 * Da dove ci ha conosciuti, dichiarato da lui.
 *
 * È la domanda che vale più di tutte le altre insieme: **cattura quello che gli UTM non
 * possono catturare**, cioè chi vede un reel e ci cerca su Google tre giorni dopo. Nessuna
 * tecnologia riesce a collegare quei due momenti, una persona sì.
 */
export const CANALI = [
  "Campagna pubblicitaria",
  "Video sui social",
  "Ricerca su Google",
  "Passaparola",
  // 03/10/2026: per chi si candida da una notizia del sito. Il campo del CRM è testo libero.
  "Ho letto un articolo sul sito",
  "Altro",
] as const;

/**
 * La scelta del prodotto nella candidatura generale delle Notizie (/demo/cantieri-hub): solo i tre strumenti che la
 * pagina presenta, con etichette pubblicitarie pulite (niente tempi, niente Gestione Cantieri né Marketing).
 * Il `valore` è lo stesso di `PRODOTTI`: il CRM e le etichette non cambiano. «Non lo so ancora» → «Altro», e allora
 * il messaggio diventa obbligatorio, così il setter sa di cosa parlare.
 */
export const PRODOTTI_DEMO: readonly { valore: Prodotto; etichetta: string }[] = [
  { valore: "Computatore", etichetta: "Il computo metrico (Computatore)" },
  { valore: "Analisi Prezzi", etichetta: "Il prezzo di ogni voce (Analisi Prezzi)" },
  { valore: "Preventivatore", etichetta: "Dal computo all'offerta (Preventivatore)" },
  { valore: "Altro", etichetta: "Non lo so ancora: ne parliamo al telefono" },
];
