/**
 * Domande del modulo lead del sito.
 *
 * Ricalca lo schema dei moduli lead di Meta, ricostruito dai 447 invii reali arrivati in
 * Salesflow: per ogni prodotto due domande di qualifica, una sul **ruolo** e una sul
 * **problema**. Serve al setter per sapere di cosa parlare prima di chiamare.
 *
 * ⚠️ I nomi dei prodotti si scrivono **con «AI»** (AI Act) e devono combaciare esattamente
 * con quelli usati per smistare il lead nel CRM: sono valori, non testo libero.
 *
 * ⚠️ Tre voci NON sono prodotti disponibili: su Notion (*Servizi/Prodotti*) «Gestione
 * Cantieri AI» e «All Tools Complete Pack» sono allo stadio **Idea**, «Contabilità AI» è in
 * **Ricerca**, previste per il 2027. Sono in elenco per **raccogliere domanda**, come chiesto
 * da Dante, e per questo dicono «soluzione su misura, da valutare insieme»: nessuno deve
 * pensare di poterle comprare oggi, altrimenti il setter deve rimangiarsi la promessa.
 */

export const PRODOTTI = [
  "Preventivatore AI",
  "Computatore AI",
  "EdilChat AI",
  "Analisi Prezzi AI",
  "Tutti i prodotti insieme",
  "Gestione cantieri (soluzione su misura, da valutare insieme)",
  "Contabilità e SAL (soluzione su misura, da valutare insieme)",
  "Non lo so ancora, vorrei capire",
] as const;

export type Prodotto = (typeof PRODOTTI)[number];

/** Le motivazioni cambiano col prodotto: compare solo quella che serve, così il modulo resta corto. */
export const MOTIVAZIONI: Record<Prodotto, string[]> = {
  "Preventivatore AI": [
    "Ci metto troppo tempo a fare i preventivi",
    "Arrivo dopo i concorrenti e perdo il lavoro",
    "Non sono sicuro dei margini che sto facendo",
    "Voglio consegnare preventivi più professionali",
    "Altro",
  ],
  "Computatore AI": [
    "Faccio i computi a mano e ci perdo giornate",
    "Devo trasformare disegni e PDF in un computo",
    "Sbaglio le quantità e me ne accorgo in cantiere",
    "Voglio portare il computo direttamente nel preventivo",
    "Altro",
  ],
  "EdilChat AI": [
    "Perdo tempo a cercare le voci di prezzario",
    "Ho dubbi tecnici o normativi e non so a chi chiedere",
    "Devo convertire documenti e PDF in Excel",
    "Voglio una consulenza disponibile quando serve",
    "Altro",
  ],
  "Analisi Prezzi AI": [
    "Ho lavorazioni fuori prezzario da quotare",
    "Devo giustificare i prezzi al committente",
    "Non so come si compone un'analisi prezzi",
    "Altro",
  ],
  "Tutti i prodotti insieme": [
    "Voglio cambiare del tutto il modo in cui lavoro",
    "Uso già altri software e voglio valutare un'alternativa",
    "Siamo un'impresa strutturata e ci serve tutto integrato",
    "Altro",
  ],
  "Gestione cantieri (soluzione su misura, da valutare insieme)": [
    "Non ho controllo su squadre e materiali in cantiere",
    "Non so mai a che punto è davvero l'avanzamento",
    "Devo gestire la sicurezza e i documenti di cantiere",
    "Altro",
  ],
  "Contabilità e SAL (soluzione su misura, da valutare insieme)": [
    "I SAL me li faccio a mano e ci perdo tempo",
    "Non riesco a confrontare i costi reali col preventivo",
    "Devo gestire la fatturazione progressiva",
    "Altro",
  ],
  "Non lo so ancora, vorrei capire": [
    "Voglio capire se può servire alla mia impresa",
    "Vorrei vedere come funziona prima di decidere",
    "Me ne hanno parlato e voglio saperne di più",
    "Altro",
  ],
};

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
  "Altro",
] as const;
