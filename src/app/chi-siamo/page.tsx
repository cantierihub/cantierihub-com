import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

import CTASection from "@/components/sections/CTASection";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Chi Siamo — Cantieri Hub",
  description:
    "Cantieri Hub nasce da una domanda semplice: perché chi fa preventivi edili perde ancora ore su un lavoro che l'AI può fare in minuti?",
};

const values = [
  { title: "Concreti", description: "Nessun gergo tech. Strumenti che funzionano per chi lavora in cantiere ogni giorno, non per chi scrive slide in PowerPoint." },
  { title: "Diretti", description: "Supporto diretto su WhatsApp e videochiamata. Niente ticket anonimi, niente help center da navigare." },
  { title: "Orientati al risultato", description: "Il nostro successo si misura sul tempo che ti facciamo risparmiare e sui margini che ti aiutiamo a difendere." },
];

const team = [
  {
    name: "Raffaele Russo",
    role: "Co-founder — Prodotto & Vendite",
    bio: "Si occupa dello sviluppo del prodotto e delle demo con i clienti. La sua ossessione è che ogni funzione abbia senso concreto per chi lavora in cantiere ogni giorno.",
    photo: "/images/raffaele.jpg",
    initials: "RR",
  },
  {
    name: "Dante",
    role: "Co-founder — Commerciale & Clienti",
    bio: "Gestisce il processo commerciale, l'onboarding e il supporto diretto. Si assicura che ogni impresa che sceglie Cantieri Hub ottenga risultati reali da subito.",
    photo: "/images/dante.jpg",
    initials: "D",
  },
];

const roadmap = [
  { step: "1", label: "Strumenti AI", sublabel: "Preventivatore + Computatore — Live", active: true },
  { step: "2", label: "Marketing Edilizia", sublabel: "Agenzia specializzata — Prossimamente", active: false, soon: true },
  { step: "3", label: "Formazione", sublabel: "Masterclass pratiche — In costruzione", active: false, soon: true },
  { step: "4", label: "Rete di Imprenditori", sublabel: "Community nazionale — Vision", active: false },
  { step: "5", label: "Network Completo", sublabel: "Piattaforma unificata — 2027", active: false },
];

export default function ChiSiamoPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-white">
        <div className="container-main">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow text-orange-500">Chi siamo</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-3 font-display font-extrabold text-navy leading-tight" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
                Nati per eliminare il tempo perso{" "}
                <span className="text-orange-500">nell&apos;edilizia italiana.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Cantieri Hub nasce da una domanda semplice: perché chi fa preventivi edili perde ancora ore su un lavoro che l&apos;AI può fare in minuti? Abbiamo costruito la risposta.
              </p>
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
                <h2 className="mt-3 font-display font-extrabold text-navy text-4xl leading-tight">
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
                    src="/images/chisiamo-team.png"
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
              <span className="eyebrow text-orange-500">Il team</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-4xl">Chi c&apos;è dietro Cantieri Hub.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="relative w-full" style={{ height: "clamp(180px, 50vw, 256px)" }}>
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
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

      {/* Valori */}
      <section className="section-padding bg-navy">
        <div className="container-main">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow text-orange-400">I nostri valori</span>
              <h2 className="mt-3 font-display font-extrabold text-white text-4xl">Come lavoriamo.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                  <h3 className="font-display font-bold text-white text-xl mb-3">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
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
              <h2 className="mt-3 font-display font-extrabold text-navy text-4xl">
                Non stiamo costruendo un software.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-4">
              Stiamo costruendo l&apos;infrastruttura che mancava all&apos;edilizia italiana: strumenti operativi che fanno risparmiare ore, visibilità commerciale per trovare i clienti giusti, competenze imprenditoriali per crescere davvero, e una rete di professionisti con cui fare squadra.
            </p>
            <p className="text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-16">
              Asset per asset, stiamo rendendo le PMI edili italiane competitive come non lo sono mai state. Il punto di partenza sono gli Strumenti AI. Il traguardo è il primo network completo per chi costruisce l&apos;Italia.
            </p>
          </Reveal>

          <div className="flex flex-col md:flex-row items-start gap-0 max-w-4xl mx-auto">
            {roadmap.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.08} className="flex-1 flex flex-col items-center text-center px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm border-2 ${
                  item.active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : (item as { soon?: boolean }).soon
                      ? "bg-orange-50 border-orange-300 text-orange-500"
                      : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {item.step}
                </div>
                <p className={`mt-3 font-semibold text-sm ${item.active ? "text-navy" : (item as { soon?: boolean }).soon ? "text-orange-600" : "text-gray-400"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.sublabel}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Lavora con noi."
        subtitle="Prenota una demo e scopri perché 50+ imprese edili italiane hanno scelto Cantieri Hub."
        dark={false}
      />
    </>
  );
}