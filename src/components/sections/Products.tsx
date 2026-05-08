import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, FileText, Calculator, Check } from "lucide-react";

const products = [
  {
    icon: FileText,
    badge: "Prodotto principale",
    name: "Preventivatore",
    nameAccent: "AI",
    tagline: "Dal computo metrico al preventivo in 3 minuti.",
    description:
      "Carica il file del committente. L'AI estrae ogni voce, la abbina ai prezzari regionali e genera un preventivo PDF professionale con il tuo logo.",
    features: [
      "Estrazione AI da PDF, Excel e XML",
      "Matching su prezzari regionali + interno aziendale",
      "Analisi Prezzi AI per voci fuori prezzario",
      "PDF e Excel brandizzati col tuo logo",
      "Archivio storico ricercabile",
    ],
    href: "/preventivatore",
    variant: "orange" as const,
  },
  {
    icon: Calculator,
    badge: "Nuovo prodotto",
    name: "Computatore",
    nameAccent: "AI",
    tagline: "Genera il computo metrico prima ancora di aprire Excel.",
    description:
      "Descrivi il lavoro, carica le foto del sopralluogo. L'AI costruisce l'intero computo. La chat autocorrettiva controlla che non manchi nulla.",
    features: [
      "Da zero con descrizione + foto di sopralluogo",
      "Estrazione da capitolati PDF/Excel",
      "Stima quantità dalle piantine architettoniche",
      "Chat AI autocorrettiva integrata",
      "Export diretto al Preventivatore AI",
    ],
    href: "/computatore",
    variant: "navy" as const,
  },
];

export default function Products() {
  return (
    <section
      id="prodotti"
      style={{
        padding: "clamp(72px, 9vw, 128px) 0",
        background: "#f8fafc",
      }}
    >
      <div className="container-main">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 64px" }}>
            <span className="eyebrow" style={{ color: "#f97316" }}>Gli strumenti AI</span>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: "clamp(32px, 3.8vw, 52px)", color: "#0f172a", marginTop: 12 }}
            >
              Due strumenti.{" "}
              <span className="text-gradient-orange">Il cuore del network.</span>
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.3vw, 18px)", color: "#64748b", marginTop: 16, lineHeight: 1.65 }}>
              Il Computatore genera il computo. Il Preventivatore lo trasforma in offerta commerciale.
              Sono il primo asset di Cantieri Hub — disponibili oggi per tutte le imprese del network.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p, i) => {
            const Icon = p.icon;
            const isOrange = p.variant === "orange";

            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <div
                  className={isOrange ? "product-card-orange has-noise" : "product-card-navy has-noise"}
                  style={{
                    borderRadius: 20,
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 560,
                    position: "relative",
                    overflow: "hidden",
                    ...(isOrange
                      ? {
                          background: "#ffffff",
                          border: "1.5px solid rgba(249,115,22,0.35)",
                          boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 12px 30px rgba(249,115,22,0.08)",
                        }
                      : {
                          background: "linear-gradient(160deg, #0f172a 0%, #1a2540 100%)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
                        }),
                  }}
                >
                  {/* Background mesh — orange card */}
                  {isOrange && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute", top: -60, right: -60,
                        width: 280, height: 280, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {/* Background mesh — navy card */}
                  {!isOrange && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute", bottom: -80, right: -80,
                        width: 320, height: 320, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Badge */}
                  <div className="pill" style={{
                    alignSelf: "flex-start",
                    marginBottom: 24,
                    ...(isOrange ? {} : { background: "rgba(249,115,22,0.10)", color: "#fdba74", borderColor: "rgba(249,115,22,0.20)", boxShadow: "none" }),
                  }}>
                    <span className="pill__dot" />
                    {p.badge}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 20,
                      ...(isOrange
                        ? { background: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)", boxShadow: "0 2px 8px rgba(249,115,22,0.15)" }
                        : { background: "rgba(249,115,22,0.14)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }),
                    }}
                  >
                    <Icon size={22} color={isOrange ? "#ea580c" : "#fb923c"} strokeWidth={1.8} />
                  </div>

                  {/* Name */}
                  <h3
                    className="font-display font-bold"
                    style={{
                      fontSize: 26, letterSpacing: "-0.02em",
                      color: isOrange ? "#0f172a" : "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    {p.name}{" "}
                    <span style={{ color: "#f97316" }}>{p.nameAccent}</span>
                  </h3>

                  {/* Tagline */}
                  <p
                    className="font-display font-semibold"
                    style={{
                      fontSize: "clamp(18px, 1.8vw, 22px)", lineHeight: 1.25, letterSpacing: "-0.015em",
                      color: isOrange ? "#1e293b" : "#f1f5f9",
                      marginBottom: 16,
                    }}
                  >
                    {p.tagline}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 14, lineHeight: 1.7,
                      color: isOrange ? "#64748b" : "#94a3b8",
                      marginBottom: 28,
                    }}
                  >
                    {p.description}
                  </p>

                  {/* Features */}
                  <ul style={{ display: "grid", gap: 10, marginBottom: 32, flex: 1 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span
                          style={{
                            flexShrink: 0, marginTop: 2,
                            width: 18, height: 18, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            ...(isOrange
                              ? { background: "#d1fae5" }
                              : { background: "rgba(16,185,129,0.15)" }),
                          }}
                        >
                          <Check size={11} color={isOrange ? "#059669" : "#34d399"} strokeWidth={2.5} />
                        </span>
                        <span style={{ fontSize: 14, lineHeight: 1.5, color: isOrange ? "#334155" : "#cbd5e1" }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={p.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 14, fontWeight: 600, letterSpacing: "-0.005em",
                      color: isOrange ? "#ea580c" : "#fb923c",
                      transition: "gap 150ms",
                    }}
                    className="group"
                  >
                    Scopri {p.name} {p.nameAccent}
                    <ArrowRight size={15} className="arrow" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}