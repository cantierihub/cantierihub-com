import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import {
  ArrowRight,
  FileText,
  Calculator,
  HardHat,
  BookOpen,
  Mail,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/risorse" },
  title: "Risorse per imprese edili — Guide, computo metrico e gestione cantieri",
  description:
    "Il punto di partenza per chi costruisce: guide pratiche gratuite su preventivi, computo metrico e gestione cantieri, più nuovi approfondimenti in arrivo.",
  openGraph: {
    title: "Risorse per imprese edili — Guide, computo metrico e gestione cantieri",
    description:
      "Il punto di partenza per chi costruisce: guide pratiche gratuite su preventivi, computo metrico e gestione cantieri, più nuovi approfondimenti in arrivo.",
    url: "https://cantierihub.com/risorse",
    type: "website",
  },
};

const guideTemi = [
  {
    icon: FileText,
    titolo: "Preventivi che reggono",
    desc: "Come costruire un preventivo chiaro, completo e che difende il tuo margine fino alla fine del lavoro.",
  },
  {
    icon: Calculator,
    titolo: "Computo metrico senza errori",
    desc: "Il metodo per misurare le quantità giuste ed evitare le voci dimenticate che ti mangiano l'utile.",
  },
  {
    icon: HardHat,
    titolo: "Gestione cantieri",
    desc: "Tenere sotto controllo costi, tempi e fornitori senza perdere mezza giornata dietro ai conti.",
  },
];

const inArrivo = [
  {
    icon: BookOpen,
    titolo: "Approfondimenti operativi",
    desc: "Articoli pratici sui temi che fanno la differenza per un'impresa edile: dalla marginalità alla gestione dei clienti.",
  },
  {
    icon: Calculator,
    titolo: "Esempi reali di scomposizione costi",
    desc: "Come si costruisce davvero il prezzo di una voce d'opera, passo per passo, su lavorazioni concrete.",
  },
  {
    icon: HardHat,
    titolo: "Checklist e modelli scaricabili",
    desc: "Strumenti pronti all'uso per non dimenticare nulla in fase di preventivo e di apertura cantiere.",
  },
];

export default function RisorsePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-white overflow-hidden">
        {/* Dot grid */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, rgba(15,23,42,0.065) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Orange glow top-right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 500,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)",
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="pill">
                <span className="pill__dot" />
                Risorse gratuite per imprese edili
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-navy leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                Risorse per chi <span className="text-orange-500">costruisce</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-navy-500 leading-relaxed max-w-2xl">
                Guide pratiche, metodi e strumenti pensati per chi lavora in cantiere
                ogni giorno. Niente teoria: solo cose che ti fanno{" "}
                <strong className="text-navy">risparmiare tempo e difendere il margine</strong>.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Guide gratuite — card grande */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <Link
              href="/guide"
              className="group block rounded-2xl bg-navy overflow-hidden feature-card"
            >
              <div className="relative p-8 md:p-12">
                {/* Glow interno */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none"
                />
                <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-7 md:gap-10 items-center">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                    <BookOpen size={30} className="text-orange-400" />
                  </div>
                  <div>
                    <span className="eyebrow text-orange-400">Disponibili ora</span>
                    <h2 className="mt-2 font-display font-extrabold text-white text-2xl md:text-3xl leading-tight">
                      Guide gratuite
                    </h2>
                    <p className="mt-3 text-gray-300 leading-relaxed max-w-2xl">
                      Scarica le guide pratiche su{" "}
                      <strong className="text-white">preventivi</strong>,{" "}
                      <strong className="text-white">computo metrico</strong> e{" "}
                      <strong className="text-white">gestione cantieri</strong>. PDF concreti,
                      scritti per imprenditori edili, da leggere e usare subito.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-orange-400 font-semibold">
                      Vai alle guide
                      <ArrowRight size={18} className="arrow" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Temi delle guide */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {guideTemi.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.titolo} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-xl border border-gray-200 bg-base feature-card">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <h3 className="mt-4 font-display font-bold text-navy text-lg">{g.titolo}</h3>
                    <p className="mt-1.5 text-sm text-navy-500 leading-relaxed">{g.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Presto — approfondimenti in arrivo */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="inline-flex items-center gap-2 eyebrow text-orange-500">
                <Clock size={13} className="text-orange-500" />
                Presto
              </span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Nuovi approfondimenti in arrivo.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Stiamo preparando articoli, esempi reali e strumenti scaricabili per chi vuole
                fare preventivi migliori e gestire i cantieri con più controllo. Niente fuffa:
                solo materiale che puoi applicare in cantiere.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inArrivo.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.titolo} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                        <Icon size={18} className="text-navy-600" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500 px-2.5 py-1 rounded-full bg-orange-50">
                        In arrivo
                      </span>
                    </div>
                    <h3 className="mt-4 font-display font-bold text-navy text-lg">{a.titolo}</h3>
                    <p className="mt-1.5 text-sm text-navy-500 leading-relaxed">{a.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Nota onesta + rimando guide attuali */}
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 p-6 md:p-7 rounded-2xl border border-gray-200 bg-white">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <Mail size={20} className="text-orange-500" />
              </div>
              <p className="text-sm text-navy-500 leading-relaxed">
                <strong className="text-navy">Nel frattempo</strong>, le risorse pronte le trovi
                già tra le{" "}
                <Link href="/guide" className="text-orange-500 font-semibold hover:text-orange-600">
                  guide gratuite
                </Link>
                . Le nuove risorse verranno aggiunte qui man mano che escono.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Vuoi vedere gli strumenti all'opera?"
        subtitle="Le guide ti danno il metodo. Una demo ti mostra come Cantieri Hub lo fa al posto tuo, sui tuoi file reali."
        primaryLabel="Richiedi una demo"
        whatsappText="Ciao! Ho letto le risorse e vorrei vedere una demo di Cantieri Hub."
        dark={false}
      />
    </>
  );
}
