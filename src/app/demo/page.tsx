import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import { WA_DEMO } from "@/data/site";
import {
  Calculator,
  Sparkles,
  FileText,
  Clock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Prenota la tua demo gratuita — Cantieri Hub",
  description:
    "30 minuti, dal vivo, sui tuoi file reali. Ti mostriamo come Cantieri Hub lavora il tuo computo metrico, scompone i prezzi con l'AI e ti restituisce un PDF pronto. Nessun impegno.",
  alternates: { canonical: "/demo" },
};

const cosaVedi = [
  {
    icon: Calculator,
    nome: "Il tuo computo lavorato dal vivo",
    desc: "Portiamo un tuo file vero e lo lavoriamo davanti a te: in pochi minuti il computo metrico è pronto, non in mezza giornata.",
  },
  {
    icon: Sparkles,
    nome: "L'Analisi Prezzi AI sulle tue voci",
    desc: "Prendiamo le voci critiche del tuo lavoro — anche quelle fuori prezzario — e ti facciamo vedere come l'AI le scompone pezzo per pezzo.",
  },
  {
    icon: FileText,
    nome: "Il PDF brandizzato pronto da inviare",
    desc: "Chiudiamo con il preventivo finito, con il tuo logo e i tuoi colori, pronto da mandare al cliente. Dall'inizio alla fine, in 30 minuti.",
  },
];

const perchePunti = [
  {
    icon: Clock,
    titolo: "Calibrata sul tuo caso",
    desc: "Non una demo generica registrata: lavoriamo sui tuoi file e sul tuo modo di fare i preventivi.",
  },
  {
    icon: UserCheck,
    titolo: "Un consulente dedicato",
    desc: "Dall'altra parte c'è una persona che conosce l'edilizia, non un chatbot. Rispondi a tutte le domande che vuoi.",
  },
  {
    icon: ShieldCheck,
    titolo: "Nessun impegno",
    desc: "Vedi il valore con i tuoi occhi prima di qualsiasi decisione. Se non fa per te, lo capisci in 30 minuti.",
  },
];

export default function DemoPage() {
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
                Demo dal vivo · 30 minuti
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Prenota la tua demo{" "}
                <span className="text-orange-400">gratuita.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                30 minuti, dal vivo. Vedi il prodotto lavorare sui{" "}
                <strong className="text-white">tuoi file reali</strong> — il tuo
                computo, le tue voci, il tuo preventivo finito. Nessun impegno.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={WA_DEMO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg cta-shimmer"
                >
                  Prenota su WhatsApp <span className="arrow">→</span>
                </a>
                <span className="text-sm" style={{ color: "#94a3b8" }}>
                  Ti rispondiamo di persona e fissiamo l&apos;orario.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa vedi in 30 minuti */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Cosa vedi in 30 minuti</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Tre cose concrete. Tutte sui tuoi file.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Niente slide. Apriamo il prodotto e ti mostriamo l&apos;intero
                percorso, dal computo al PDF da inviare — con materiale tuo, non
                di esempio.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3.5">
            {cosaVedi.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.nome} delay={i * 0.08}>
                  <div className="flex items-start gap-5 p-5 md:p-6 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{c.nome}</h3>
                      <p className="mt-1 text-sm text-navy-500 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perché una demo e non una prova gratuita */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="eyebrow text-orange-500">Perché una demo, non una prova gratuita</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  Ti mostriamo il valore. Non ti lasciamo solo davanti a uno schermo.
                </h2>
                <p className="mt-5 text-navy-500 leading-relaxed">
                  Ogni attivazione ha un costo reale di configurazione e di
                  affiancamento. Per questo non regaliamo una prova alla cieca:
                  preferiamo dedicarti 30 minuti veri e farti vedere il prodotto{" "}
                  <strong className="text-navy">calibrato sul tuo caso</strong>.
                </p>
                <p className="mt-4 text-navy-500 leading-relaxed">
                  Una prova lasciata a sé spesso resta inutilizzata, perché non sai
                  da dove iniziare. Una demo guidata, sui tuoi file, ti fa capire in
                  mezz&apos;ora se Cantieri Hub fa al caso tuo. Senza perdere tempo.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
              <div className="grid gap-3.5">
                {perchePunti.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.titolo}
                      className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Icon size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-navy">{p.titolo}</p>
                        <p className="mt-1 text-sm text-navy-500 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-orange-500 font-semibold text-center">
              30 minuti per capire se è la cosa giusta per la tua impresa
              <ArrowRight size={18} className="arrow" />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Pronto a vederlo sui tuoi file?"
        subtitle="Scrivici su WhatsApp: fissiamo la demo e in 30 minuti ti mostriamo tutto, dal vivo."
        primaryLabel="Prenota su WhatsApp"
        whatsappText="Ciao! Vorrei prenotare una demo gratuita di Cantieri Hub."
      />
    </>
  );
}
