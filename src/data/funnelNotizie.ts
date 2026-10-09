/**
 * Il funnel delle Notizie: dall'articolo al prodotto che c'entra, e dal prodotto alla candidatura per la demo.
 *
 * Raffaele, 03/10/2026: «Dobbiamo sempre avere qualcosa alla fine che richiami i nostri prodotti… persone che arrivano
 * lì e, cliccando, si vanno a leggere che cosa fa il nostro prodotto e possono candidarsi».
 *
 * ⛔ Questi testi sono PUBBLICITÀ (D.Lgs. 145/2007, art. 2 e 5): stanno in un blocco con l'etichetta «Pubblicità»,
 * staccato dal testo della redazione, e valgono le regole di `CONFORMITA.md` §1.6 e §3.5 (vault, sito-seo):
 * - solo funzioni e capacità vere, niente tempi promessi («3 minuti»), risparmi, «zero errori», «garantito»;
 * - niente prezzi, niente «prova gratuita» (non esiste), niente «consulenza gratuita» (Raffaele, 24/09);
 * - il limite del prodotto si dice (FONDAMENTA §3: «L'IA propone. Il tecnico decide»);
 * - niente numeri interni né clienti (memoria `feedback_materiali_esterni_niente_numeri_interni`);
 * - EdilChat non c'è: è congelato commercialmente (FONDAMENTA §3).
 *
 * Sono FISSI: li approva Raffaele una volta, e nessun agente li riscrive articolo per articolo. Per articolo cambiano
 * solo la scelta del prodotto (`prodotto:` nel frontmatter) e, se c'è, una frase di aggancio (`gancio:`), che passano
 * dalla Conformità e dall'ok di Raffaele insieme all'articolo.
 */

import type { Prodotto } from "@/data/moduloLead";

export const PRODOTTI_FUNNEL = ["analisi-prezzi", "preventivatore", "computatore", "cantieri-hub"] as const;
export type ProdottoFunnel = (typeof PRODOTTI_FUNNEL)[number];

export interface SchedaFunnel {
  slug: ProdottoFunnel;
  nome: string;
  /**
   * Il valore che finisce nel CRM come «Prodotto richiesto» (vedi `moduloLead.ts`). `null` = la pagina della demo
   * chiede lei quale prodotto interessa (il blocco generale su Cantieri Hub).
   */
  valoreCrm: Prodotto | null;
  /** La pagina prodotto completa, per chi vuole leggere tutto. */
  pagina: string;
  /**
   * Il blocco «Pubblicità» in fondo all'articolo. Dal 09/10 nella voce delle statiche Meta (Raffaele: «il copy deve
   * essere come lo facciamo nelle ad, quindi diretto»): due frasi corte che dicono cosa fa, il vantaggio detto dritto,
   * il pulsante che dice cosa provi. ⛔ Niente tempi («in pochi minuti», «4 ore») né risultati senza prova: sul sito
   * l'onere della prova è nostro (D.Lgs. 145/2007, art. 8; CONFORMITA §3.5).
   */
  blocco: {
    titolo: string;
    testo: string;
    /** Il pulsante: cosa provi nella demo, con le parole di chi la fa. */
    pulsante: string;
    /** Sotto il pulsante: com'è la demo e, dove serve, il limite («il prezzo finale lo decidi tu»). */
    nota: string;
  };
  /**
   * La schermata vera del prodotto nel blocco «Pubblicità» («La vetrina», Raffaele 09/10/2026: «migliorare il
   * placement… quando proponiamo uno dei nostri prodotti»). Una clip muta di `public/video/prova/`, ritagliata sulla
   * parte che conta. ⛔ Solo registrazioni del programma vero: sopra c'è scritto «Il programma vero», quindi uno schema
   * (come `analisi-prezzi-scomposizione.png`) o una foto generata non ci vanno. Senza, il blocco resta di solo testo.
   */
  vetrina?: {
    clip: string;
    /** Cosa si vede, per chi usa un lettore di schermo. */
    descrizione: string;
    fotogramma: { larghezza: number; altezza: number };
    /** Il pezzo di fotogramma da mostrare, in pixel del fotogramma intero. */
    ritaglio: { x: number; y: number; larghezza: number; altezza: number };
  };
  pagina_demo: {
    titolo: string;
    sottotitolo: string;
    cosaFa: { titolo: string; testo: string }[];
    limite: string;
    /** Cosa portare alla demo: i file veri del lettore. */
    portaConTe: string;
  };
}

export const FUNNEL: Record<ProdottoFunnel, SchedaFunnel> = {
  // Ogni frase qui sotto ha una fonte interna (verifica del 03/10 sera, quattro revisori): pagine prodotto del sito,
  // brochure v2 e il preventivo del 17/09 (Business/cantieri-hub), FONDAMENTA §3. Una frase nuova si scrive solo con
  // la sua fonte accanto: la prova di quello che diciamo è a carico nostro (D.Lgs. 145/2007, art. 8).
  "analisi-prezzi": {
    slug: "analisi-prezzi",
    nome: "Analisi Prezzi AI",
    valoreCrm: "Analisi Prezzi",
    pagina: "/analisi-prezzi",
    blocco: {
      titolo: "Il prezzo di una voce non lo trovi? L'AI te lo costruisce.",
      testo:
        "Materiali, manodopera e noli, poi spese generali e il tuo utile. Con i tuoi costi, se vuoi. Ogni numero lo cambi tu.",
      pulsante: "Provalo su una tua voce",
      nota: "Demo gratuita, dal vivo: porti una voce fuori prezzario e la costruiamo insieme.",
    },
    pagina_demo: {
      titolo: "Il prezzo di una voce non lo trovi? L'AI te lo costruisce.",
      sottotitolo:
        "Nella demo porti una tua voce e la scomponiamo insieme. Cambi un costo e vedi il prezzo che si ricalcola. L'ultima parola resta tua.",
      cosaFa: [
        {
          titolo: "Ogni voce scomposta",
          testo: "Materiali, manodopera e noli. Poi spese generali e utile.",
        },
        {
          titolo: "Con i tuoi costi",
          testo: "Metti i prezzi dei tuoi fornitori e della tua squadra. L'analisi usa quelli al posto delle stime di mercato.",
        },
        {
          titolo: "Quando i costi si muovono",
          testo: "Aggiorni solo le voci che sono cambiate. Il prezzo si ricalcola.",
        },
      ],
      limite: "La difficoltà del cantiere la giudichi tu: l'AI propone, tu decidi.",
      portaConTe: "Porta una voce fuori prezzario o un preventivo su cui stai lavorando.",
    },
  },
  preventivatore: {
    slug: "preventivatore",
    nome: "Preventivatore AI",
    valoreCrm: "Preventivatore",
    pagina: "/preventivatore",
    blocco: {
      titolo: "Carichi il computo. Esce il preventivo.",
      testo:
        "L'AI cerca il prezzo di ogni voce sul prezzario della tua regione o nei tuoi listini. Con un click ogni voce si apre: vedi quanto ci guadagni.",
      pulsante: "Provalo su un tuo computo",
      nota: "Demo gratuita, dal vivo: porti un tuo computo e facciamo il preventivo insieme. Il prezzo finale lo decidi tu.",
    },
    // La clip del quadro economico della prova del Preventivatore (07/10), sul riquadro con costo, margine e utile.
    vetrina: {
      clip: "quadro-economico",
      descrizione: "il quadro economico di un preventivo di prova, con costo, margine e utile",
      fotogramma: { larghezza: 1280, altezza: 906 },
      ritaglio: { x: 50, y: 75, larghezza: 740, altezza: 425 },
    },
    pagina_demo: {
      titolo: "Carichi il computo. Esce il preventivo.",
      sottotitolo:
        "Nella demo porti un computo vero e lo trasformiamo in offerta insieme. Vedi le voci sul prezzario e il margine prima che l'offerta parta.",
      cosaFa: [
        {
          titolo: "Le voci sul prezzario",
          testo: "Ogni voce del computo si cerca sul prezzario regionale o nei tuoi listini, per codice o per descrizione.",
        },
        {
          titolo: "Il margine prima di firmare",
          testo: "Prima che l'offerta parta vedi costo, margine e utile.",
        },
        {
          titolo: "L'offerta con il tuo marchio",
          testo: "Esce il PDF con il tuo logo. Nei lavori privati, SAL e varianti li fai nello stesso posto.",
        },
      ],
      limite: "I prezzi e la firma restano tuoi: l'AI propone, tu decidi.",
      portaConTe: "Porta un computo vero su cui devi fare l'offerta. Va bene in PDF, Excel o XML.",
    },
  },
  computatore: {
    slug: "computatore",
    nome: "Computatore AI",
    valoreCrm: "Computatore",
    pagina: "/computatore",
    blocco: {
      titolo: "Fai le foto del sopralluogo. Le voci te le propone l'AI.",
      testo:
        "Ogni voce col suo codice del prezzario ufficiale. Dalla piantina legge la scala e fa una prima stima delle quantità. Tu controlli e decidi.",
      pulsante: "Provalo su un tuo lavoro",
      nota: "Demo gratuita, dal vivo: porti le foto di un sopralluogo o una piantina e facciamo il computo insieme.",
    },
    pagina_demo: {
      titolo: "Fai le foto del sopralluogo. Le voci te le propone l'AI.",
      sottotitolo:
        "Nella demo porti le foto di un sopralluogo o una piantina e facciamo il computo insieme. Vedi da dove arriva ogni quantità e la correggi tu.",
      cosaFa: [
        {
          titolo: "Dalla descrizione e dalle foto",
          testo: "Racconti il lavoro come a un collega. L'AI propone le voci sul prezzario ufficiale, con il loro codice. Quello che sul prezzario non c'è lo aggiungi tu.",
        },
        {
          titolo: "Dalle piantine",
          testo: "Legge la scala dal cartiglio. Propone una prima stima delle quantità dalle quote e ti mostra i passaggi.",
        },
        {
          titolo: "Dritto al preventivo",
          testo: "Il computo che hai approvato passa al Preventivatore senza ricopiare una riga.",
        },
      ],
      limite: "Il sopralluogo e le misure restano tuoi: l'AI propone, tu decidi.",
      portaConTe: "Porta la descrizione di un lavoro, le foto di un sopralluogo o una piantina.",
    },
  },
  // Il blocco generale: quando l'articolo non tocca un prodotto in particolare. Raffaele vuole un richiamo sempre;
  // le regole dicono di nominare un prodotto solo se c'entra. Qui si presenta l'azienda, non un prodotto.
  "cantieri-hub": {
    slug: "cantieri-hub",
    nome: "Cantieri Hub",
    valoreCrm: null,
    pagina: "/come-funziona",
    blocco: {
      titolo: "Computi e preventivi con l'AI. Senza ricopiare il prezzario.",
      testo:
        "Il computo dalle foto o dalla piantina. Il preventivo dal computo, con l'analisi di ogni prezzo. L'ultima parola è tua.",
      pulsante: "Provalo su un tuo lavoro",
      nota: "Demo gratuita, dal vivo: porti un computo o un preventivo vero e lo lavoriamo insieme.",
    },
    pagina_demo: {
      titolo: "Computi e preventivi con l'AI. Senza ricopiare il prezzario.",
      sottotitolo:
        "Nella demo porti un computo o un preventivo vero e lo lavoriamo insieme. Vedi dove ti toglie lavoro e dove serve il tuo giudizio.",
      cosaFa: [
        {
          titolo: "Il computo metrico",
          testo: "Dalle foto del sopralluogo o dalla piantina, sul prezzario ufficiale.",
        },
        {
          titolo: "L'analisi dei prezzi",
          testo: "Ogni voce divisa in materiali, manodopera e noli. Con i tuoi costi.",
        },
        {
          titolo: "Il preventivo",
          testo: "Dal computo all'offerta con il tuo logo. Prima di mandarla vedi il margine.",
        },
      ],
      limite: "I prezzi, le misure e la firma restano tuoi: l'AI propone, tu decidi.",
      portaConTe: "Porta un computo o un preventivo vero su cui stai lavorando.",
    },
  },
};

/**
 * Il prodotto di partenza per ogni sezione, quando l'articolo non lo sceglie: quello più vicino al tema, oppure il
 * blocco generale. Lo Scrittore lo può cambiare con `prodotto:` nel frontmatter.
 *
 * ⛔ Sulle notizie tragiche (infortuni gravi, morti sul lavoro, crolli, calamità) il blocco NON c'è: Raffaele 24/09
 * («su argomenti così delicati… falla normale») e Codice del consumo, art. 25, lett. c (sfruttare un evento tragico è
 * una pratica aggressiva). Per questo «Sicurezza e lavoro», dove stanno gli infortuni, parte SPENTA (`null`): se ci si
 * dimentica, manca una pubblicità, non compare una pubblicità accanto a un lutto. Lo Scrittore la accende con
 * `prodotto: cantieri-hub` sulle notizie che non sono tragiche (DURC, CCNL, patente a crediti).
 */
export const PRODOTTO_DELLA_SEZIONE: Record<string, ProdottoFunnel | null> = {
  "prezzari-e-costi": "analisi-prezzi",
  "guide-pratiche": "preventivatore",
  "appalti-e-incentivi": "preventivatore",
  "normative-e-bonus": "cantieri-hub",
  "sicurezza-e-lavoro": null,
};

export function schedaFunnel(slug: string | null | undefined): SchedaFunnel | null {
  return slug && (PRODOTTI_FUNNEL as readonly string[]).includes(slug) ? FUNNEL[slug as ProdottoFunnel] : null;
}
