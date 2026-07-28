import Reveal from "@/components/ui/Reveal";
import { WA_DEMO, waLink } from "@/data/site";

// Un solo bottone (scelta di Chiara, 28/07/2026). Prima ce n'erano due
// affiancati, "Prenota una demo" e "Scrivici su WhatsApp": scritte diverse,
// ma stessa chat e stesso numero. L'invito ora e' uno e cambia per pagina.
interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  /** Messaggio WhatsApp precompilato; se assente usa il prefill demo. */
  whatsappText?: string;
  /** Destinazione del CTA. Se e' un percorso interno non apre una nuova scheda. */
  primaryHref?: string;
  dark?: boolean;
}

export default function CTASection({
  title = "Smetti di perdere tempo sui preventivi.",
  subtitle = "Scrivici su WhatsApp: in 30 minuti ti mostriamo come funziona con i tuoi file reali.",
  primaryLabel = "Prenota una Demo Gratuita",
  whatsappText,
  primaryHref,
  dark = true,
}: CTASectionProps) {
  const hrefPrimario = primaryHref ?? (whatsappText ? waLink(whatsappText) : WA_DEMO);
  const primarioEsterno = hrefPrimario.startsWith("http");

  return (
    <section
      className="final-cta-glow"
      style={{
        background: dark ? "#0f172a" : "#fff7ed",
        padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 24px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: dark
            ? "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Reveal>
        <h2
          className="font-display font-extrabold"
          style={{
            fontSize: "clamp(32px, 4.5vw, 58px)", lineHeight: 1.05,
            letterSpacing: "-0.025em", margin: "0 auto 16px",
            maxWidth: "18ch", color: dark ? "#fff" : "#0f172a",
            position: "relative",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "clamp(16px, 1.3vw, 19px)", color: dark ? "#cbd5e1" : "#64748b", marginBottom: 36, position: "relative" }}>
          {subtitle}
        </p>
        <div style={{ position: "relative" }}>
          <a
            href={hrefPrimario}
            {...(primarioEsterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="btn-primary btn-lg cta-shimmer"
          >
            {primaryLabel} <span className="arrow">→</span>
          </a>
        </div>
        <p style={{ fontSize: 13, color: dark ? "#94a3b8" : "#94a3b8", marginTop: 20, position: "relative" }}>
          Nessun impegno. Demo gratuita con il tuo consulente dedicato.
        </p>
      </Reveal>
    </section>
  );
}
