import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import { WA_DEMO, waLink } from "@/data/site";
import {
  KeyRound,
  Users,
  Boxes,
  Headset,
  Check,
  Eye,
  FileSearch,
  Handshake,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Prezzo Cantieri Hub — Come funziona e cosa è incluso",
  description:
    "Come funziona il prezzo di Cantieri Hub: licenza annuale, tutti i moduli inclusi, onboarding e supporto. Il prezzo te lo mostriamo in demo, su misura per la tua impresa.",
  alternates: { canonical: "/prezzo" },
  openGraph: {
    title: "Prezzo Cantieri Hub — Come funziona e cosa è incluso",
    description:
      "Come funziona il prezzo di Cantieri Hub: licenza annuale, tutti i moduli inclusi, onboarding e supporto. Il prezzo te lo mostriamo in demo, su misura per la tua impresa.",
    url: "https://cantierihub.com/prezzo",
    type: "website",
  },
};

const inclusi = [
  {
    icon: KeyRound,
    nome: "Licenza annuale completa",
    desc: "Un'unica licenza per un anno intero di lavoro. Nessun rinnovo nascosto, nessuna sorpresa a metà strada.",
  },
  {
    icon: Users,
    nome: "Tre utenti inclusi",
    desc: "Tu e il tuo team lavorate sulla stessa piattaforma: fino a tre account compresi nella licenza.",
  },
  {
    icon: Boxes,
    nome: "Tutti i moduli, davvero tutti",
    desc: "Accesso a ogni funzione di Cantieri Hub. Niente funzioni “premium” a pagamento sbloccate dopo: quello che vedi in demo è quello che usi.",
  },
  {
    icon: Headset,
    nome: "Onboarding e supporto",
    desc: "Ti accompagniamo all'avvio passo passo. Poi hai assistenza diretta su WhatsApp e in videochiamata quando ti serve.",
  },
];

const perchEinDemo = [
  {
    icon: FileSearch,
    titolo: "Lo vedi sui tuoi file",
    desc: "Portiamo i tuoi computi e i tuoi preventivi reali dentro la piattaforma. Capisci subito cosa cambia per la tua impresa, non in teoria.",
  },
  {
    icon: Handshake,
    titolo: "È su misura per te",
    desc: "Ogni impresa parte da una situazione diversa. Te lo presentiamo quando abbiamo capito come lavori, così la proposta è cucita addosso a te.",
  },
  {
    icon: Eye,
    titolo: "Niente prezzo al buio",
    desc: "Un numero scritto su una pagina, senza contesto, non ti dice nulla. Preferiamo mostrartelo dopo che hai visto con i tuoi occhi cosa ottieni.",
  },
];

export default function PrezzoPage() {
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
                Trasparenza, senza sorprese
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Come funziona <span className="text-orange-400">il prezzo.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Una licenza chiara, tutti i moduli inclusi e nessun costo nascosto. La cifra esatta
                te la mostriamo in demo, cucita sulla tua impresa.{" "}
                <strong className="text-white">Niente mensile, niente sorprese.</strong>
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={waLink(
                    "Ciao! Vorrei capire come funziona il prezzo di Cantieri Hub.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg cta-shimmer"
                >
                  Chiedi il prezzo in demo <span className="arrow">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa è incluso */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Cosa è incluso</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Tutto dentro un&apos;unica licenza.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Niente pacchetti da comporre, niente moduli da sbloccare uno alla volta. Paghi una
                licenza e hai accesso a tutto Cantieri Hub, con l&apos;assistenza per partire bene.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3.5">
            {inclusi.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.nome} delay={i * 0.06}>
                  <div className="flex items-start gap-5 p-5 md:p-6 rounded-xl bg-white border border-navy-200 feature-card">
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

      {/* Perché il prezzo lo vedi in demo */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Il metodo</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Perché il prezzo lo vedi in demo.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Non ti nascondiamo nulla: ti mostriamo il prezzo quando hai visto il prodotto coi
                tuoi file. Così capisci esattamente cosa stai prendendo e quanto vale per te.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perchEinDemo.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.titolo} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-xl border border-navy-200 bg-white feature-card">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <p className="mt-4 font-display font-bold text-navy text-lg">{p.titolo}</p>
                    <p className="mt-2 text-sm text-navy-500 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Niente mensile, possibilità di rateizzare */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-navy text-white">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <CalendarCheck size={20} className="text-orange-400" />
                </div>
                <p className="mt-5 eyebrow text-orange-400">Una volta l&apos;anno</p>
                <h3 className="mt-3 font-display font-bold text-2xl">Niente mensile.</h3>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  Non c&apos;è un abbonamento mensile che ti pesa addosso ogni trenta giorni. Una
                  licenza annuale, chiara, che copre un anno intero di lavoro.{" "}
                  <strong className="text-white">Decidi una volta e lavori sereno.</strong>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-white border border-navy-200 feature-card">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard size={20} className="text-orange-500" />
                </div>
                <p className="mt-5 eyebrow text-orange-500">Se serve</p>
                <h3 className="mt-3 font-display font-bold text-navy text-2xl">
                  Possibilità di rateizzare.
                </h3>
                <p className="mt-4 text-navy-500 text-sm leading-relaxed">
                  La formula standard è annuale. In casi particolari possiamo rendere l&apos;avvio più
                  leggero: ne parliamo direttamente insieme, in base alla tua situazione.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Nessuna sorpresa */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-orange-50 items-center justify-center mb-6">
                <ShieldCheck size={26} className="text-orange-500" />
              </div>
              <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Quello che vedi è quello che paghi.
              </h2>
              <p className="mt-5 text-navy-500 leading-relaxed text-lg">
                Nessuna funzione bloccata dietro un costo extra, nessun aumento a sorpresa, nessuna
                clausola scritta in piccolo. In demo ti diciamo il prezzo esatto per la tua impresa e
                cosa comprende, voce per voce.
              </p>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-navy-600">
                {[
                  "Tutti i moduli inclusi",
                  "Tre utenti compresi",
                  "Onboarding e supporto",
                  "Nessun costo nascosto",
                ].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                      <Check size={13} className="text-orange-500" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 inline-flex items-center gap-2 text-orange-500 font-semibold">
                <a
                  href={WA_DEMO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Vedi il prezzo sui tuoi file in demo
                  <ArrowRight size={18} className="arrow" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Vuoi sapere quanto costa per te?"
        subtitle="Scrivici su WhatsApp: ti mostriamo Cantieri Hub coi tuoi file e ti diciamo il prezzo esatto, su misura per la tua impresa."
        primaryLabel="Chiedi il prezzo"
        whatsappText="Ciao! Vorrei capire come funziona il prezzo di Cantieri Hub."
      />
    </>
  );
}
