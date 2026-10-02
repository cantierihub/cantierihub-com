import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categoriaDa, dataLeggibile, type Notizia } from "@/lib/notizie";

/** Una notizia nelle liste: categoria, data, titolo, la frase che dice di cosa parla. */
export default function SchedaNotizia({ notizia, grande = false }: { notizia: Notizia; grande?: boolean }) {
  const categoria = categoriaDa(notizia.categoria);
  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl border border-navy-200 overflow-hidden transition-shadow hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)] ${grande ? "md:flex-row" : ""}`}
    >
      {notizia.immagine && (
        <div className={`relative bg-navy-100 ${grande ? "md:w-1/2 aspect-[16/9] md:aspect-auto" : "aspect-[16/9]"}`}>
          <Image
            src={notizia.immagine}
            alt={notizia.immagineAlt ?? ""}
            fill
            sizes={grande ? "(max-width: 768px) 100vw, 600px" : "(max-width: 768px) 100vw, 380px"}
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className={`flex flex-col gap-3 p-6 ${grande ? "md:w-1/2 md:p-8 md:justify-center" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          <Link
            href={`/notizie/${notizia.categoria}`}
            className="relative z-10 font-semibold text-orange-700 hover:text-orange-800"
          >
            {categoria?.nome}
          </Link>
          <span aria-hidden="true" className="text-navy-300">·</span>
          <time dateTime={notizia.dataPubblicazione} className="text-navy-500">
            {dataLeggibile(notizia.dataPubblicazione)}
          </time>
        </div>
        <h3
          className={`font-display font-bold text-navy leading-snug ${grande ? "text-2xl md:text-[1.75rem]" : "text-lg"}`}
        >
          <Link href={`/notizie/${notizia.slug}`} className="after:absolute after:inset-0">
            {notizia.titolo}
          </Link>
        </h3>
        <p className={`text-navy-600 leading-relaxed ${grande ? "text-base md:text-lg" : "text-[15px]"}`}>
          {notizia.descrizione}
        </p>
        <span className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-orange-600">
          Leggi <ArrowRight size={15} />
        </span>
      </div>
    </article>
  );
}
