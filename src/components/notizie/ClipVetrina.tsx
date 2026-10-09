"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * La clip muta del blocco «Pubblicità» («La vetrina», 09/10/2026): il programma vero che lavora, nel palco del blocco.
 * Parte quando è a metà schermo e si ferma quando esce, come le clip della prova (`ClipProdotto`): sul telefono non
 * scarica niente finché chi legge non arriva lì (`preload="none"`, si vede la copertina). Chi ha chiesto meno
 * movimento (`prefers-reduced-motion`) vede solo la copertina, ferma.
 */
export default function ClipVetrina({ clip, descrizione, stile }: { clip: string; descrizione: string; stile: CSSProperties }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    // ⛔ Si guarda la FINESTRA, non il video: il video è più grande del ritaglio e se ne vede al massimo un quarto,
    // quindi la soglia di metà non arrivava mai e la clip restava ferma (provato il 09/10).
    const finestra = v?.parentElement;
    if (!v || !finestra || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (voce.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    osservatore.observe(finestra);
    return () => osservatore.disconnect();
  }, []);

  return (
    <video
      ref={video}
      className="blocco-prodotto__clip"
      style={stile}
      src={`/video/prova/${clip}.mp4`}
      poster={`/video/prova/${clip}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={`Video del programma: ${descrizione}`}
    />
  );
}
