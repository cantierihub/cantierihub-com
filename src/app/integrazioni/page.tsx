import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image,
  Database,
  Download,
  Check,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Integrazioni — Si integra con come già lavori",
  description:
    "Cantieri Hub legge i tuoi file (PDF, Excel, XML di settore, piantine e foto), include i prezzari DEI e regionali, importa il tuo prezzario interno ed esporta PDF ed Excel col tuo logo. Niente da cambiare nel tuo modo di lavorare.",
  alternates: { canonical: "/integrazioni" },
};

const formatiIngresso = [
  {
    icon: FileText,
    nome: "PDF",
    desc: "Computi, capitolati e documenti di gara: li carichi così come sono, ci pensa l'AI a leggerli.",
  },
  {
    icon: FileSpreadsheet,
    nome: "Excel — .xlsx e .xls",
    desc: "I tuoi fogli di calcolo, vecchi e nuovi. Voci, quantità e prezzi entrano senza che tu riscriva nulla.",
  },
  {
    icon: FileCode,
    nome: "XML standard di settore",
    desc: "Il formato di scambio dei computi metrici. Importi ed esporti senza perdere un dato per strada.",
  },
  {
    icon: Image,
    nome: "Piantine e foto di cantiere",
    desc: "Immagini di planimetrie e foto del sopralluogo: l'AI le interpreta e le trasforma in punto di partenza.",
  },
];

const prezzari = [
  "Prezzario DEI sempre incluso e aggiornato",
  "Prezzari regionali italiani, regione per regione",
  "Il tuo prezzario interno importato da Excel, CSV o PDF",
  "I tuoi prezzi storici diventano parte del motore, non vanno persi",
];

const exportFeatures = [
  "Export in PDF pronto da consegnare al cliente",
  "Export in Excel modificabile per il tuo ufficio tecnico",
  "Il tuo logo e i tuoi colori su ogni documento",
  "Layout pulito e professionale, senza rimettere mano all'impaginazione",
];

const flusso = [
  {
    n: "01",
    titolo: "Computatore AI",
    desc: "Carichi i tuoi file e ottieni il computo metrico: voci, quantità e misurazioni pronte da rivedere.",
  },
  {
    n: "02",
    titolo: "Preventivatore AI",
    desc: "Il computo passa direttamente al preventivo. Aggiungi prezzi, margini e condizioni e il documento è pronto.",
  },
  {
    n: "03",
    titolo: "Documento finale",
    desc: "Esporti in PDF o Excel col tuo brand, pronto da inviare. Un unico flusso, dal file grezzo al cliente.",
  },
];

export default function IntegrazioniPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Nessuna rivoluzione, solo i tuoi strumenti
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Si integra con{" "}
                <span className="text-orange-400">come già lavori.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Non devi cambiare i tuoi file, né buttare via i prezzari che usi da anni. Cantieri Hub
                legge quello che hai già — PDF, Excel, XML, perfino le piantine — e ti restituisce
                documenti col tuo logo. <strong className="text-white">Tu continui a lavorare come sai,
                solo molto più in fretta.</strong>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Formati in ingresso */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Cosa puoi caricare</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Porti i tuoi file, ci pensa l&apos;AI.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Niente formati strani da preparare a mano. Carichi quello che hai sul computer e nella
                casella di posta, esattamente come ti arriva.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {formatiIngresso.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.nome} delay={i * 0.06}>
                  <div className="h-full flex items-start gap-5 p-5 md:p-6 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{f.nome}</h3>
                      <p className="mt-1 text-sm text-navy-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prezzari */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="eyebrow text-orange-500">I prezzari giusti</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  I prezzari che ti servono, più il tuo.
                </h2>
                <p className="mt-5 text-navy-500 leading-relaxed">
                  Dentro Cantieri Hub trovi già il <strong className="text-navy">DEI</strong> e i
                  <strong className="text-navy"> prezzari regionali italiani</strong>. E se hai costruito
                  il tuo listino negli anni, lo importi: i tuoi prezzi continuano a valere, non li
                  perdi e non riparti da zero.
                </p>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="rounded-2xl border border-gray-200 bg-white p-7 md:p-9">
                <div className="flex items-center gap-3 mb-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Database size={18} className="text-orange-500" />
                  </div>
                  <p className="font-display font-bold text-navy text-lg">Quali prezzari usi</p>
                </div>
                <ul className="space-y-3.5">
                  {prezzari.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-navy-500">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                        <Check size={13} className="text-orange-500" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-navy-500">
                  Importi il tuo prezzario interno da Excel, CSV o PDF — il formato che hai già.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Export brandizzato */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-9 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Download size={18} className="text-orange-500" />
                  </div>
                  <p className="font-display font-bold text-navy text-lg">Come esci dal sistema</p>
                </div>
                <ul className="space-y-3.5">
                  {exportFeatures.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-sm text-navy-500">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                        <Check size={13} className="text-orange-500" />
                      </span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="order-1 md:order-2">
                <span className="eyebrow text-orange-500">Export col tuo brand</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  Esce col tuo logo, non col nostro.
                </h2>
                <p className="mt-5 text-navy-500 leading-relaxed">
                  Il documento che consegni al cliente è il tuo. Esporti in
                  <strong className="text-navy"> PDF</strong> per la consegna e in
                  <strong className="text-navy"> Excel</strong> per il tuo ufficio tecnico, con il
                  logo e i colori della tua azienda già al posto giusto. Niente impaginazioni da
                  rifare a mano.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Flusso Computatore -> Preventivatore */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Un unico flusso</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Dal file grezzo al preventivo, senza salti.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Il <strong className="text-navy">Computatore AI</strong> e il
                <strong className="text-navy"> Preventivatore AI</strong> sono collegati: quello che
                misuri nel primo passa al secondo da solo. Niente copia-incolla tra strumenti diversi.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {flusso.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="h-full p-7 rounded-2xl bg-white border border-gray-200 feature-card">
                  <span className="font-display font-extrabold text-3xl text-gradient-orange">
                    {step.n}
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <h3 className="font-display font-bold text-navy text-lg">{step.titolo}</h3>
                    {i < flusso.length - 1 && (
                      <ArrowRight size={16} className="text-orange-500 arrow hidden md:block" />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-navy-500 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rassicurazione finale */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Non cambi tu, cambia solo la velocità.
              </h2>
              <p className="mt-5 text-navy-500 leading-relaxed text-lg">
                I tuoi file, i tuoi prezzari, il tuo logo, il tuo modo di fare i conti. Cantieri Hub si
                inserisce in quello che fai già — toglie le ore di lavoro manuale e ti lascia il
                controllo su ogni numero.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-orange-500 font-semibold">
                Tutto dentro un&apos;unica piattaforma
                <ArrowRight size={18} className="arrow" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Funziona coi tuoi file?"
        subtitle="Mandaci un computo o un Excel reale: te lo facciamo girare nella demo e vedi coi tuoi occhi che si integra."
        primaryLabel="Richiedi una demo"
        whatsappText="Ciao! Vorrei capire se Cantieri Hub si integra coi miei file e prezzari. Posso mandarvi un esempio?"
      />
    </>
  );
}
