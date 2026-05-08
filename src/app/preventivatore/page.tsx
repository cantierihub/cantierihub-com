import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import { ArrowRight, Zap, Database, Palette, Users, Archive } from "lucide-react";

export const metadata: Metadata = {
  title: "Preventivatore AI — Dal computo metrico al preventivo in 3 minuti",
  description:
    "Carica il computo metrico, l'AI estrae le voci, abbina i prezzari regionali e genera il PDF professionale. Preventivi edili in 3 minuti.",
};

const features = [
  {
    icon: Zap,
    title: "Estrazione AI da qualsiasi file",
    description: "PDF, Excel, XML standard del settore. L'AI legge il computo metrico del committente e ne estrae tutte le voci con precisione. Anche dai documenti scansionati.",
  },
  {
    icon: Database,
    title: "Prezzari regionali inclusi",
    description: "DEI, Regione Lombardia, Sicilia e altri prezzari regionali italiani. Più il tuo prezzario aziendale personalizzato. Matching automatico con tre livelli di confidenza.",
  },
  {
    icon: Zap,
    title: "Analisi Prezzi AI",
    description: "Per le voci fuori prezzario o i ricalcoli puntuali, l'AI genera la scomposizione completa: materiali, manodopera, noli, utile e spese generali. Il principale vantaggio competitivo.",
  },
  {
    icon: Palette,
    title: "PDF e Excel brandizzati",
    description: "Il preventivo finale esce con il tuo logo, i tuoi colori e i tuoi dati aziendali. Professionale, coerente, pronto da inviare.",
  },
  {
    icon: Users,
    title: "Titolare + collaboratori",
    description: "Fino a 3 utenti per azienda sulla stessa licenza. Ogni azienda ha i propri dati isolati — nessuna condivisione involontaria.",
  },
  {
    icon: Archive,
    title: "Archivio Storico e riuso",
    description: "Ogni preventivo completato alimenta il tuo archivio aziendale. Cerca nei preventivi passati, riutilizza voci negoziate, costruisci un prezzario interno nel tempo.",
  },
];

const steps = [
  {
    n: "01",
    title: "Carica il computo metrico",
    description: "PDF, Excel o XML ricevuto dal committente, dallo studio tecnico o dalla stazione appaltante.",
  },
  {
    n: "02",
    title: "L'AI estrae e abbina",
    description: "Estrae ogni voce, la abbina ai prezzari selezionati. Badge di confidenza per ogni match. Tu rivedi e approvi.",
  },
  {
    n: "03",
    title: "Imposta ribassi e IVA",
    description: "Aggiungi ribassi per capitolo o per voce, gestisci l'IVA, imposta termini di pagamento e condizioni commerciali.",
  },
  {
    n: "04",
    title: "Scarica e invia",
    description: "PDF professionale o Excel con il tuo logo. Anteprima prima del download. In meno di 3 minuti dall'upload.",
  },
];

const faqItems = [
  { q: "Funziona con i file XML standard del settore?", a: "Sì. Il Preventivatore supporta il formato XML standard utilizzato dai principali software di computo metrico, oltre a PDF ed Excel." },
  { q: "Posso usare il mio prezzario aziendale?", a: "Sì. Puoi importare il tuo prezzario interno da Excel, CSV o PDF. Viene aggiornato automaticamente con ogni preventivo salvato." },
  { q: "Cosa fa l'Analisi Prezzi AI?", a: "Per le voci non trovate nei prezzari, genera la scomposizione dettagliata dei costi: materiali, manodopera, noli, utile e spese generali. Con parametri reali (tipo lavorazione, dimensione cantiere, urgenza)." },
  { q: "Quanti utenti sono inclusi?", a: "Ogni licenza include 3 utenti: il titolare e 2 collaboratori. Tutti accedono agli stessi dati aziendali in tempo reale." },
  { q: "Esiste una versione di prova gratuita?", a: "No. Ogni onboarding ha un costo operativo, quindi non offriamo trial. Offriamo invece una demo gratuita in cui vediamo insieme il tuo caso reale." },
];

export default function PreventivatorePage() {
  return (
    <>
      {/* Hero prodotto */}
      <section className="relative pt-28 pb-20 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-50 blur-[100px] opacity-50 pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <Badge dot>Prodotto principale</Badge>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-5 font-display font-extrabold text-navy leading-tight" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
                Dal Computo Metrico al Preventivo in{" "}
                <span className="text-orange-500">3 Minuti.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Carica il file del committente. L&apos;AI estrae ogni voce, la abbina ai prezzari regionali e genera un preventivo PDF professionale con il tuo logo.{" "}
                <strong className="text-navy">Tu rivedi e mandi.</strong>
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contatti"
                  className="cta-shimmer inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center"
                >
                  Prenota una Demo <ArrowRight size={18} />
                </Link>
                <Link
                  href="/computatore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-navy border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                >
                  Vedi anche il Computatore AI
                </Link>
              </div>
            </Reveal>

            {/* Product shot */}
            <Reveal delay={0.45}>
              <div className="mt-12 mx-auto" style={{ maxWidth: 860, position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(15,23,42,0.12)", aspectRatio: "16/9" }}>
                <Image
                  src="/images/preventivatore-laptop.png"
                  alt="Preventivatore AI — laptop con preventivo e caschetto Cantieri Hub"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 40%" }}
                  sizes="(max-width: 768px) 100vw, 860px"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="section-padding bg-base">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow text-orange-500">Come funziona</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-2xl md:text-4xl">4 passi. Nessuna formazione richiesta.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="text-center p-5">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 mb-4">
                    <span className="font-display font-extrabold text-2xl text-orange-500">{s.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow text-orange-500">Funzionalità</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-2xl md:text-4xl">Tutto quello che ti serve per preventivare.</h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">Nessuna funzionalità esclusa dalla licenza base. Tutto incluso, nessuna sorpresa.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.07}>
                  <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <h3 className="font-display font-bold text-navy mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compare table */}
      <section style={{ padding: "clamp(64px, 9vw, 120px) 0", background: "#fff" }}>
        <div className="container-main">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 48px" }}>
              <span className="eyebrow" style={{ color: "#f97316" }}>Confronto</span>
              <h2 className="font-display font-extrabold" style={{ fontSize: "clamp(28px, 3.2vw, 42px)", color: "#0f172a", marginTop: 12, letterSpacing: "-0.02em" }}>
                Cantieri Hub vs altri software
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as const, borderRadius: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 8px rgba(15,23,42,.06)", minWidth: 560 }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ padding: "18px 24px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>Funzionalità</div>
                <div style={{ padding: "18px 24px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#c2410c", background: "#fff7ed", borderLeft: "1px solid #fed7aa", borderRight: "1px solid #fed7aa" }}>Cantieri Hub</div>
                <div style={{ padding: "18px 24px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>Altri software</div>
              </div>
              {[
                ["Estrazione AI da PDF e Excel", "✓", "—"],
                ["Prezzari regionali italiani inclusi", "✓", "Parziale"],
                ["Analisi Prezzi AI (scomposizione costi)", "✓", "—"],
                ["PDF brandizzato col tuo logo", "✓", "✓"],
                ["Archivio storico ricercabile", "✓", "Limitato"],
                ["Supporto diretto su WhatsApp", "✓", "—"],
                ["Onboarding guidato con i tuoi file", "✓", "—"],
              ].map(([feat, ch, other], i) => (
                <div key={feat} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", borderBottom: i < 6 ? "1px solid #e2e8f0" : "none" }}>
                  <div style={{ padding: "18px 24px", fontSize: 14, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center" }}>{feat}</div>
                  <div style={{ padding: "18px 24px", fontSize: 14, fontWeight: 600, color: "#c2410c", background: "#fff7ed", borderLeft: "1px solid #fed7aa", borderRight: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>{ch === "✓" ? "✓" : ""}</span>
                    {ch !== "✓" ? ch : "Sì"}
                  </div>
                  <div style={{ padding: "18px 24px", fontSize: 14, color: other === "✓" ? "#334155" : "#94a3b8", display: "flex", alignItems: "center" }}>
                    {other === "—" ? <span style={{ color: "#cbd5e1", fontWeight: 700 }}>—</span> : other === "✓" ? "Sì" : other}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Differenziatore */}
      <section style={{ background: "#0f172a", padding: "clamp(64px, 9vw, 120px) 0" }}>
        <div className="container-main">
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <Reveal>
              <span className="eyebrow" style={{ color: "#fb923c" }}>Perché Cantieri Hub</span>
              <h2 className="font-display font-extrabold" style={{ fontSize: "clamp(28px, 3.5vw, 46px)", color: "#fff", marginTop: 12, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                L&apos;Analisi Prezzi AI che nessun altro software edile ha.
              </h2>
              <p style={{ fontSize: "clamp(16px, 1.2vw, 18px)", color: "#94a3b8", marginTop: 20, lineHeight: 1.7 }}>
                I software tradizionali lavorano sui prezzari standard. Ma il tuo cantiere ha sempre voci fuori prezzario: materiali speciali, lavorazioni non codificate, situazioni particolari. Prima le stimavi a occhio — o le lasciavi indietro perdendo margine. Adesso l&apos;AI scompone ogni voce in materiali, manodopera, noli, utile e spese generali, con parametri reali del tuo cantiere.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link href="/contatti" className="btn-primary cta-shimmer">
                  Vedi come funziona in demo <span className="arrow">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqItems}
        title="Domande sul Preventivatore"
        subtitle="Risposte dirette per chi vuole capire prima di decidere."
      />
      <CTASection />
    </>
  );
}