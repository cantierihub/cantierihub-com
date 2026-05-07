import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    num: "01",
    tag: "UPLOAD",
    title: "Carica il documento",
    description: "Trascina computo metrico, capitolato o anche solo le foto del sopralluogo. PDF, Excel, Word: come arrivano.",
  },
  {
    num: "02",
    tag: "AI",
    title: "L’AI elabora tutto",
    description: "Estrae le voci, le abbina al prezzario regionale, calcola l’analisi prezzi. Ti chiede solo quello che serve.",
  },
  {
    num: "03",
    tag: "INVIA",
    title: "Scarica il preventivo",
    description: "PDF brandizzato col tuo logo, voci ordinate, totali corretti. Lo invii al committente in un click.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ background: "#f8fafc", padding: "clamp(64px, 9vw, 120px) 0" }}>
      <div className="container-main">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ color: "#f97316" }}>Come funziona</span>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: "clamp(30px, 3.6vw, 48px)", color: "#0f172a", marginTop: 12, letterSpacing: "-0.02em" }}
            >
              3 passi. Niente di più.
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.3vw, 19px)", color: "#64748b", marginTop: 14, lineHeight: 1.6 }}>
              Nessun corso, nessun manuale di 200 pagine. Funziona come ti aspetti.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff", border: "1px solid #e2e8f0",
                  borderRadius: 14, padding: 28,
                  transition: "border-color 120ms, transform 120ms",
                }}
              >
                <span
                  style={{
                    display: "block", fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600, fontSize: 13, color: "#f97316",
                    letterSpacing: "0.04em", marginBottom: 16,
                  }}
                >
                  {step.num} — {step.tag}
                </span>
                <h3
                  className="font-display font-bold"
                  style={{ fontSize: 20, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}