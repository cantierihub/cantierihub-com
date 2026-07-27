import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, FileText, Calculator, MessagesSquare, PieChart, Check } from "lucide-react";

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
  {
    icon: MessagesSquare,
    badge: "Assistente AI",
    name: "EdilChat",
    nameAccent: "",
    tagline: "Normative, prezzari e capitolati: la risposta con la fonte citata.",
    description:
      "Chiedi in italiano quello che chiederesti a un tecnico esperto. EdilChat risponde sull'edilizia italiana e ti mostra sempre da dove arriva la risposta.",
    features: [
      "Risposte con le fonti sempre citate",
      "Verticale sull'edilizia italiana, non un'AI generica",
      "Normative, prezzari, capitolati e operatività",
      "Domande in italiano, come le faresti a voce",
      "Knowledge base verticale in continua espansione",
    ],
    href: "/edilchat",
    variant: "navy" as const,
  },
  {
    icon: PieChart,
    badge: "Prodotto attivo",
    name: "Analisi Prezzi",
    nameAccent: "AI",
    tagline: "Il prezzo delle voci che sul prezzario non esistono.",
    description:
      "Descrivi la lavorazione: l'AI ricostruisce il prezzo pezzo per pezzo, materiali, manodopera, noli, spese generali e sicurezza. Ogni componente resta modificabile.",
    features: [
      "Scomposizione in 5 componenti di costo",
      "Calibrata su piano, distanza, urgenza e dimensione del cantiere",
      "Modalità singola o batch su interi computi",
      "Ogni componente editabile, totale ricalcolato live",
      "Export PDF ed Excel col tuo logo",
    ],
    href: "/analisi-prezzi",
    variant: "orange" as const,
  },
];

export default function Products() {
  return (
    <section
      id="prodotti"
      style={{
        padding: "clamp(72px, 9vw, 128px) 0",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.055) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
      {/* Orange glow · bottom right */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: -120, right: -80, width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Subtle top-left glow */}
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 64px" }}>
            <span className="eyebrow" style={{ color: "#f97316" }}>I prodotti attivi</span>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: "clamp(32px, 3.8vw, 52px)", color: "#0f172a", marginTop: 12 }}
            >
              Gli strumenti{" "}
              <span className="text-gradient-orange">del network.</span>
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.3vw, 18px)", color: "#64748b", marginTop: 16, lineHeight: 1.65 }}>
              Il Computatore fa il computo, il Preventivatore lo trasforma in offerta, l&apos;Analisi
              Prezzi costruisce le voci che sul prezzario non ci sono, EdilChat risponde quando ti
              blocchi su una norma. Disponibili oggi per tutte le imprese del network.
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
                    padding: "clamp(24px, 5vw, 40px)",
                    display: "flex",
                    flexDirection: "column",
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
                  {/* Background mesh · orange card */}
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
                  {/* Background mesh · navy card */}
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
                    {p.name}
                    {/* EdilChat non ha il suffisso "AI": senza questo controllo resterebbe uno spazio appeso. */}
                    {p.nameAccent && (
                      <>
                        {" "}
                        <span style={{ color: "#f97316" }}>{p.nameAccent}</span>
                      </>
                    )}
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
                    Scopri {[p.name, p.nameAccent].filter(Boolean).join(" ")}
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