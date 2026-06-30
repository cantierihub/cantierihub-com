import { ImageResponse } from "next/og";

export const alt = "Cantieri Hub — Software AI per preventivi edili";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Immagine OpenGraph generata (vale per og:image e twitter:image di tutto il sito).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* dot grid accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.30) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
          <span style={{ color: "#ffffff" }}>Cantieri</span>
          <span style={{ color: "#f97316" }}>Hub</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Dal computo al preventivo in 3 minuti.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#94a3b8", marginTop: 24 }}>
            Il software AI per le imprese edili italiane.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 44, height: 6, background: "#f97316", borderRadius: 3 }} />
          <div style={{ display: "flex", fontSize: 26, color: "#cbd5e1" }}>cantierihub.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
