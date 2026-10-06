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
  blocco: {
    titolo: string;
    testo: string;
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
      titolo: "Il prezzo di ogni voce, costruito pezzo per pezzo",
      testo:
        "L'AI scompone ogni voce in materiali, manodopera e noli. Poi aggiunge spese generali e utile. Il ragionamento lo leggi e lo correggi tu.",
    },
    pagina_demo: {
      titolo: "Il prezzo di ogni voce, costruito pezzo per pezzo.",
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
      titolo: "Dal computo all'offerta, vedendo il margine prima di mandarla",
      testo:
        "Carichi il computo del committente. Ogni voce si cerca sul prezzario regionale o nei tuoi listini. Prima di mandare l'offerta vedi costo, margine e utile.",
    },
    pagina_demo: {
      titolo: "Dal computo all'offerta, vedendo il margine prima di mandarla.",
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
      titolo: "Il computo metrico dalle foto del sopralluogo o dalla piantina",
      testo:
        "Descrivi il lavoro e carichi foto o piantine. L'AI propone le voci sul prezzario ufficiale. Le misure le controlli e le decidi tu.",
    },
    pagina_demo: {
      titolo: "Il computo metrico dalle foto del sopralluogo o dalla piantina.",
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
      titolo: "Computi e preventivi senza ricopiare voci dal prezzario",
      testo:
        "Tre strumenti per imprese edili: il computo dal sopralluogo, l'analisi di ogni prezzo e il preventivo. Lavorano sul prezzario ufficiale e sui tuoi costi.",
    },
    pagina_demo: {
      titolo: "Computi e preventivi senza ricopiare voci dal prezzario.",
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
