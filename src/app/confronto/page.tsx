import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import {
  Check,
  Minus,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Perché scegliere Cantieri Hub — Il confronto",
  description:
    "Cantieri Hub a confronto con i software di preventivazione tradizionali: Analisi Prezzi AI, estrazione automatica, cloud senza installazione, supporto umano diretto.",
  alternates: { canonical: "/confronto" },
};

const righe = [
  {
    criterio: "Analisi Prezzi AI per voci fuori prezzario",
    ch: "Sì, ricostruita componente per componente",
    chOk: true,
    trad: "No, la cerchi a mano",
    tradOk: false,
  },
  {
    criterio: "Estrazione da PDF, Excel e foto",
    ch: "Automatica, con l'AI",
    chOk: true,
    trad: "Inserimento manuale, voce per voce",
    tradOk: false,
  },
  {
    criterio: "Accesso ovunque, senza installazione",
    ch: "Cloud, da qualsiasi dispositivo",
    chOk: true,
    trad: "Spesso desktop, legato a un computer",
    tradOk: false,
  },
  {
    criterio: "Pensato per chi non è tecnico",
    ch: "Sì, usi subito senza corso",
    chOk: true,
    trad: "Curva di apprendimento ripida",
    tradOk: false,
  },
  {
    criterio: "Supporto umano diretto",
    ch: "WhatsApp e videochiamata con una persona",
    chOk: true,
    trad: "Ticket e centro assistenza",
    tradOk: false,
  },
  {
    criterio: "Aggiornamenti",
    ch: "Automatici, sempre inclusi",
    chOk: true,
    trad: "Spesso a pagamento, versione per versione",
    tradOk: false,
  },
];

export default function ConfrontoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Il confronto onesto
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Perché scegliere{" "}
                <span className="text-orange-400">Cantieri Hub.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                I software di preventivazione tradizionali sono nati per archiviare prezzari e far
                quadrare i conti. Cantieri Hub è nato per <strong className="text-white">farti fare il
                prezzo giusto, anche quando una voce sul prezzario non c&apos;è</strong>. Ecco la
                differenza, punto per punto.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tabella confronto */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Punto per punto</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Cosa cambia davvero nel lavoro di tutti i giorni.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Non è questione di funzioni in più. È questione di chi fa il lavoro al posto tuo e di
                quanto tempo ti restituisce ogni preventivo.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              {/* Intestazione tabella */}
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="hidden md:block bg-base p-5" />
                <div className="bg-navy p-5 text-center">
                  <span className="font-display font-bold text-white text-lg">Cantieri Hub</span>
                  <span className="mt-1 block text-xs font-semibold text-orange-400">
                    Il software AI per l&apos;edilizia
                  </span>
                </div>
                <div className="bg-base p-5 text-center border-t md:border-t-0 md:border-l border-gray-200">
                  <span className="font-display font-bold text-navy-500 text-lg">
                    Software tradizionali
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-navy-400">
                    Altri software di preventivazione
                  </span>
                </div>
              </div>

              {/* Righe */}
              {righe.map((r, i) => (
                <div
                  key={r.criterio}
                  className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] border-t border-gray-200 ${
                    i % 2 === 1 ? "bg-base/60" : "bg-white"
                  }`}
                >
                  {/* Criterio */}
                  <div className="p-5 md:p-6 flex items-center">
                    <span className="font-display font-bold text-navy text-base leading-snug">
                      {r.criterio}
                    </span>
                  </div>

                  {/* Colonna Cantieri Hub */}
                  <div className="px-5 pb-5 md:p-6 flex items-start gap-3 md:border-l border-gray-200">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center">
                      <Check size={15} className="text-orange-500" />
                    </span>
                    <span className="text-sm text-navy-500 leading-relaxed">{r.ch}</span>
                  </div>

                  {/* Colonna tradizionali */}
                  <div className="px-5 pb-5 md:p-6 flex items-start gap-3 border-t md:border-t-0 md:border-l border-gray-200 pt-5 md:pt-6">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Minus size={15} className="text-navy-400" />
                    </span>
                    <span className="text-sm text-navy-500 leading-relaxed">{r.trad}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-sm text-navy-400 text-center max-w-2xl mx-auto">
              Confronto generale con la categoria dei software di preventivazione tradizionali.
              Non citiamo marchi: ti mostriamo le differenze concrete, le verifichi tu sui tuoi file.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Il nostro vantaggio */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="eyebrow text-orange-500">Il nostro vantaggio</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  L&apos;Analisi Prezzi AI è quello che gli altri non hanno.
                </h2>
                <p className="mt-5 text-navy-500 leading-relaxed">
                  Tutti sanno archiviare un prezzario. La differenza si vede sulla voce che il prezzario
                  non ce l&apos;ha: quella che ti costringe a telefonare ai fornitori, spulciare vecchi
                  preventivi e stimare a sensazione. Cantieri Hub la{" "}
                  <strong className="text-navy">ricostruisce da zero</strong> — materiali, manodopera,
                  noli, spese generali, sicurezza — con un ragionamento che leggi, modifichi e firmi.
                </p>
                <p className="mt-4 text-navy-500 leading-relaxed">
                  È il motore dietro ogni preventivo, ed è la ragione per cui chi prova Cantieri Hub
                  non torna indietro.
                </p>
                <a
                  href="/analisi-prezzi"
                  className="mt-7 inline-flex items-center gap-2 text-orange-500 font-semibold"
                >
                  Scopri come funziona l&apos;Analisi Prezzi AI
                  <ArrowRight size={18} className="arrow" />
                </a>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
              <div className="rounded-2xl bg-navy p-7 md:p-9 text-white">
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Sparkles size={22} className="text-orange-400" />
                </div>
                <p className="mt-5 font-display font-bold text-xl">Quello che fai con Cantieri Hub</p>
                <ul className="mt-5 space-y-3.5 text-sm text-gray-300">
                  <li className="flex gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                      <Check size={13} className="text-orange-400" />
                    </span>
                    Prezzi qualsiasi voce, anche fuori prezzario, in pochi secondi
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                      <Check size={13} className="text-orange-400" />
                    </span>
                    Carichi un PDF o una foto e l&apos;AI estrae le voci per te
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                      <Check size={13} className="text-orange-400" />
                    </span>
                    Spieghi al cliente come hai fatto quel numero, riga per riga
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                      <Check size={13} className="text-orange-400" />
                    </span>
                    Hai una persona vera che ti risponde su WhatsApp quando serve
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title="Vuoi vedere la differenza dal vivo?"
        subtitle="Richiedi una demo: prendiamo una tua voce reale e te la prezziamo davanti, in pochi minuti."
        primaryLabel="Richiedi una demo"
        whatsappText="Ciao! Sto confrontando i software di preventivazione e vorrei vedere una demo di Cantieri Hub."
      />
    </>
  );
}
