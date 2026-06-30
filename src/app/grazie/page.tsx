import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { WA_GENERALE } from "@/data/site";
import { CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Grazie — Abbiamo ricevuto il tuo messaggio",
  description:
    "Abbiamo ricevuto la tua richiesta. Ti ricontattiamo entro 24 ore. Se vuoi, puoi scriverci subito su WhatsApp.",
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

        <Reveal delay={0.1}>
          <h1
            className="mt-8 font-display font-extrabold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Grazie! Abbiamo ricevuto{" "}
            <span className="text-orange-400">il tuo messaggio.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            Ti ricontattiamo <strong className="text-white">entro 24 ore</strong>. Se vuoi,
            puoi scriverci subito su WhatsApp: ti rispondiamo molto più in fretta.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <a
              href={WA_GENERALE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Scrivici su WhatsApp
            </a>
            <Link href="/" className="btn-ghost btn-lg">
              Torna alla home
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400">
            <Clock size={15} className="text-gray-400" />
            Tempo medio di risposta: meno di un&apos;ora negli orari di lavoro.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
