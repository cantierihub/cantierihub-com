"use client";

import { useEffect, useState } from "react";
import { leggiConsenso, revocaConsenso, type Consenso } from "@/lib/consenso";

/**
 * Mostra la scelta fatta e permette di cambiarla.
 *
 * Serve perché una revoca dichiarata e non possibile è una promessa falsa: la vecchia
 * pagina cookie diceva di poter revocare «cliccando sul banner», e il banner una volta
 * chiuso non tornava più.
 */
export default function RevocaConsenso() {
  const [consenso, setConsenso] = useState<Consenso>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setConsenso(leggiConsenso());
    setPronto(true);
  }, []);

  // Prima dell'idratazione non sappiamo la scelta: non mostriamo nulla invece di
  // mostrare uno stato sbagliato per una frazione di secondo.
  if (!pronto) return null;

  const testo =
    consenso === "accettato"
      ? "Hai accettato il tracciamento."
      : consenso === "rifiutato"
        ? "Hai rifiutato il tracciamento. Nessuno strumento di terze parti è attivo."
        : "Non hai ancora scelto. Finché non lo fai, nessuno strumento di terze parti è attivo.";

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 not-prose">
      <p className="text-sm text-navy mb-3">{testo}</p>
      <button
        onClick={revocaConsenso}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-navy bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        {consenso === null ? "Mostra di nuovo la richiesta" : "Cambia la mia scelta"}
      </button>
      <p className="text-xs text-gray-400 mt-2">
        La pagina si ricarica: è l&apos;unico modo di togliere davvero uno script già
        caricato, invece di lasciarlo attivo e dire che è spento.
      </p>
    </div>
  );
}
