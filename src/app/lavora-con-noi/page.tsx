import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CandidaturaForm from "./CandidaturaForm";
import { Sparkles, TrendingUp, Award, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Lavora con noi — Entra nel team di Cantieri Hub",
  description:
    "Cantieri Hub assume: venditori, setter, sales manager, marketing e developer. Società giovane che porta l'AI nell'edilizia italiana. Candidati e allega il tuo CV.",
};

const valori = [
  {
    icon: Sparkles,
    titolo: "Un prodotto vero",
    desc: "Niente fuffa: costruisci e vendi software che gli imprenditori edili usano ogni giorno per lavorare meglio.",
  },
  {
    icon: TrendingUp,
    titolo: "Crescita rapida",
    desc: "Siamo una società giovane che corre. Le responsabilità — e le occasioni — arrivano in fretta per chi le sa prendere.",
  },
  {
    icon: Award,
    titolo: "Meritocrazia",
    desc: "Conta quello che produci, non da quanto tempo sei qui. I compensi seguono i risultati, senza tetti nascosti.",
  },
  {
    icon: Users,
    titolo: "Persone, prima",
    desc: "Team piccolo e diretto, zero burocrazia. Lealtà, umiltà e voglia di spingere: i valori su cui non transigiamo.",
  },
];

const posizioni = [
  {
    ruolo: "Venditore / Closer",
    area: "Vendite",
    desc: "Chiudi trattative in videochiamata con imprenditori edili. Demo, metodo, formazione continua e un prodotto che si vende.",
  },
  {
    ruolo: "Setter / Appuntamentista",
    area: "Vendite",
    desc: "Sei la prima linea: qualifichi i lead e fissi gli appuntamenti per i closer. Telefono, messaggi, ritmo.",
  },
  {
    ruolo: "Sales Manager",
    area: "Vendite",
    desc: "Guidi il reparto commerciale: coordini closer e setter, gestisci numeri, formazione e performance del team.",
  },
  {
    ruolo: "Marketing & Contenuti",
    area: "Marketing",
    desc: "Crei contenuti, gestisci ads e social, porti il brand Cantieri Hub davanti al mercato edile italiano.",
  },
  {
    ruolo: "Developer",
    area: "Prodotto",
    desc: "Costruisci i prodotti AI dell'ecosistema. Stack moderno, problemi concreti, impatto immediato sul prodotto.",
  },
];

export default function LavoraConNoiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/6 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Si assume
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.8vw, 3.6rem)" }}
              >
                Vieni a costruire <span className="text-orange-400">Cantieri Hub.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Portiamo l&apos;AI nel mondo delle costruzioni e cresciamo in fretta. Cerchiamo persone
                ambiziose, oneste e con voglia di spingere. Se ti riconosci, il tuo posto potrebbe essere qui.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <a href="#posizioni" className="btn-primary btn-lg cta-shimmer">
                  Vedi le posizioni aperte <ArrowRight size={18} className="arrow" />
                </a>
                <a href="#candidatura" className="btn-ghost-white btn-lg">
                  Candidati ora
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Perché lavorare con noi */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Perché noi</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Un posto dove quello che fai conta davvero.
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {valori.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.titolo} delay={i * 0.07}>
                  <div className="h-full flex items-start gap-4 p-6 rounded-2xl border border-gray-200 bg-gray-50 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{v.titolo}</h3>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posizioni aperte */}
      <section id="posizioni" style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Posizioni aperte</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Cinque modi per entrare nel team.
              </h2>
            </div>
          </Reveal>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {posizioni.map((p, i) => (
              <Reveal key={p.ruolo} delay={i * 0.05}>
                <a
                  href="#candidatura"
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-6 border-b border-gray-100 last:border-0 hover:bg-orange-50/40 transition-colors"
                >
                  <div className="sm:w-44 shrink-0">
                    <h3 className="font-display font-bold text-navy text-lg group-hover:text-orange-600 transition-colors">
                      {p.ruolo}
                    </h3>
                    <span className="inline-block mt-1.5 text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
                      {p.area}
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  <span className="hidden sm:flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-500">
                    Candidati <ArrowRight size={15} className="arrow" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form candidatura */}
      <section id="candidatura" className="section-padding bg-white scroll-mt-20">
        <div className="container-narrow">
          <Reveal>
            <div className="text-center mb-10">
              <span className="eyebrow text-orange-500">Candidati</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Mandaci la tua candidatura.
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed max-w-lg mx-auto">
                Compila il modulo e allega il CV. Leggiamo tutto — e se il profilo è in linea ti
                ricontattiamo noi.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
              <CandidaturaForm />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-sm text-gray-500">
              Non trovi il tuo ruolo? Scrivici comunque a{" "}
              <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline font-medium">
                info@cantierihub.com
              </a>
              : le persone brave ce le teniamo strette.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
