import Reveal from "@/components/ui/Reveal";
import { Zap, Megaphone, BookOpen, Users } from "lucide-react";

const pillars = [
  {
    icon: Zap,
    badge: "Disponibile ora",
    badgeColor: "#10b981",
    badgeBg: "rgba(16,185,129,0.15)",
    title: "Strumenti AI",
    description: "Preventivatore e Computatore AI. Dal computo al preventivo professionale in 3 minuti. Il primo asset del network, operativo oggi.",
    accent: true,
  },
  {
    icon: Megaphone,
    badge: "In arrivo",
    badgeColor: "#fb923c",
    badgeBg: "rgba(249,115,22,0.15)",
    title: "Marketing Edilizia",
    description: "Agenzia specializzata per imprese edili. Siti web, Google, reputazione online, lead qualificati. Fatti trovare dai clienti giusti.",
    accent: false,
  },
  {
    icon: BookOpen,
    badge: "In costruzione",
    badgeColor: "#fb923c",
    badgeBg: "rgba(249,115,22,0.15)",
    title: "Formazione Pratica",
    description: "Masterclass da imprenditori per imprenditori. Non burocrazia — strategie concrete per scalare fatturato e margine.",
    accent: false,
  },
  {
    icon: Users,
    badge: "Vision",
    badgeColor: "#475569",
    badgeBg: "rgba(100,116,139,0.12)",
    title: "Rete di Imprenditori",
    description: "Una community di PMI edili italiane. Connessioni, collaborazioni, opportunità. Crescere insieme è più veloce che crescere soli.",
    accent: false,
  },
];

export default function Network() {
  return (
    <section
      style={{
        background: "#0f172a",
        padding: "clamp(72px, 9vw, 120px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Orange center glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900, height: 600, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 64px" }}>
            <span className="eyebrow" style={{ color: "#fb923c" }}>Perché Cantieri Hub</span>
            <h2
              className="font-display font-extrabold"
              style={{
                fontSize: "clamp(32px, 3.8vw, 52px)",
                color: "#fff", marginTop: 12, letterSpacing: "-0.02em",
              }}
            >
              Un network.{" "}
              <span style={{ color: "#f97316" }}>Quattro asset.</span>
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.3vw, 18px)", color: "#94a3b8", marginTop: 16, lineHeight: 1.65 }}>
              Non solo un software. Un ecosistema pensato per far crescere l&apos;impresa edile italiana — strumento per strumento, cantiere per cantiere.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.1}>
                <div
                  style={{
                    borderRadius: 16,
                    padding: "clamp(18px, 3vw, 28px) clamp(16px, 3vw, 24px)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    ...(p.accent
                      ? {
                          background: "linear-gradient(160deg, #1e2d45 0%, #162035 100%)",
                          border: "1.5px solid rgba(249,115,22,0.4)",
                          boxShadow: "0 0 0 1px rgba(249,115,22,0.08), 0 8px 24px rgba(249,115,22,0.10)",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }),
                  }}
                >
                  {/* Accent glow */}
                  {p.accent && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute", top: -50, right: -50,
                        width: 200, height: 200, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Badge */}
                  <span style={{
                    alignSelf: "flex-start",
                    padding: "3px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.03em",
                    background: p.badgeBg, color: p.badgeColor,
                    marginBottom: 20,
                  }}>
                    {p.badge}
                  </span>

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: p.accent ? "rgba(249,115,22,0.18)" : "rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <Icon size={20} color={p.accent ? "#fb923c" : "#475569"} strokeWidth={1.8} />
                  </div>

                  <h3
                    className="font-display font-bold"
                    style={{
                      fontSize: 18, letterSpacing: "-0.01em",
                      color: p.accent ? "#fff" : "#cbd5e1",
                      margin: "0 0 10px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{
                    fontSize: 14, lineHeight: 1.65,
                    color: p.accent ? "#94a3b8" : "#475569",
                    margin: 0, flex: 1,
                  }}>
                    {p.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
