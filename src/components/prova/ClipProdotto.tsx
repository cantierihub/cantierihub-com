"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";

/**
 * Una clip muta del Preventivatore vero (07/10/2026): parte quando è a metà schermo e si ferma quando esce, così sul
 * telefono non scarica tre video insieme. Chi ha chiesto meno movimento (`prefers-reduced-motion`) vede la copertina
 * e la fa partire lui.
 */
const MENO_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function useMenoMovimento(): boolean {
  return useSyncExternalStore(
    (avvisa) => {
      const m = window.matchMedia(MENO_MOVIMENTO);
      m.addEventListener("change", avvisa);
      return () => m.removeEventListener("change", avvisa);
    },
    () => window.matchMedia(MENO_MOVIMENTO).matches,
    () => false,
  );
}

export default function ClipProdotto({ file, titolo, larghezza, altezza }: { file: string; titolo: string; larghezza: number; altezza: number }) {
  const video = useRef<HTMLVideoElement>(null);
  // A mano: chi ha chiesto meno movimento, o un telefono che non lascia partire il video da solo.
  const menoMovimento = useMenoMovimento();
  const [bloccato, setBloccato] = useState(false);
  const [avviato, setAvviato] = useState(false);
  const aMano = menoMovimento || bloccato;

  useEffect(() => {
    const v = video.current;
    if (!v || menoMovimento) return;
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (voce.isIntersecting) v.play().catch(() => setBloccato(true));
        else v.pause();
      },
      { threshold: 0.5 },
    );
    osservatore.observe(v);
    return () => osservatore.disconnect();
  }, [menoMovimento]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-navy-200 bg-navy-50 shadow-sm">
      <video
        ref={video}
        className="block w-full"
        style={{ aspectRatio: `${larghezza} / ${altezza}` }}
        src={`/video/prova/${file}.mp4`}
        poster={`/video/prova/${file}.jpg`}
        muted
        loop
        playsInline
        preload="none"
        controls={aMano && avviato}
        aria-label={`Video del Preventivatore: ${titolo}`}
      />
      {aMano && !avviato && (
        <button
          type="button"
          onClick={() => {
            video.current?.play();
            setAvviato(true);
          }}
          className="absolute inset-0 grid place-items-center bg-navy/10"
          aria-label={`Guarda il video: ${titolo}`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-navy shadow-lg">
            <Play size={22} aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
