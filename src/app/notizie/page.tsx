import type { Metadata } from "next";
import Link from "next/link";
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
          <h2 className="font-display font-extrabold text-navy text-2xl md:text-3xl">Le sezioni</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIE.map((c) => {
              const quante = notizieDellaCategoria(c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/notizie/${c.slug}`}
                  className="group rounded-2xl border border-navy-200 p-5 transition-colors hover:border-orange-300 hover:bg-orange-50"
                >
                  <p className="font-display font-bold text-navy group-hover:text-orange-700">{c.nome}</p>
                  <p className="mt-1.5 text-[15px] text-navy-600 leading-relaxed">{c.breve}</p>
                  <p className="mt-3 text-[13px] font-semibold text-navy-500">
                    {quante === 0 ? "In arrivo" : quante === 1 ? "1 articolo" : `${quante} articoli`}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
