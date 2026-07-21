"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

export type StatoFase = "live" | "prossimo" | "visione";

export type FaseRoadmap = {
  fase: string;
  stato: StatoFase;
  prodotti: { nome: string; tag: string; desc: string }[];
};

// Perche' e' un componente client: su desktop basterebbe il CSS :hover, ma su
// telefono l'hover non esiste. Li' la scheda si apre al tocco, e servono stato
// e gestore del click. La pagina Chi Siamo resta server component (esporta
// metadata), quindi la roadmap vive qui separata.
export default function RoadmapVisione({ roadmap }: { roadmap: FaseRoadmap[] }) {
  const [aperta, setAperta] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10">
      {roadmap.map((fase, fi) => (
        <div key={fase.fase}>
          <Reveal delay={fi * 0.05}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`roadmap-etichetta roadmap-etichetta--${fase.stato}`}>
                {fase.stato === "live" && <span className="roadmap-pallino" />}
                {fase.fase}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fase.prodotti.map((prod, pi) => {
              const isAperta = aperta === prod.nome;
              return (
                <Reveal key={prod.nome} delay={fi * 0.05 + pi * 0.06}>
                  <button
                    type="button"
                    onClick={() => setAperta(isAperta ? null : prod.nome)}
                    aria-expanded={isAperta}
                    className={`roadmap-card roadmap-card--${fase.stato}${
                      isAperta ? " is-open" : ""
                    }`}
                  >
                    <span className="roadmap-nome">{prod.nome}</span>
                    <span className="roadmap-tag">{prod.tag}</span>
                    <span className="roadmap-desc">{prod.desc}</span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
