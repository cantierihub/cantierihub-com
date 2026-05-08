"use client";

import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "30+", label: "Imprese attive" },
  { value: "~3 min", label: "Per ogni preventivo", accent: true },
  { value: "+15%", label: "Margine medio per cantiere", accent: true },
  { value: "2025", label: "Anno di fondazione" },
];

export default function Stats() {
  return (
    <div className="container-main" style={{ marginTop: -64, position: "relative", zIndex: 10 }}>
      <Reveal>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            gap: 24, padding: "36px 44px", borderRadius: 20,
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
            border: "1px solid rgba(255,255,255,.06)",
            boxShadow: "0 24px 48px rgba(15,23,42,.18), 0 8px 16px rgba(15,23,42,.10)",
          }}
        >
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ textAlign: "center" }}>
                <p
                  className="font-display font-extrabold"
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1,
                    letterSpacing: "-0.02em", margin: "0 0 6px",
                    color: s.accent ? "#fb923c" : "#fff",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}