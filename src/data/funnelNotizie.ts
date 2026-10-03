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
  "analisi-prezzi": {
    slug: "analisi-prezzi",
    nome: "Analisi Prezzi AI",
    valoreCrm: "Analisi Prezzi",
    pagina: "/analisi-prezzi",
    blocco: {
      titolo: "Il prezzo di ogni voce, costruito pezzo per pezzo",
      testo:
        "L'Analisi Prezzi AI di Cantieri Hub scompone ogni lavorazione in materiali, manodopera e noli, con spese generali e utile. Usa i tuoi costi, e il ragionamento lo leggi e lo cambi tu.",
    },
    pagina_demo: {
      titolo: "Il prezzo di ogni voce, costruito pezzo per pezzo.",
      sottotitolo:
        "Dai all'AI una lavorazione: ti restituisce il prezzo scomposto in materiali, manodopera, noli, spese generali e utile. Il ragionamento lo leggi, lo cambi e lo firmi tu.",
      cosaFa: [
        {
          titolo: "Ogni voce scomposta",
          testo: "Materiali, manodopera e noli, con spese generali e utile, sul costo del lavoro della tua regione.",
        },
        {
          titolo: "Con i tuoi costi",
          testo: "Metti i prezzi dei tuoi fornitori e della tua squadra: l'analisi usa quelli al posto delle stime di mercato.",
        },
        {
          titolo: "Quando i costi si muovono",
          testo: "Aggiorni solo le voci che sono cambiate, e il prezzo si ricalcola davanti a te.",
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
      titolo: "Dal computo all'offerta, sapendo quanto guadagni",
      testo:
        "Con il Preventivatore AI di Cantieri Hub carichi il computo del committente: le voci si abbinano al prezzario regionale o ai tuoi listini, e prima di mandare l'offerta vedi costo, margine e utile.",
    },
    pagina_demo: {
      titolo: "Dal computo all'offerta, sapendo quanto guadagni.",
      sottotitolo:
        "Carichi il computo che ti arriva dal committente o dal progettista. Le voci si abbinano al prezzario e ai tuoi listini, e prima di mandare l'offerta vedi costo, margine e utile.",
      cosaFa: [
        {
          titolo: "Le voci sul prezzario",
          testo: "Ogni voce del computo si abbina al prezzario regionale, a quelli nazionali o ai tuoi listini, per codice o per descrizione.",
        },
        {
          titolo: "Il margine prima di firmare",
          testo: "Il quadro economico con costo, margine e utile, prima che l'offerta parta.",
        },
        {
          titolo: "L'offerta con il tuo marchio",
          testo: "Esce il PDF con il tuo logo. Poi SAL con ritenuta di garanzia e varianti, nello stesso posto.",
        },
      ],
      limite: "I prezzi e la firma restano tuoi: l'AI propone, tu decidi.",
      portaConTe: "Porta un computo vero, in PDF, Excel o XML, su cui devi fare l'offerta.",
    },
  },
  computatore: {
    slug: "computatore",
    nome: "Computatore AI",
    valoreCrm: "Computatore",
    pagina: "/computatore",
    blocco: {
      titolo: "Il computo metrico da zero, dal sopralluogo o dalla piantina",
      testo:
        "Con il Computatore AI di Cantieri Hub descrivi il lavoro e carichi foto o piantine: le voci arrivano sui prezzari ufficiali e le quantità dalle quote. Le misure le controlli e le decidi tu.",
    },
    pagina_demo: {
      titolo: "Il computo metrico da zero, dal sopralluogo o dalla piantina.",
      sottotitolo:
        "Descrivi il lavoro, carichi le foto del sopralluogo o le piantine. L'AI propone le voci sui prezzari ufficiali e ti mostra il ragionamento. Tu controlli, correggi e passi al preventivo.",
      cosaFa: [
        {
          titolo: "Dalla descrizione e dalle foto",
          testo: "Racconti il lavoro come a un collega: le voci arrivano sul prezzario ufficiale, ognuna con il suo codice.",
        },
        {
          titolo: "Dalle piantine",
          testo: "Legge la scala dal cartiglio, ricava le quantità dalle quote e ti mostra i passaggi.",
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
      titolo: "Computi, prezzi e preventivi, con l'AI al tuo fianco",
      testo:
        "Cantieri Hub fa software per le imprese edili: il computo metrico dal sopralluogo, l'analisi di ogni prezzo e il preventivo sul prezzario ufficiale, con i tuoi costi.",
    },
    pagina_demo: {
      titolo: "Computi, prezzi e preventivi, con l'AI al tuo fianco.",
      sottotitolo:
        "Tre strumenti per la parte del lavoro che nessuno ti paga: il computo metrico, l'analisi dei prezzi e il preventivo. Lavorano sui prezzari ufficiali e sui tuoi costi.",
      cosaFa: [
        {
          titolo: "Il computo metrico",
          testo: "Dalla descrizione del lavoro, dalle foto del sopralluogo o dalle piantine, sul prezzario ufficiale.",
        },
        {
          titolo: "L'analisi dei prezzi",
          testo: "Ogni voce scomposta in materiali, manodopera e noli, con spese generali e utile, con i tuoi costi.",
        },
        {
          titolo: "Il preventivo",
          testo: "Dal computo all'offerta con il tuo logo, vedendo costo, margine e utile prima di mandarla.",
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
 * ⛔ Sulle notizie tragiche (infortuni gravi, morti sul lavoro, crolli, calamità) il blocco si SPEGNE con
 * `prodotto: nessuno`: Raffaele 24/09 («su argomenti così delicati… falla normale») e Codice del consumo, art. 25,
 * lett. c (sfruttare un evento tragico è una pratica aggressiva). Lo controlla la Conformità.
 */
export const PRODOTTO_DELLA_SEZIONE: Record<string, ProdottoFunnel> = {
  "prezzari-e-costi": "analisi-prezzi",
  "guide-pratiche": "preventivatore",
  "appalti-e-incentivi": "preventivatore",
  "normative-e-bonus": "cantieri-hub",
  "sicurezza-e-lavoro": "cantieri-hub",
};

export function schedaFunnel(slug: string | null | undefined): SchedaFunnel | null {
  return slug && (PRODOTTI_FUNNEL as readonly string[]).includes(slug) ? FUNNEL[slug as ProdottoFunnel] : null;
}
