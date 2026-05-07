import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import { ArrowRight, Camera, MessageSquare, Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Computatore AI — Genera il computo metrico da zero in pochi minuti",
  description:
    "Descrivi il lavoro, carica le foto del sopralluogo. L'AI genera l'intero computo metrico. La chat integrata controlla che non manchi nulla.",
};

const wowMoments = [
  {
    icon: Camera,
    number: "01",
    title: "Da zero a computo: descrizione + foto di sopralluogo",
    description:
      "Descrivi il progetto a parole e carica le foto scattate in cantiere. L'AI genera l'intero computo metrico da zero — senza nessun documento preesistente. Nessun competitor lo fa.",
    tag: "Il salto più grande",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Chat AI autocorrettiva",
    description:
      "Parla con la chat integrata come se parlassi con un collega tecnico esperto: \"Sei sicuro di aver inserito tutte le voci per massetti e demolizioni?\" L'AI analizza il computo, trova le voci mancanti e le aggiunge. Tu approvi.",
    tag: "Elimina gli errori per stanchezza",
  },
  {
    icon: Map,
    number: "03",
    title: "Misure dalle piantine",
    description:
      "Carica la piantina (PDF o immagine). L'AI restituisce per ogni voce una quantità stimata con ragionamento esplicito: \"Stanza 4×5m + corridoio 1.2×6m = 27.2 m²\". Vedi il calcolo, accetti o modifichi voce per voce.",
    tag: "Ore di misurazioni in minuti",
  },
];

const steps = [
  { n: "01", title: "Scegli la modalità", description: "Da zero (descrizione + foto), da documento (capitolato PDF/Excel) o da archivio (computo già fatto)." },
  { n: "02", title: "L'AI genera le voci", description: "Estrae, genera o importa tutte le voci con unità di misura e quantità. Diagnostica integrata per trovare voci mancanti." },
  { n: "03", title: "Abbina i prezzi unitari", description: "Usa il prezzario interno, i prezzari regionali o la ricerca AI per assegnare il prezzo a ogni voce." },
  { n: "04", title: "Esporta e passa al Preventivatore", description: "PDF tecnico con logo aziendale. Flusso diretto verso il Preventivatore AI per trasformarlo in offerta commerciale." },
];

const faqItems = [
  { q: "Posso generare un computo senza avere nessun documento di partenza?", a: "Sì. Descrivi il progetto in testo libero e carica le foto del sopralluogo. L'AI costruisce l'intero computo da zero." },
  { q: "Che qualità devono avere le piantine?", a: "Piantine architettoniche standard in PDF o immagine (JPG, PNG). Non è richiesto un formato tecnico specifico." },
  { q: "Il Computatore sostituisce il Preventivatore?", a: "No — è complementare. Il Computatore produce il computo metrico (documento tecnico con voci e quantità). Il Preventivatore lo trasforma in offerta commerciale con prezzi, ribassi e PDF brandizzato." },
  { q: "Posso usare solo il Computatore senza il Preventivatore?", a: "Sì. Sono prodotti vendibili separatamente. Molti clienti usano il Computatore per le gare d'appalto e il Preventivatore per le offerte ai privati." },
  { q: "Chi ha già il Preventivatore paga di più per aggiungere il Computatore?", a: "No — il prezzo per i clienti già abbonati al Preventivatore è ridotto. Parliamone in una chiamata dedicata." },
];

export default function ComputatorePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Nuovo prodotto
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-5 font-display font-extrabold text-white leading-tight" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
                Genera il Computo Metrico Prima Ancora di Aprire{" "}
                <span className="text-orange-400">un Foglio Excel.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Descrivi il lavoro, carica le foto del sopralluogo. L&apos;AI costruisce l&apos;intero computo metrico. La chat integrata controlla che non manchi nulla.{" "}
                <strong className="text-white">Tu approvi e passi al Preventivatore.</strong>
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
                  href="/preventivatore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors w-full sm:w-auto justify-center"
                >
                  Vedi anche il Preventivatore AI
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Flusso ecosistema */}
      <section className="py-10 bg-navy border-t border-white/10">
        <div className="container-main">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <div className="px-6 py-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                <p className="eyebrow text-orange-400 mb-1">Step 1</p>
                <p className="font-display font-bold text-white">Computatore AI</p>
                <p className="text-xs text-gray-400">Genera il computo metrico</p>
              </div>
              <ArrowRight size={20} className="text-gray-500 hidden md:block" />
              <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
                <p className="eyebrow text-gray-500 mb-1">Step 2</p>
                <p className="font-display font-bold text-gray-300">Preventivatore AI</p>
                <p className="text-xs text-gray-500">Trasforma in offerta commerciale</p>
              </div>
              <ArrowRight size={20} className="text-gray-500 hidden md:block" />
              <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
                <p className="eyebrow text-gray-500 mb-1">Risultato</p>
                <p className="font-display font-bold text-gray-300">Offerta al cliente</p>
                <p className="text-xs text-gray-500">PDF professionale brandizzato</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* I 3 WOW moment — layout 2 colonne zigzag */}
      <section style={{ background: "#f8fafc", padding: "clamp(64px, 9vw, 120px) 0" }}>
        <div className="container-main">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 56px" }}>
              <span className="eyebrow" style={{ color: "#f97316" }}>Le 3 funzioni chiave</span>
              <h2
                className="font-display font-extrabold"
                style={{ fontSize: "clamp(30px, 3.6vw, 48px)", color: "#0f172a", marginTop: 12, letterSpacing: "-0.02em" }}
              >
                Cose che nessun altro software edile fa.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gap: 24 }}>
            {wowMoments.map((w, i) => {
              const Icon = w.icon;
              const isReverse = i % 2 === 1;
              return (
                <Reveal key={w.number} delay={i * 0.08}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 56,
                      alignItems: "center",
                      padding: "48px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                    }}
                    className="flex-col md:grid"
                  >
                    {/* Testo */}
                    <div style={{ order: isReverse ? 2 : 1 }}>
                      <span
                        style={{
                          display: "block",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 13, fontWeight: 600,
                          color: "#f97316", letterSpacing: "0.06em",
                          marginBottom: 12,
                        }}
                      >
                        {w.number}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <h3
                          className="font-display font-extrabold"
                          style={{ fontSize: "clamp(22px, 2.5vw, 34px)", color: "#0f172a", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15 }}
                        >
                          {w.title}
                        </h3>
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px", borderRadius: 9999,
                          background: "#fff7ed", color: "#c2410c",
                          fontSize: 12, fontWeight: 600, marginBottom: 14,
                        }}
                      >
                        {w.tag}
                      </span>
                      <p style={{ fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.65, color: "#64748b", margin: 0 }}>
                        {w.description}
                      </p>
                    </div>

                    {/* Visual placeholder */}
                    <div
                      style={{
                        order: isReverse ? 1 : 2,
                        aspectRatio: "4/3",
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #f1f5f9 0%, #fff7ed 100%)",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                          <Icon size={28} color="#f97316" />
                        </div>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{w.tag}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow text-orange-500">Il flusso di lavoro</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-4xl">4 step dalla descrizione all&apos;export.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="text-center p-5">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy/5 border border-navy/10 mb-4">
                    <span className="font-display font-extrabold text-2xl text-navy">{s.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        items={faqItems}
        title="Domande sul Computatore AI"
        subtitle="Risposte dirette per chi vuole capire prima di decidere."
      />
      <CTASection
        title="Vedi il Computatore AI con i tuoi file reali."
        subtitle="Prenota una demo gratuita. In 30 minuti capiamo insieme se fa al caso tuo."
      />
    </>
  );
}