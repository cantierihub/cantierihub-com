import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  dark?: boolean;
}

export default function CTASection({
  title = "Smetti di perdere tempo sui preventivi.",
  subtitle = "Prenota una demo gratuita. In 30 minuti vedi come funziona con i tuoi file reali.",
  primaryLabel = "Prenota Demo Gratuita",
  primaryHref = "/contatti",
  secondaryLabel = "Scrivici su WhatsApp",
  secondaryHref = "/contatti",
  dark = true,
}: CTASectionProps) {
  return (
    <section className={`section-padding ${dark ? "bg-navy" : "bg-orange-50"}`}>
      <div className="container-main">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className={`font-display font-extrabold text-4xl md:text-5xl leading-tight ${
                dark ? "text-white" : "text-navy"
              }`}
            >
              {title}
            </h2>
            <p className={`mt-4 text-lg ${dark ? "text-gray-300" : "text-gray-600"}`}>
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={primaryHref}
                className="cta-shimmer inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center"
              >
                {primaryLabel} <ArrowRight size={18} />
              </Link>
              <Link
                href={secondaryHref}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold transition-colors w-full sm:w-auto justify-center ${
                  dark
                    ? "text-white border border-white/20 hover:border-white/40 hover:bg-white/5"
                    : "text-navy border border-navy/20 hover:bg-white"
                }`}
              >
                <MessageCircle size={18} />
                {secondaryLabel}
              </Link>
            </div>

            <p className={`mt-6 text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
              Nessun impegno. Demo gratuita con il tuo consulente dedicato.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}