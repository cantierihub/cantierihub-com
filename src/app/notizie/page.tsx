import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TestataNotizie from "@/components/notizie/TestataNotizie";
import SchedaNotizia from "@/components/notizie/SchedaNotizia";
import { CATEGORIE, notizieDellaCategoria, tutteLeNotizie } from "@/lib/notizie";

const TITOLO = "Notizie per le imprese edili";
const DESCRIZIONE =
  "Norme, bonus, sicurezza, prezzari e appalti spiegati per chi lavora in cantiere: ogni notizia parte da una fonte ufficiale e dice cosa cambia per la tua impresa.";

export const metadata: Metadata = {
  title: TITOLO,
  description: DESCRIZIONE,
  alternates: { canonical: "/notizie", types: { "application/rss+xml": "/notizie/feed.xml" } },
  openGraph: { title: TITOLO, description: DESCRIZIONE, url: "/notizie", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: TITOLO, description: DESCRIZIONE, images: ["/opengraph-image"] },
};

export default function NotiziePage() {
  const notizie = tutteLeNotizie();
  const [prima, ...altre] = notizie;

  return (
    <>
      <TestataNotizie
        occhiello="Notizie · Redazione Cantieri Hub"
        titolo="Quello che cambia per chi costruisce, spiegato semplice."
        sottotitolo="Ogni notizia parte da una fonte ufficiale (Gazzetta, Ministeri, Agenzia delle Entrate, INPS, Regioni) e finisce con cosa fare nella tua impresa."
      />

      <section className="bg-navy-50 py-12 md:py-16">
        <div className="container-main">
          {prima ? (
            <>
              <SchedaNotizia notizia={prima} grande />
              {altre.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {altre.map((n) => (
                    <SchedaNotizia key={n.slug} notizia={n} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy-300 bg-white p-8 md:p-10 text-center">
              <p className="font-display font-bold text-navy text-xl">Le prime notizie arrivano a breve.</p>
              <p className="mt-2 text-navy-600">
                Intanto puoi leggere le nostre <Link href="/guide" className="text-orange-700 underline underline-offset-2">guide gratuite</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container-main">
          <h2 className="font-display font-bold text-navy text-2xl tracking-[-0.01em] md:text-3xl">Le sezioni</h2>
          {/* Un elenco, non una griglia di schede uguali: si legge dall'alto in basso come un indice. */}
          <ul className="mt-6 grid border-t border-navy-200 md:grid-cols-2 md:gap-x-12">
            {CATEGORIE.map((c) => {
              const quante = notizieDellaCategoria(c.slug).length;
              return (
                <li key={c.slug} className="border-b border-navy-200">
                  <Link href={`/notizie/${c.slug}`} className="group flex items-start gap-4 py-5">
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-lg font-semibold text-navy group-hover:text-orange-700">{c.nome}</span>
                        <span className={`text-[13px] font-semibold ${quante === 0 ? "text-navy-500" : "text-orange-700"}`}>
                          {quante === 0 ? "in arrivo" : quante === 1 ? "1 articolo" : `${quante} articoli`}
                        </span>
                      </span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-navy-600">{c.breve}</span>
                    </span>
                    <ChevronRight size={20} aria-hidden="true" className="mt-1 shrink-0 text-navy-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
