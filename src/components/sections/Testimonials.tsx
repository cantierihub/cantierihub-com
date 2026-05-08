import Reveal from "@/components/ui/Reveal";

const testimonials = [
  {
    quote: "Prima mi ci voleva mezza giornata per fare un preventivo da un computo metrico. Adesso lo faccio in 10 minuti, PDF incluso. Non tornerei indietro.",
    author: "Marco R.",
    role: "Titolare, impresa edile",
    location: "Milano",
    initials: "MR",
    color: "#0f172a",
  },
  {
    quote: "Il WOW moment vero è stato quando ha letto il mio computo da 200 voci e me lo ha abbinato al prezzario in 2 minuti. Roba che prima facevo a mano in 3 ore.",
    author: "Giuseppe L.",
    role: "Geometra",
    location: "Napoli",
    initials: "GL",
    color: "#1e3a5f",
  },
  {
    quote: "Finalmente un software edile che capisce come lavoriamo. Semplice, in italiano, e supporto su WhatsApp. Nessun altro lo fa.",
    author: "Antonio M.",
    role: "Titolare, impresa ristrutturazioni",
    location: "Roma",
    initials: "AM",
    color: "#1a2e1a",
  },
];

export default function Testimonials() {
  return (
    <section style={{ background: "#0f172a", padding: "clamp(72px, 9vw, 128px) 0", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      {/* Orange glow center */}
      <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Corner glow top-right */}
      <div aria-hidden="true" style={{ position: "absolute", top: -100, right: -80, width: 450, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ color: "#fb923c" }}>Cosa dicono i clienti</span>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: "clamp(30px, 3.6vw, 48px)", color: "#fff", marginTop: 12 }}
            >
              Chi l&apos;ha provato non torna indietro.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.1}>
              <div className="testimonial-card"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "clamp(16px, 4vw, 28px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  height: "100%",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="15" height="15" viewBox="0 0 20 20" fill="#f97316">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote
                  style={{
                    fontSize: 15, lineHeight: 1.7, color: "#334155",
                    flex: 1, marginBottom: 24,
                    fontStyle: "normal",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Divider */}
                <div style={{ height: 1, background: "#f1f5f9", marginBottom: 20 }} />

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: t.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 13, fontWeight: 700,
                      letterSpacing: "-0.01em",
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
                      {t.author}
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4, marginTop: 2 }}>
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}