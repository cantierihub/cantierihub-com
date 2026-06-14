import type { Metadata } from "next";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Reveal from "@/components/ui/Reveal";
import { faqCategories } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ — Domande frequenti su Cantieri Hub",
  description:
    "Tutto quello che vuoi sapere su Cantieri Hub, il Preventivatore AI e il Computatore AI, prima di prenotare una demo.",
};

export default function FAQPage() {
  return (
    <>
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-12 bg-white overflow-hidden">
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.065) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: -80, right: -60, width: 480, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)", filter: "blur(48px)", pointerEvents: "none" }} />
        <div className="container-main relative z-10">
          <Reveal>
            <div className="max-w-2xl">
              <span className="pill">
                <span className="pill__dot" />
                Hai una domanda?
              </span>
              <h1 className="mt-5 font-display font-extrabold text-navy text-3xl md:text-5xl leading-tight">
                Domande frequenti.
              </h1>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Tutto quello che vuoi sapere prima di prenotare una demo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {faqCategories.map((cat) => (
        <FAQSection
          key={cat.title}
          items={cat.faqs}
          title={cat.title}
          subtitle=""
          showCTA={false}
        />
      ))}

      <CTASection
        title="Non hai trovato risposta?"
        subtitle="Scrivici direttamente. Risponderemo entro poche ore."
        primaryLabel="Prenota una Demo"
        dark={false}
      />
    </>
  );
}