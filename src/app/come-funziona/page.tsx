import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import { WA_DEMO } from "@/data/site";
import {
  MessageCircle,
  MonitorPlay,
  Users,
  Headphones,
  ArrowRight,
  Check,
  HandHeart,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Come funziona Cantieri Hub — Dalla demo all'uso quotidiano",
  description:
    "Il percorso completo per iniziare con Cantieri Hub: demo coi tuoi file reali, onboarding guidato con project manager dedicato e supporto umano diretto ogni giorno.",
  alternates: { canonical: "/come-funziona" },
};

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Prenoti una demo",
    desc: "Un messaggio su WhatsApp e basta. Niente form infiniti, niente call center. Ci scrivi, fissiamo mezz'ora insieme e parti da lì.",
  },
  {
    num: "02",
    icon: MonitorPlay,
    title: "Demo coi tuoi file reali",
    desc: "Non una presentazione finta su dati inventati. Porti un tuo computo, un tuo preventivo, una tua voce difficile — e vedi il valore dal vivo, sui lavori che fai davvero.",
  },
  {
    num: "03",
    icon: Users,
    title: "Onboarding guidato",
    desc: "Apriamo un gruppo WhatsApp dedicato con un project manager che ti segue di persona. Formazione passo passo sui tuoi file, finché non sei autonomo. Nessuno ti lascia solo davanti a un software.",
  },
  {
    num: "04",
    icon: Headphones,
    title: "Uso quotidiano con supporto umano",
    desc: "Ti serve una mano? Scrivi su WhatsApp o fai una videochiamata e parli con una persona vera. Nessun ticket anonimo, nessuna risposta automatica, nessuna attesa di giorni.",
  },
];

const noProvaMotivi = [
  {
    icon: HandHeart,
    title: "Il valore si vede sui tuoi lavori",
    desc: "Un software di preventivazione edile non lo capisci cliccando da solo cinque minuti. Lo capisci quando lo vedi girare sui tuoi computi reali, con qualcuno che ti guida.",
  },
  {
    icon: Users,
    title: "Ti seguiamo, non ti scarichiamo",
    desc: "Preferiamo affiancarti con un project manager dedicato dal primo giorno, invece di lasciarti perso in una prova gratuita che abbandoni dopo due giorni.",
  },
  {
    icon: ShieldCheck,
    title: "Vogliamo clienti che restano",
    desc: "Non ci interessa il numero di iscritti. Ci interessa che chi entra usi Cantieri Hub tutti i giorni e ci guadagni. Per questo partiamo da una demo seria, non da un test al buio.",
  },
];

export default function ComeFunzionaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="pill pill--navy">
                <span className="pill__dot" />
                Dalla curiosità all&apos;uso di tutti i giorni
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Come <span className="text-orange-400">funziona</span> Cantieri Hub.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Nessun salto nel vuoto. Ti accompagniamo dalla prima demo fino al lavoro quotidiano,
                con una persona vera al tuo fianco a ogni passo.{" "}
                <strong className="text-white">Tu porti i tuoi file, al resto pensiamo noi.</strong>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Il percorso in 4 step */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Il percorso</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Quattro passi, nessuna sorpresa.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Dal primo messaggio all&apos;uso di tutti i giorni. Sai esattamente cosa succede e quando,
                con la stessa persona che ti segue lungo tutto il percorso.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3.5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.num} delay={i * 0.06}>
                  <div className="flex items-start gap-5 p-5 md:p-7 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="shrink-0 flex flex-col items-center gap-3">
                      <span
                        className="font-display font-extrabold text-gradient-orange leading-none"
                        style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
                      >
                        {s.num}
                      </span>
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Icon size={20} className="text-orange-500" />
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-display font-bold text-navy text-lg md:text-xl">{s.title}</h3>
                      <p className="mt-2 text-sm md:text-base text-navy-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href={WA_DEMO}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-lg cta-shimmer"
              >
                Prenota la tua demo <span className="arrow">→</span>
              </a>
              <span className="text-sm text-navy-500">
                Mezz&apos;ora sui tuoi file. Nessun impegno.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cosa ottieni nell'onboarding */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal direction="left">
              <div className="h-full p-7 md:p-9 rounded-2xl bg-navy text-white">
                <p className="eyebrow text-orange-400">L&apos;onboarding</p>
                <h3 className="mt-3 font-display font-bold text-2xl">Non sei mai solo davanti al software.</h3>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  Dal primo giorno hai un <strong className="text-white">gruppo WhatsApp dedicato</strong> con
                  il tuo project manager. Niente manuali da studiare da solo: ti formiamo passo passo, sui
                  file che usi tu, finché non sei completamente autonomo.
                </p>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-white border border-gray-200">
                <p className="eyebrow text-orange-500">Cosa è incluso</p>
                <h3 className="mt-3 font-display font-bold text-navy text-2xl">Assistenza umana, sempre.</h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "Project manager dedicato che ti segue di persona",
                    "Formazione guidata sui tuoi file reali",
                    "Supporto su WhatsApp e videochiamata, non per ticket",
                    "Risposte da una persona vera, non da un bot",
                  ].map((t) => (
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

      {/* Perché niente prova gratuita */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Una scelta onesta</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Perché niente prova gratuita.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Te lo diciamo chiaro: non offriamo una prova gratuita, e non è per nasconderti qualcosa.
                È perché crediamo che il modo giusto di partire sia un altro.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noProvaMotivi.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.title} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-xl border border-gray-200 bg-gray-50 feature-card">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <h3 className="mt-4 font-display font-bold text-navy text-lg leading-snug">{m.title}</h3>
                    <p className="mt-2 text-sm text-navy-500 leading-relaxed">{m.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 max-w-3xl">
              <p className="text-navy-500 leading-relaxed text-lg">
                In mezz&apos;ora di demo sui tuoi file capisci più di quanto faresti in una settimana di prova
                a tentoni. <strong className="text-navy">Vedi il valore subito, sul tuo lavoro vero — e decidi con
                tutte le informazioni in mano.</strong>
              </p>
              <div className="mt-7 inline-flex items-center gap-2 text-orange-500 font-semibold">
                Inizia da una demo, non da un test al buio
                <ArrowRight size={18} className="arrow" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Pronto a vederlo sui tuoi file?"
        subtitle="Scrivici su WhatsApp: fissiamo mezz'ora e ti mostriamo Cantieri Hub sui tuoi computi reali, dal vivo."
        primaryLabel="Prenota una demo"
        whatsappText="Ciao! Ho letto come funziona Cantieri Hub e vorrei prenotare una demo gratuita."
      />
    </>
  );
}
