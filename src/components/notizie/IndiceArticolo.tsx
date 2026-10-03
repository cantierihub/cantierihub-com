"use client";

import { useEffect, useState } from "react";

export interface VoceIndice {
  id: string;
  titolo: string;
}

/**
 * L'indice delle domande dell'articolo, fisso a lato sugli schermi larghi. Segna la sezione che si sta leggendo; senza
 * JavaScript resta un elenco di link che funziona lo stesso.
 */
export default function IndiceArticolo({ voci }: { voci: VoceIndice[] }) {
  const [attiva, setAttiva] = useState<string | null>(null);

  useEffect(() => {
    const titoli = voci.map((v) => document.getElementById(v.id)).filter((el): el is HTMLElement => !!el);
    if (titoli.length === 0) return;
    // La sezione attiva è l'ultima il cui titolo è già passato sopra il primo terzo dello schermo.
    const aggiorna = () => {
      const soglia = window.innerHeight * 0.33;
      let corrente: string | null = null;
      for (const t of titoli) if (t.getBoundingClientRect().top < soglia) corrente = t.id;
      setAttiva(corrente);
    };
    aggiorna();
    window.addEventListener("scroll", aggiorna, { passive: true });
    window.addEventListener("resize", aggiorna);
    return () => {
      window.removeEventListener("scroll", aggiorna);
      window.removeEventListener("resize", aggiorna);
    };
  }, [voci]);

  return (
    <nav aria-label="In questo articolo" className="indice-laterale">
      <p className="text-sm font-semibold text-navy-600">In questo articolo</p>
      <ol className="mt-3 space-y-0.5">
        {voci.map((v) => (
          <li key={v.id}>
            <a href={`#${v.id}`} aria-current={attiva === v.id ? "location" : undefined}>
              {v.titolo}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
