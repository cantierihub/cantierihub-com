import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

import CTASection from "@/components/sections/CTASection";
import { WA_CANDIDATURA } from "@/data/site";
import RoadmapVisione, { type FaseRoadmap } from "@/components/sections/RoadmapVisione";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/chi-siamo" },
  title: "Chi Siamo — Cantieri Hub",
  description:
    "Cantieri Hub nasce da una domanda semplice: perché chi fa preventivi edili perde ancora ore su un lavoro che l'AI può fare in minuti?",
};

const team = [
  {
    name: "Raffaele Russo",
    role: "Co-founder",
    bio: "Figlio di un muratore, Raffaele è cresciuto con l'edilizia in casa. Cantieri Hub nasce da lì: dalla convinzione che le piccole e medie imprese edili italiane non abbiano bisogno di un altro software, ma di riprendersi il tempo che perdono in preventivi, computi e pratiche. Il lavoro che non genera valore lo fa l'intelligenza artificiale. Quello che ne genera resta in cantiere, dove è sempre stato.",
    photo: "/images/raffaele-sed.jpg",
    initials: "RR",
  },
];

// Roadmap PUBBLICA. Volutamente piu stretta di quella interna: restano fuori
// Contabilita AI, E-commerce, Prezziario proprietario e Hiring Agency per non
// anticiparli ai concorrenti. Decisione di Chiara del 21/07/2026.
const roadmap: FaseRoadmap[] = [
  {
    fase: "Live oggi",
    stato: "live",
    prodotti: [
      {
        nome: "Preventivatore AI",
        tag: "Dal computo al preventivo in pochi minuti.",
        desc: "Carichi il computo metrico, l'AI abbina ogni voce al prezzario e genera il preventivo in PDF con il tuo logo.",
      },
      {
        nome: "Computatore AI",
        tag: "Il computo metrico partendo da zero.",
        desc: "Descrivi i lavori o carica le foto del sopralluogo: l'AI costruisce le voci con le quantità.",
      },
      {
        nome: "EdilChat",
        tag: "Le risposte dell'edilizia italiana.",
        desc: "Normative, prezzari, bandi e gare. Risposte in linguaggio naturale, con le fonti sempre citate.",
      },
    ],
  },
  {
    fase: "In arrivo",
    stato: "prossimo",
    prodotti: [
      {
        nome: "Gestione Cantieri AI",
        tag: "Il gestionale che tiene insieme tutto.",
        desc: "Il prodotto che raccoglie gli altri: pianificazione, avanzamento lavori e costi del cantiere in un posto solo.",
      },
      {
        nome: "Marketing Edilizia",
        tag: "Farsi trovare dalle imprese giuste.",
        desc: "Il servizio trasversale del network: visibilità e contatti qualificati per chi lavora nell'edilizia.",
      },
    ],
  },
  {
    fase: "La visione",
    stato: "visione",
    prodotti: [
      {
        nome: "Community",
        tag: "Una rete di imprenditori edili.",
        desc: "Chi guida un'impresa smette di procedere per tentativi: si confronta con chi ha gia risolto lo stesso problema.",
      },
      {
        nome: "Eventi",
        tag: "Ritrovarsi dal vivo.",
        desc: "Incontri e formazione in presenza per imprenditori, geometri e tecnici del settore.",
      },
      {
        nome: "Sede fisica",
        tag: "Un posto vero, in Italia.",
        desc: "Un hub dove clienti e team si incontrano di persona, non solo in videochiamata.",
      },
    ],
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 bg-white overflow-hidden">
        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.065) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        {/* Orange glow top-right */}
        <div aria-hidden="true" style={{ position: "absolute", top: -80, right: -60, width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)", filter: "blur(48px)", pointerEvents: "none" }} />
        <div className="container-main relative z-10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="max-w-xl">
              <Reveal>
                <span className="pill">
                  <span className="pill__dot" />
                  Chi siamo
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mt-5 font-display font-extrabold text-navy leading-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>
                  Nati per eliminare il tempo perso{" "}
                  <em className="not-italic text-orange-500">nell&apos;edilizia italiana.</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                  Cantieri Hub nasce da una domanda semplice: perché chi fa preventivi edili perde ancora ore su un lavoro che l&apos;AI può fare in minuti? Abbiamo costruito la risposta.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.25} className="hidden md:block">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { v: "50+", l: "Imprese nel network" },
                  { v: "3 min", l: "Per ogni preventivo" },
                  { v: "+15%", l: "Margine medio" },
                  { v: "2025", l: "Anno di fondazione" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 16px", textAlign: "center", boxShadow: "0 2px 8px rgba(15,23,42,0.06)" }}>
                    <p className="font-display font-extrabold" style={{ fontSize: "clamp(24px, 2.5vw, 32px)", color: "#f97316", margin: 0, lineHeight: 1 }}>{s.v}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0", fontWeight: 500 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Missione */}
      <section className="section-padding bg-base">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <span className="eyebrow text-orange-500">La missione</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-2xl md:text-4xl leading-tight">
                  10 preventivi nel tempo di uno.
                </h2>
                <p className="mt-5 text-gray-500 leading-relaxed">
                  L&apos;imprenditore edile italiano lavora duro. Conosce i materiali, conosce i cantieri, conosce i clienti. Ma perde ore a ridigitare voci da PDF, a cercare codici sui prezzari regionali, a formattare documenti che sembrano fatti negli anni &apos;90.
                </p>
                <p className="mt-4 text-gray-500 leading-relaxed">
                  Noi abbiamo costruito uno strumento che elimina quella parte. Non la parte creativa, non la parte relazionale — solo quella meccanica e ripetitiva che nessuno dovrebbe fare a mano nel 2026.
                </p>
                <div className="mt-6">
                  <Link
                    href="/preventivatore"
                    className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors group"
                  >
                    Scopri il Preventivatore AI
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="rounded-2xl overflow-hidden mb-4" style={{ position: "relative", height: "clamp(200px, 50vw, 260px)" }}>
                  <Image
                    src="/images/chisiamo-team.jpg"
                    alt="Il team di Cantieri Hub al lavoro"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: "50+", l: "Imprese nel network" },
                    { v: "2025", l: "Anno di fondazione" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                      <p className="font-display font-extrabold text-3xl text-orange-500">{s.v}</p>
                      <p className="mt-1 eyebrow text-gray-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display font-extrabold text-navy text-2xl md:text-4xl">Da dove nasce Cantieri Hub.</h2>
            </div>
          </Reveal>
          <div
            className={`grid gap-6 mx-auto ${
              team.length > 1 ? "md:grid-cols-2 max-w-3xl" : "max-w-sm"
            }`}
          >
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      style={{
                        objectFit: "cover",
                        objectPosition: member.name === "Raffaele Russo" ? "center 12%" : "center 10%",
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-display font-bold text-navy text-lg">{member.name}</p>
                    <p className="text-xs text-orange-500 font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap / Visione */}
      <section className="section-padding bg-base">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-6">
              <span className="eyebrow text-orange-500">La visione</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-xl md:text-4xl">
                Non stiamo costruendo un software.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-4">
              Stiamo costruendo l&apos;infrastruttura che mancava all&apos;edilizia italiana: strumenti operativi che fanno risparmiare ore, visibilità commerciale per trovare i clienti giusti e una rete di professionisti con cui fare squadra.
            </p>
            <p className="text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-16">
              Asset per asset, stiamo rendendo le PMI edili italiane competitive come non lo sono mai state. Il punto di partenza sono gli Strumenti AI. Il traguardo è il primo network completo per chi costruisce l&apos;Italia.
            </p>
          </Reveal>

          <RoadmapVisione roadmap={roadmap} />
        </div>
      </section>

      <CTASection
        title="Vuoi lavorare con noi?"
        subtitle="Cerchiamo persone che vogliano far crescere l'edilizia italiana. Mandaci la tua candidatura: bastano nome, ruolo e due righe su di te."
        primaryLabel="Mandaci la tua candidatura"
        primaryHref="/lavora-con-noi#candidatura"
        whatsappHref={WA_CANDIDATURA}
        dark={false}
      />
    </>
  );
}