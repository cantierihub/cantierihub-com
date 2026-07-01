import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import { WA_CALCOLA } from "@/data/site";
import { Upload, ScanText, Database, Sparkles, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/calcola" },
  title: "Calcola il preventivo con l'AI — Dal computo al prezzo in pochi minuti",
  description:
    "Calcola il tuo preventivo edile con l'AI di Cantieri Hub: carichi il computo metrico, l'AI estrae le voci, abbina i prezzari regionali e stima le voci fuori prezzario. In pochi minuti, non in mezza giornata.",
  openGraph: {
    title: "Calcola il preventivo con l'AI — Dal computo al prezzo in pochi minuti",
    description:
      "Calcola il tuo preventivo edile con l'AI di Cantieri Hub: carichi il computo metrico, l'AI estrae le voci, abbina i prezzari regionali e stima le voci fuori prezzario. In pochi minuti, non in mezza giornata.",
    url: "https://cantierihub.com/calcola",
    type: "website",
  },
};

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Carichi il computo metrico",
    desc: "PDF, Excel o XML ricevuto dal committente, dallo studio tecnico o dalla stazione appaltante. Anche i documenti scansionati.",
  },
  {
    n: "02",
    icon: ScanText,
    title: "L'AI estrae le voci",
    desc: "Legge il file e ne ricava ogni singola lavorazione con quantità e unità di misura. Tu non riscrivi niente a mano.",
  },
  {
    n: "03",
    icon: Database,
    title: "Abbina i prezzari regionali",
    desc: "Ogni voce viene agganciata ai prezzari regionali italiani e al tuo prezzario aziendale, con un livello di confidenza che puoi verificare.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Stima le voci fuori prezzario",
    desc: "Per le lavorazioni che sul prezzario non ci sono, l'Analisi Prezzi AI ricostruisce il prezzo da zero: materiali, manodopera, noli, spese generali e sicurezza.",
  },
];

const risultato = [
  "Ogni voce è rivista e approvata da te prima di uscire",
  "Il prezzo si ricalcola in tempo reale quando lo modifichi",
  "Esporti in PDF ed Excel con il tuo logo e i tuoi colori",
];

export default function CalcolaPage() {
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
                Il preventivo edile, calcolato dall&apos;AI
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Calcola il tuo preventivo{" "}
                <span className="text-orange-400">con l&apos;AI.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Dal computo metrico al prezzo in pochi minuti, non in mezza giornata. Carichi il file,
                l&apos;AI fa il lavoro pesante,{" "}
                <strong className="text-white">tu rivedi e mandi.</strong>
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={WA_CALCOLA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg cta-shimmer w-full sm:w-auto justify-center"
                >
                  Calcola con noi su WhatsApp <span className="arrow">→</span>
                </a>
                <a href="/preventivatore" className="btn-ghost-white btn-lg w-full sm:w-auto justify-center">
                  Scopri il Preventivatore
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Come si calcola */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">In quattro passi</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Come si calcola un preventivo con Cantieri Hub.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Niente più voci battute a mano e prezzi cercati su tre fonti diverse. Carichi il
                computo e l&apos;AI lo trasforma in un preventivo pronto, voce per voce.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.n} delay={i * 0.06}>
                  <div className="h-full flex items-start gap-5 p-6 rounded-xl bg-base border border-gray-200 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-orange-500 tracking-widest">{s.n}</span>
                      <h3 className="mt-1 font-display font-bold text-navy text-lg">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-navy-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Richiamo Analisi Prezzi AI */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal direction="left">
              <div className="h-full p-7 md:p-9 rounded-2xl bg-navy text-white">
                <p className="eyebrow text-orange-400">Il caso più difficile</p>
                <h3 className="mt-3 font-display font-bold text-2xl leading-tight">
                  E le voci che sul prezzario non ci sono?
                </h3>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  Sono quelle che ti rubano mezza giornata: telefonate ai fornitori, vecchi preventivi
                  da spulciare, stime fatte a sensazione. Per quelle c&apos;è l&apos;Analisi Prezzi AI.
                </p>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  Ricostruisce il prezzo da zero — <strong className="text-white">materiali, manodopera,
                  noli, spese generali, sicurezza</strong> — con un ragionamento che puoi leggere,
                  modificare e firmare.
                </p>
                <a
                  href="/preventivatore"
                  className="mt-6 inline-flex items-center gap-2 text-orange-400 font-semibold"
                >
                  Scopri l&apos;Analisi Prezzi AI <ArrowRight size={18} className="arrow" />
                </a>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-white border border-gray-200">
                <p className="eyebrow text-orange-500">Il risultato</p>
                <h3 className="mt-3 font-display font-bold text-navy text-2xl">Un preventivo che è tuo.</h3>
                <p className="mt-4 text-sm text-navy-500 leading-relaxed">
                  L&apos;AI fa la corsa, ma l&apos;ultima parola è sempre la tua. Niente numeri calati
                  dall&apos;alto che non sai spiegare al cliente.
                </p>
                <ul className="mt-6 space-y-3">
                  {risultato.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-navy-500">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                        <Check size={13} className="text-orange-500" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title="Calcola il tuo prossimo preventivo con l'AI."
        subtitle="Scrivici su WhatsApp: lo calcoliamo insieme sui tuoi file reali, dal vivo."
        primaryLabel="Calcola con noi su WhatsApp"
        whatsappText="Ciao! Vorrei calcolare un preventivo con l'AI di Cantieri Hub."
      />
    </>
  );
}
