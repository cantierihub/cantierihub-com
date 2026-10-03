import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import TestoGrazie from "./TestoGrazie";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Grazie · Abbiamo ricevuto il tuo messaggio",
  description:
    "Abbiamo ricevuto la tua richiesta. Ti ricontattiamo entro 24 ore.",
  // Pagina di conferma post-form: non va indicizzata.
  robots: { index: false, follow: false },
};

export default function GraziePage() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-12 pb-16 md:pt-20 md:pb-24 bg-navy overflow-hidden">
      {/* Blob glow */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-narrow relative z-10 text-center">
        <Reveal>
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 mx-auto">
            <CheckCircle size={40} className="text-orange-400" />
          </span>
        </Reveal>

        <TestoGrazie />
      </div>
    </section>
  );
}
