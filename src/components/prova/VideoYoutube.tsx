"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Un video di YouTube caricato solo quando si preme play (08/10/2026). Prima c'è la copertina, ospitata dal sito, e
 * verso YouTube non parte niente: la pagina resta leggera al telefono (il lettore pesa circa un mega) e la Cookie Policy
 * dice il vero. Il lettore è quello di youtube-nocookie.com, che parte da solo dopo il clic.
 */
export default function VideoYoutube({
  id,
  titolo,
  durata,
  durataParlata,
  copertina,
}: {
  id: string;
  titolo: string;
  durata: string;
  durataParlata: string;
  copertina: string;
}) {
  const [acceso, setAcceso] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-navy-200 bg-navy shadow-sm">
      {acceso ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={titolo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAcceso(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-orange-400"
          aria-label={`Guarda il video «${titolo}», ${durataParlata}`}
        >
          <Image src={copertina} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-navy/10 transition-colors duration-200 group-hover:bg-navy/0" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-orange-500 text-navy shadow-orange-hover transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none md:h-20 md:w-20"
          >
            {/* Il triangolo ha il peso a sinistra: un pixel a destra e sembra centrato. */}
            <Play className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" />
          </span>
          <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-md bg-navy/85 px-2 py-0.5 font-display text-[14px] font-semibold text-white">
            {durata}
          </span>
        </button>
      )}
    </div>
  );
}
