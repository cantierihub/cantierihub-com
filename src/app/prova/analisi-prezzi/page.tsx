import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import AnalisiPrezziDemo from "@/components/prova/AnalisiPrezziDemo";
import ClipProdotto from "@/components/prova/ClipProdotto";
import { ANCHE, COME_SI_USA, DESCRIZIONE_META, MESSAGGIO_WHATSAPP, TITOLO_PROVA } from "@/data/provaAnalisi";
import { waLink } from "@/data/site";

// La prova dell'Analisi Prezzi del Preventivatore (07/10/2026): la pagina che il CRM manda su WhatsApp subito dopo la
// richiesta del lead. Titolo, come si usa, la prova uguale al prodotto, e sotto le altre cose dell'app.
// Testi in data/provaAnalisi.ts, regole in lib/prova/analisi.ts, il modulo in components/prova/AnalisiPrezziDemo.tsx.

export const metadata: Metadata = {
  title: TITOLO_PROVA,
  description: DESCRIZIONE_META,
  // Pagina mandata su WhatsApp: non si cerca su Google.
  robots: { index: false, follow: false },
  alternates: { canonical: "/prova/analisi-prezzi" },
  openGraph: { title: `${TITOLO_PROVA} · Cantieri Hub`, description: DESCRIZIONE_META, url: "/prova/analisi-prezzi", type: "website" },
};

export default function PaginaProva() {
  const whatsapp = waLink(MESSAGGIO_WHATSAPP);
  return (
    <>
      <section id="prova" className="scroll-mt-20 bg-navy-50 pb-14 pt-8 md:pb-20 md:pt-12">
        <div className="container-main">
          <h1 className="max-w-3xl text-balance font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-navy md:text-[2.75rem] md:leading-[1.06]">
            {TITOLO_PROVA}
          </h1>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-navy-700 md:text-lg">{COME_SI_USA}</p>
          <div className="mt-8">
            <AnalisiPrezziDemo whatsapp={whatsapp} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">E non finisce qui</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-navy-700 md:text-lg">Con il Preventivatore puoi anche:</p>
          <ol className="mt-8 space-y-10">
            {ANCHE.map((a, i) => (
              <li key={a.file}>
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-500 font-display text-[15px] font-bold text-navy" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 font-display text-lg font-semibold leading-snug text-navy md:text-xl">{a.testo}</p>
                </div>
                <div className="mt-4">
                  <ClipProdotto file={a.file} titolo={a.testo} larghezza={a.larghezza} altezza={a.altezza} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[15px] text-navy-600">Video del Preventivatore vero, accelerati.</p>
        </div>
      </section>

      <section className="bg-navy py-12 md:py-16">
        <div className="container-main max-w-3xl">
          <p className="text-balance font-display text-xl font-semibold leading-snug text-white md:text-2xl">
            Te lo facciamo vedere in chiamata, sul tuo computo.
          </p>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-funnel mt-6">
            Scrivici su WhatsApp <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
