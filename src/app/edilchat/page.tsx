import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import { waLink } from "@/data/site";
import {
  BookOpen,
  ListChecks,
  Landmark,
  FileSpreadsheet,
  MessageSquare,
  Target,
  RefreshCw,
  Quote,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const EDILCHAT_URL = "https://edilchat.com";
// La prova di EdilChat passa sempre da un consulente, che rilascia le credenziali:
// non esiste accesso libero. Il contatto e il WhatsApp del setter, come nel resto del sito.
const WA_EDILCHAT = waLink("Ciao! Vorrei provare EdilChat: come ottengo le credenziali?");

export const metadata: Metadata = {
  title: "EdilChat — L'assistente AI per chi costruisce in Italia",
  description:
    "Il ChatGPT verticale sull'edilizia italiana: normative, prezzari, bandi e operatività, con le fonti sempre citate. Knowledge base aggiornata ogni giorno.",
  openGraph: {
    title: "EdilChat — L'assistente AI per chi costruisce in Italia",
    description:
      "Il ChatGPT verticale sull'edilizia italiana: normative, prezzari, bandi e operatività, con le fonti sempre citate. Knowledge base aggiornata ogni giorno.",
    url: "https://cantierihub.com/edilchat",
    type: "website",
  },
  alternates: { canonical: "/edilchat" },
};

const funzionalita = [
  {
    icon: BookOpen,
    nome: "Normative",
    desc: "D.Lgs. 81 sulla sicurezza, NTC, Testo Unico Edilizia. Consultazione sempre aggiornata.",
  },
  {
    icon: ListChecks,
    nome: "Prezzari",
    desc: "Prezzari regionali e DEI, con riferimenti voce per voce.",
  },
  {
    icon: Landmark,
    nome: "Bandi & gare",
    desc: "Monitoraggio di bandi PNRR, MIT e gare d'appalto.",
  },
  {
    icon: FileSpreadsheet,
    nome: "Conversione PDF → Excel",
    desc: "Trasforma documenti e computi in fogli di calcolo pronti all'uso.",
  },
  {
    icon: MessageSquare,
    nome: "Demo guidata",
    desc: "Te la mostra un consulente, con credenziali dedicate alla tua impresa.",
  },
];

const differenziatori = [
  {
    icon: Target,
    titolo: "Verticale, non generalista",
    desc: "Solo edilizia italiana. Niente rumore, niente risposte da enciclopedia: parla la lingua del cantiere — computo metrico, capitolato, SAL, prezzari regionali, DEI, D.Lgs. 81/08.",
  },
  {
    icon: RefreshCw,
    titolo: "Sempre fresco",
    desc: "Una knowledge base aggiornata ogni giorno da agenti dedicati. Un'AI generica ha un cutoff; EdilChat no — sulle fonti edili resta sempre al passo.",
  },
  {
    icon: Quote,
    titolo: "Fonti sempre citate",
    desc: "Ogni risposta rimanda alla fonte. Così è verificabile e ti puoi fidare: niente allucinazioni, solo informazione utile in cantiere.",
  },
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EdilChat",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: EDILCHAT_URL,
  description:
    "Assistente AI verticale sull'edilizia italiana: normative, prezzari, bandi e gare, con le fonti sempre citate.",
  publisher: { "@type": "Organization", name: "Cantieri Hub", url: "https://cantierihub.com" },
};

export default function EdilChatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full bg-blue-500/6 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Un prodotto Cantieri Hub
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.8vw, 3.6rem)" }}
              >
                L&apos;assistente AI per chi{" "}
                <span className="text-orange-400">costruisce in Italia.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Risposte chiare con le fonti sempre citate. Niente fuffa, solo cantiere.
                Un unico interlocutore che conosce normative, prezzi, bandi e operatività dell&apos;edilizia
                italiana — dalla mattina alla sera.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={WA_EDILCHAT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg cta-shimmer"
                >
                  Richiedi una demo <ArrowRight size={17} className="arrow" />
                </a>
                <a href="#funzioni" className="btn-ghost-white btn-lg">
                  Scopri cosa sa fare
                </a>
              </div>
              <p style={{ marginTop: 16, fontSize: 14, color: "#94a3b8" }}>
                Hai gi&agrave; le credenziali?{" "}
                <a
                  href={EDILCHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fb923c", textDecoration: "underline", whiteSpace: "nowrap" }}
                >
                  Accedi a EdilChat <ExternalLink size={13} style={{ display: "inline", verticalAlign: -2 }} />
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa fa */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Un ChatGPT che conosce solo il tuo mestiere.
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed text-lg">
                Oggi un imprenditore edile, un geometra o un capocantiere perde tempo tra Google, i PDF dei
                prezzari e i testi di legge. EdilChat tiene tutto in un posto solo: chiedi a parole, ottieni
                la risposta con la fonte. Qualsiasi domanda, purché parli di cantiere italiano.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Funzionalità */}
      <section id="funzioni" style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Cosa puoi chiedergli</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Tutto quello che serve in cantiere.
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {funzionalita.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.nome} delay={i * 0.06}>
                  <div className="h-full p-6 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <h3 className="font-display font-bold text-navy text-lg">{f.nome}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differenziatori */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Perché non è un ChatGPT qualunque</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Tre cose che un&apos;AI generica non ha.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {differenziatori.map((d, i) => {
              const Icon = d.icon;
              return (
                <Reveal key={d.titolo} delay={i * 0.08}>
                  <div className="h-full">
                    <div className="w-12 h-12 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-navy-700" />
                    </div>
                    <h3 className="font-display font-bold text-navy text-xl">{d.titolo}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{d.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA esterna */}
      <section
        className="final-cta-glow"
        style={{
          background: "#0f172a",
          padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 24px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <Reveal>
          <h2
            className="font-display font-extrabold"
            style={{
              fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.06,
              letterSpacing: "-0.025em", margin: "0 auto 16px",
              maxWidth: "20ch", color: "#fff", position: "relative",
            }}
          >
            Vuoi vederlo sul tuo lavoro?
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.3vw, 19px)", color: "#94a3b8", marginBottom: 32, position: "relative" }}>
            Ti diamo credenziali dedicate e un consulente ti accompagna nella prima prova.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3" style={{ position: "relative" }}>
            <a
              href={WA_EDILCHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg cta-shimmer"
            >
              Scrivici su WhatsApp <ArrowRight size={18} className="arrow" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
