"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import TornaAllArticolo, { useArticoloDiProvenienza } from "@/components/notizie/TornaAllArticolo";

/**
 * Il testo di /grazie. Chi arriva da una candidatura delle Notizie (`?da=<slug>`) legge «Candidatura ricevuta», sa che
 * lo chiamiamo e cosa preparare per la demo, e può tornare all'articolo (funnel, 03/10/2026). Per tutti gli altri la
 * pagina resta com'era.
 */
export default function TestoGrazie() {
  const candidatura = Boolean(useArticoloDiProvenienza());
  return (
    <>
      <Reveal delay={0.1}>
        <h1 className="mt-8 font-display font-extrabold text-white leading-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>
          {candidatura ? (
            <>Candidatura <span className="text-orange-400">ricevuta.</span></>
          ) : (
            <>Grazie! Abbiamo ricevuto <span className="text-orange-400">il tuo messaggio.</span></>
          )}
        </h1>
      </Reveal>

      <Reveal delay={0.2}>
        {candidatura ? (
          <div className="mt-5 max-w-xl mx-auto space-y-3 text-lg text-navy-200 leading-relaxed">
            <p>Ti chiamiamo <strong className="text-white">entro 24 ore</strong> per fissare la demo.</p>
            <p>Intanto tieni pronto un computo, un preventivo o una voce su cui stai lavorando: la demo la facciamo lì sopra.</p>
          </div>
        ) : (
          <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            Ti ricontattiamo <strong className="text-white">entro 24 ore</strong>.
          </p>
        )}
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-9 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
          <TornaAllArticolo className="btn-ghost-white btn-lg w-full justify-center sm:w-auto" />
          <Link href="/" className={candidatura ? "btn-ghost-white btn-lg w-full justify-center sm:w-auto" : "btn-ghost btn-lg"}>
            Torna alla home
          </Link>
        </div>
      </Reveal>

      {/* Il «tempo medio» non ha una misura (revisione del 03/10): nella candidatura non si scrive. */}
      {!candidatura && (
        <Reveal delay={0.4}>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400">
            <Clock size={15} className="text-gray-400" />
            Tempo medio di risposta: meno di un&apos;ora negli orari di lavoro.
          </p>
        </Reveal>
      )}
    </>
  );
}
