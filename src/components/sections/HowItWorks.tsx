import Reveal from "@/components/ui/Reveal";
import { UploadCloud, Download } from "lucide-react";

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

          {/* Step 01 — orange accent, drop zone */}
          <Reveal delay={0}>
            <div
              style={{
                background: "#fff",
                border: "1.5px solid rgba(249,115,22,0.28)",
                borderRadius: 16,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Background number */}
              <span aria-hidden="true" style={{
                position: "absolute", bottom: -24, right: -8,
                fontSize: 168, fontWeight: 900,
                color: "rgba(249,115,22,0.05)",
                fontFamily: "Poppins, sans-serif",
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>01</span>

              {/* Radial corner glow */}
              <div aria-hidden="true" style={{
                position: "absolute", bottom: 0, right: 0,
                width: 220, height: 220,
                background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              <span style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600, fontSize: 12, color: "#f97316",
                letterSpacing: "0.06em", marginBottom: 20, textTransform: "uppercase",
              }}>
                01 — UPLOAD
              </span>

              {/* Drop zone */}
              <div style={{
                border: "2px dashed rgba(249,115,22,0.32)",
                borderRadius: 10, padding: "18px 14px",
                textAlign: "center", marginBottom: 18,
                background: "rgba(249,115,22,0.025)",
              }}>
                <UploadCloud size={26} color="#f97316" style={{ margin: "0 auto 7px", display: "block" }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  Trascina o clicca per caricare
                </p>
              </div>

              {/* Format pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
                {["PDF", "Excel", "Word", "Foto"].map((f) => (
                  <span key={f} style={{
                    padding: "3px 10px", borderRadius: 999,
                    background: "#f1f5f9", color: "#64748b",
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              <h3 className="font-display font-bold" style={{ fontSize: 19, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                Carica il documento
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.65, flex: 1 }}>
                Computo metrico, capitolato o foto del sopralluogo. PDF, Excel, Word: come arrivano.
              </p>
            </div>
          </Reveal>

          {/* Step 02 — AI progress visual */}
          <Reveal delay={0.1}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Background number */}
              <span aria-hidden="true" style={{
                position: "absolute", bottom: -24, right: -8,
                fontSize: 168, fontWeight: 900,
                color: "rgba(15,23,42,0.03)",
                fontFamily: "Poppins, sans-serif",
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>02</span>

              <span style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600, fontSize: 12, color: "#f97316",
                letterSpacing: "0.06em", marginBottom: 20, textTransform: "uppercase",
              }}>
                02 — AI
              </span>

              {/* AI processing visual */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, color: "#94a3b8" }}>
                  <span>Abbinamento prezzario</span>
                  <span style={{ color: "#f97316", fontWeight: 700 }}>47 / 47</span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(90deg, #f97316 0%, #fb923c 100%)",
                    borderRadius: 999,
                  }} />
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
                  {["Prezzario regionale", "Analisi prezzi", "Totali"].map((tag) => (
                    <span key={tag} style={{
                      padding: "3px 9px", borderRadius: 999,
                      background: "#d1fae5", color: "#059669",
                      fontSize: 10, fontWeight: 600,
                    }}>
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-display font-bold" style={{ fontSize: 19, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                L&apos;AI elabora tutto
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.65, flex: 1 }}>
                Estrae le voci, le abbina al prezzario regionale, calcola l&apos;analisi prezzi. Ti chiede solo quello che serve.
              </p>
            </div>
          </Reveal>

          {/* Step 03 — dark navy, PDF download widget */}
          <Reveal delay={0.2}>
            <div
              style={{
                background: "#0f172a",
                borderRadius: 16,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Background number */}
              <span aria-hidden="true" style={{
                position: "absolute", bottom: -24, right: -8,
                fontSize: 168, fontWeight: 900,
                color: "rgba(255,255,255,0.04)",
                fontFamily: "Poppins, sans-serif",
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>03</span>

              {/* Corner glow */}
              <div aria-hidden="true" style={{
                position: "absolute", top: 0, right: 0,
                width: 200, height: 200,
                background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              <span style={{
                display: "block", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600, fontSize: 12, color: "#fb923c",
                letterSpacing: "0.06em", marginBottom: 20, textTransform: "uppercase",
              }}>
                03 — INVIA
              </span>

              {/* PDF file widget */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "14px 16px",
                marginBottom: 22, display: "flex",
                alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(249,115,22,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Download size={16} color="#fb923c" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    preventivo_rossi_2024.pdf
                  </p>
                  <p style={{ fontSize: 11, color: "#475569", margin: "3px 0 0" }}>Pronto · 2.4 MB</p>
                </div>
                <div style={{
                  padding: "6px 14px", borderRadius: 7,
                  background: "#f97316", color: "#fff",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  Scarica
                </div>
              </div>

              <h3 className="font-display font-bold" style={{ fontSize: 19, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                Scarica il preventivo
              </h3>
              <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.65, flex: 1 }}>
                PDF brandizzato col tuo logo, voci ordinate, totali corretti. Lo invii al committente in un click.
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
