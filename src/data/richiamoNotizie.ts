import type { ProdottoFunnel } from "@/data/funnelNotizie";

/**
 * Il richiamo corto che accompagna chi legge («Ti accompagna», Raffaele 09/10/2026): la barra in basso sul telefono
 * (`BarraPubblicita`) e il riquadro nella colonna di sinistra sul computer (`CartaPubblicita`), per chi non arriva fino
 * al blocco in fondo. Sta in un file suo, accanto a `funnelNotizie.ts`, così si aggiunge e si toglie senza toccare i
 * testi del blocco.
 *
 * ⛔ È pubblicità: valgono le regole di `funnelNotizie.ts` (nessun tempo, risparmio o risultato senza prova).
 */
export interface Richiamo {
  /**
   * Una frase sola, nella voce delle statiche Meta («Fai i preventivi con l'AI»), ≤ 25 caratteri: a 360 px sta su una
   * riga accanto a «Provalo» (misurato il 09/10: «Computi e preventivi con l'AI» a 390 px usciva coi puntini).
   */
  frase: string;
  /** Una schermata VERA del prodotto per il riquadro del computer (copertina di una clip di `public/video/prova/`). */
  schermata?: { immagine: string; descrizione: string; ingrandimento: string; posizione: string };
}

export const RICHIAMO: Record<ProdottoFunnel, Richiamo> = {
  "analisi-prezzi": { frase: "Analisi prezzi con l'AI" },
  preventivatore: {
    frase: "Fai i preventivi con l'AI",
    schermata: {
      immagine: "/video/prova/quadro-economico.jpg",
      descrizione: "Il quadro economico di un preventivo di prova, con costo, margine e utile",
      ingrandimento: "174% auto",
      posizione: "10% 16%",
    },
  },
  computatore: { frase: "Fai i computi con l'AI" },
  "cantieri-hub": { frase: "Computi e preventivi" },
};
