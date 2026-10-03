import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, Check } from "lucide-react";
import ContattiForm from "@/app/contatti/ContattiForm";
import TornaAllArticolo from "@/components/notizie/TornaAllArticolo";
import { PRODOTTI_FUNNEL, schedaFunnel } from "@/data/funnelNotizie";

// La candidatura alla demo, prodotto per prodotto: il secondo passo del funnel delle Notizie (03/10/2026).
// Chi arriva dal blocco «Pubblicità» in fondo a un articolo legge cosa fa il prodotto e si candida; il modulo porta il
// lead nel CRM con l'etichetta «notizie» e l'articolo nel messaggio (`lib/funnel.ts`).
// I testi sono pubblicità: stanno in `data/funnelNotizie.ts`, con le regole che valgono per loro.
//
// ⚠️ Niente foto: quelle delle pagine prodotto hanno persone e sono fatte con l'AI. Qui si arriva dalle Notizie, dove
// ogni immagine AI si dichiara (CONFORMITA §3.3): meglio niente immagini che una non dichiarata.

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODOTTI_FUNNEL.map((prodotto) => ({ prodotto }));
}

export async function generateMetadata({ params }: { params: Promise<{ prodotto: string }> }): Promise<Metadata> {
  const p = schedaFunnel((await params).prodotto);
  if (!p) return {};
  const titolo = p.slug === "cantieri-hub" ? "Candidati per la demo sui tuoi file" : `${p.nome}: candidati per la demo`;
  return {
    title: titolo,
    description: p.pagina_demo.sottotitolo,
    // Pagina di conversione: le pagine da trovare su Google sono quelle dei prodotti, non queste.
    robots: { index: false, follow: true },
    alternates: { canonical: `/demo/${p.slug}` },
    // Se il link si condivide (WhatsApp, un setter), l'anteprima mostra questa pagina e non la home.
    openGraph: { title: `${titolo} · Cantieri Hub`, description: p.pagina_demo.sottotitolo, url: `/demo/${p.slug}`, type: "website" },
  };
}

const PASSI = [
  { titolo: "Ti candidi", testo: "Compili il modulo: chi sei, che lavoro fai e cosa ti serve." },
  { titolo: "Ti chiamiamo", testo: "Ti chiama una persona di Cantieri Hub. Capisce il tuo lavoro e fissa con te la demo." },
  { titolo: "La vedi sui tuoi file", testo: "La facciamo dal vivo su un tuo computo o preventivo, non su un esempio. Nessun impegno." },
];

export default async function PaginaDemo({ params }: { params: Promise<{ prodotto: string }> }) {
  const p = schedaFunnel((await params).prodotto);
  if (!p) notFound();
  const d = p.pagina_demo;

  const domande = [
    {
      d: "Quanto costa?",
      r: "Il prezzo lo vediamo insieme durante la demo, in base a cosa ti serve davvero.",
    },
    {
      d: "C'è una prova gratuita?",
      r: "No. C'è la demo gratuita dal vivo con una persona di Cantieri Hub. Così vedi il risultato sul tuo lavoro e non su un esempio.",
    },
    { d: "Cosa devo preparare?", r: `${d.portaConTe} Se non hai niente sotto mano, va bene lo stesso: ne parliamo al telefono.` },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-navy pt-8 pb-14 md:pt-14 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full bg-orange-500/10 blur-[100px]" />

        <div className="container-main relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14">
          <div>
            <div className="mb-4 empty:hidden">
              <TornaAllArticolo className="-ml-1 !text-navy-200 hover:!text-white" />
            </div>
            <p className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              {p.slug === "cantieri-hub" ? "Cantieri Hub" : p.nome} · demo gratuita sui tuoi file
            </p>
            <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-white md:text-[2.75rem] md:leading-[1.08]">
              {d.titolo}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200 md:text-xl">{d.sottotitolo}</p>

            {/* Solo sul telefono: sul computer il modulo è già qui accanto. */}
            <div className="mt-7 lg:hidden">
              <a href="#candidatura" className="btn-funnel">
                Candidati per la demo <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>

            <h2 className="mt-12 font-display text-xl font-semibold tracking-[-0.01em] text-white">Cosa fa</h2>
            <ul className="mt-5 space-y-5">
              {d.cosaFa.map((c) => (
                <li key={c.titolo} className="flex gap-4">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-400" aria-hidden="true">
                    <Check size={18} strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block font-display text-[1.0625rem] font-semibold text-white">{c.titolo}</span>
                    <span className="mt-1 block text-[16px] leading-relaxed text-navy-200">{c.testo}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-white/10 pt-5 text-[16px] leading-relaxed text-navy-200">{d.limite}</p>
            {/* Niente link alle pagine prodotto (revisione del 03/10): lì ci sono ancora tempi promessi, confronti con
                «gli altri software» e foto AI non dichiarate, e i loro pulsanti portano a WhatsApp, dove si perde
                l'etichetta «notizie». Si torna a metterlo quando quelle pagine seguono le stesse regole. */}
          </div>

          <div id="candidatura" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(2,6,23,0.35)] md:p-7">
              <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy">Candidati per la demo</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-600">
                La demo è per chi fa computi e preventivi per mestiere. Ci dici chi sei e ti chiamiamo entro 24 ore per
                fissarla.
              </p>
              <div className="mt-5">
                <ContattiForm prodottoFisso={p.valoreCrm} modoDemo testoPulsante="Invia la candidatura" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-main">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">Come funziona</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {PASSI.map((s, i) => (
              <li key={s.titolo}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-display text-[15px] font-bold text-white">{i + 1}</span>
                <span className="mt-4 block font-display text-lg font-semibold text-navy">{s.titolo}</span>
                <span className="mt-1.5 block text-[16px] leading-relaxed text-navy-600">{s.testo}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy-50 py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">Le domande di tutti</h2>
          <dl className="mt-6 divide-y divide-navy-200 border-y border-navy-200">
            {domande.map((q) => (
              <div key={q.d} className="py-5">
                <dt className="font-display text-[1.0625rem] font-semibold text-navy">{q.d}</dt>
                <dd className="mt-1.5 text-[16px] leading-relaxed text-navy-700">{q.r}</dd>
              </div>
            ))}
          </dl>
          <a href="#candidatura" className="btn-funnel mt-8">
            Candidati per la demo
          </a>
        </div>
      </section>
    </>
  );
}
