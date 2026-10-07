import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Simulatore from "@/components/prova/Simulatore";
import ClipProdotto from "@/components/prova/ClipProdotto";
import { ANGOLI, eAngolo } from "@/lib/prova/analisi";
import { CLIP_PRODOTTO, COSA_NON_FA, DOMANDE_PROVA, PASSI_CHIAMATA, PROVE, TITOLO_PROVA } from "@/data/provaAnalisi";
import { waLink } from "@/data/site";

// La prova dell'Analisi Prezzi del Preventivatore (07/10/2026): la pagina che il CRM manda su WhatsApp subito dopo la
// richiesta del lead, per fargli provare il prodotto prima della chiamata. Due angoli da confrontare, stessa prova:
// /prova/margine e /prova/fuori-prezzario. I testi stanno in data/provaAnalisi.ts, le regole in lib/prova/analisi.ts.
//
// ⚠️ Niente foto: quelle delle pagine prodotto sono fatte con l'AI e non dichiarate. Qui le immagini sono il prodotto vero.

export const dynamicParams = false;

export function generateStaticParams() {
  return ANGOLI.map((angolo) => ({ angolo }));
}

export async function generateMetadata({ params }: { params: Promise<{ angolo: string }> }): Promise<Metadata> {
  const { angolo } = await params;
  if (!eAngolo(angolo)) return {};
  const t = PROVE[angolo];
  return {
    title: TITOLO_PROVA,
    description: t.descrizioneMeta,
    // Pagina personale, mandata su WhatsApp: non si cerca su Google.
    robots: { index: false, follow: false },
    alternates: { canonical: `/prova/${angolo}` },
    openGraph: { title: `${TITOLO_PROVA} · Cantieri Hub`, description: t.descrizioneMeta, url: `/prova/${angolo}`, type: "website" },
  };
}

export default async function PaginaProva({ params }: { params: Promise<{ angolo: string }> }) {
  const { angolo } = await params;
  if (!eAngolo(angolo)) notFound();
  const t = PROVE[angolo];
  const whatsapp = waLink(t.messaggioWhatsApp);

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-8 md:pb-28 md:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="container-main relative max-w-3xl">
          <p className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
            Preventivatore · prova gratuita
          </p>
          <h1 className="mt-5 text-balance font-display text-[2.125rem] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[3rem] md:leading-[1.05]">
            {TITOLO_PROVA}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-200 md:text-xl">{t.sottotitolo}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {t.punti.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[16px] font-medium text-white">
                <Check size={18} strokeWidth={2.5} className="text-orange-400" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="prova" className="scroll-mt-20 bg-navy-50 pb-14 md:pb-20">
        <div className="container-main relative -mt-16 max-w-3xl">
          <Simulatore
            angolo={angolo}
            prezzoTuoInVista={t.prezzoTuoInVista}
            etichettaPrezzoTuo={t.etichettaPrezzoTuo}
            aiutoPrezzoTuo={t.aiutoPrezzoTuo}
            whatsapp={whatsapp}
          />
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="text-balance font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">{t.dopoIlRisultato.titolo}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-navy-700 md:text-lg">{t.dopoIlRisultato.testo}</p>

          <h2 className="mt-12 text-balance font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">{t.titoloProdotto}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-navy-700 md:text-lg">{t.testoProdotto}</p>
          <ol className="mt-8 space-y-10">
            {CLIP_PRODOTTO.map((c, i) => (
              <li key={c.file}>
                <div className="flex items-baseline gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-500 font-display text-[15px] font-bold text-navy" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy md:text-xl">{c.titolo}</h3>
                    <p className="mt-1 text-[16px] leading-relaxed text-navy-700">{c.testo}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <ClipProdotto file={c.file} titolo={c.titolo} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy-50 py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">Cosa succede adesso</h2>
          <ol className="mt-8 space-y-7">
            {PASSI_CHIAMATA.map((p, i) => (
              <li key={p.titolo} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy font-display text-[15px] font-bold text-white" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-navy">{p.titolo}</span>
                  <span className="mt-1 block text-[16px] leading-relaxed text-navy-700">{p.testo}</span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-14 font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">Cosa non fa</h2>
          <ul className="mt-5 space-y-3">
            {COSA_NON_FA.map((c) => (
              <li key={c} className="flex gap-3 text-[17px] leading-relaxed text-navy-800">
                <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-navy md:text-3xl">Le domande di tutti</h2>
          <dl className="mt-6 divide-y divide-navy-200 border-y border-navy-200">
            {DOMANDE_PROVA.map((q) => (
              <div key={q.d} className="py-5">
                <dt className="font-display text-[1.0625rem] font-semibold text-navy">{q.d}</dt>
                <dd className="mt-1.5 text-[16px] leading-relaxed text-navy-700">{q.r}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-[15px] leading-relaxed text-navy-600">
            Più dettagli su come trattiamo i dati nella{" "}
            <a href="/privacy" className="font-semibold text-navy underline underline-offset-2">
              privacy
            </a>{" "}
            e su come usiamo l&apos;AI in{" "}
            <a href="/ai-trasparenza" className="font-semibold text-navy underline underline-offset-2">
              AI e trasparenza
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-navy py-14 md:py-20">
        <div className="container-main max-w-3xl">
          <h2 className="text-balance font-display text-2xl font-bold tracking-[-0.01em] text-white md:text-3xl">Vuoi vederlo sul tuo computo?</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-navy-200 md:text-lg">
            Ti chiamiamo noi. Se preferisci scriverci prima, siamo su WhatsApp.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#prova" className="btn-funnel">
              Torna alla prova
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-funnel !bg-white hover:!bg-navy-100">
              Scrivici su WhatsApp <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
