"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

export default function Hero() {
  return (
    <section
      className="relative pt-24 overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 75% -10%, rgba(249,115,22,.07), transparent 60%), radial-gradient(900px 500px at -5% 40%, rgba(15,23,42,.04), transparent 50%), #fff",
      }}
    >
      <div className="container-main py-16 md:py-24">
        <div className="grid items-center gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

          {/* ── Left: copy ── */}
          <div style={{ maxWidth: 600 }}>
            <motion.div {...fade(0)}>
              <span className="pill">
                <span className="pill__dot" />
                Software AI per l&apos;edilizia italiana
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="mt-5 font-display font-extrabold"
              style={{ fontSize: "clamp(38px, 5.2vw, 66px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "#0f172a" }}
            >
              Più margine su ogni cantiere.{" "}
              <em className="not-italic" style={{ color: "#f97316" }}>
                Senza rinunciare alla domenica.
              </em>
            </motion.h1>

            <motion.p
              {...fade(0.2)}
              style={{ fontSize: "clamp(17px, 1.4vw, 19px)", lineHeight: 1.6, color: "#475569", marginTop: 20, maxWidth: 560 }}
            >
              Cantieri Hub è il software AI per imprese edili italiane. Carica il
              computo metrico, l&apos;AI estrae le voci, abbina i prezzari regionali e
              genera il preventivo PDF.{" "}
              <strong style={{ color: "#0f172a" }}>In 3 minuti, non in 3 ore.</strong>
            </motion.p>

            <motion.div {...fade(0.3)} className="mt-7 flex flex-wrap gap-3">
              <Link href="/contatti" className="btn-primary btn-lg cta-shimmer">
                Prenota una Demo <span className="arrow">→</span>
              </Link>
              <Link href="#prodotti" className="btn-ghost btn-lg">
                Scopri i Prodotti
              </Link>
            </motion.div>

            <motion.div {...fade(0.4)} className="mt-6 flex flex-wrap gap-5" style={{ fontSize: 13, color: "#64748b" }}>
              {["Demo personalizzata", "Supporto in italiano", "Dati protetti e sicuri"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: 18, height: 18, borderRadius: 9999, background: "#d1fae5", color: "#10b981" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: browser mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative hidden lg:block"
            style={{ aspectRatio: "5/4", perspective: "1600px" }}
          >
            {/* Browser angolato */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                transform: "rotateY(-6deg) rotateX(2deg) translateZ(0)",
                boxShadow: "0 24px 48px rgba(15,23,42,.14), 0 8px 16px rgba(15,23,42,.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Barra browser */}
              <div className="flex items-center gap-2 px-4" style={{ height: 40, background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
                <span className="ml-3 px-3 rounded-full border text-xs" style={{ color: "#94a3b8", background: "#fff", borderColor: "#e2e8f0", paddingTop: 3, paddingBottom: 3 }}>
                  app.cantierihub.it/preventivi
                </span>
              </div>

              {/* App content */}
              <div className="flex" style={{ height: "calc(100% - 40px)" }}>
                <div style={{ width: 172, background: "#0f172a", padding: 14, flexShrink: 0 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#f97316" }} />
                    <div style={{ height: 9, width: 65, borderRadius: 4, background: "rgba(255,255,255,.2)" }} />
                  </div>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2 mb-1 rounded-lg px-2 py-2" style={i === 1 ? { background: "rgba(255,255,255,.10)", borderLeft: "2px solid #f97316" } : {}}>
                      <div style={{ width: 11, height: 11, borderRadius: 3, background: "rgba(255,255,255,.25)", flexShrink: 0 }} />
                      <div style={{ height: 7, borderRadius: 3, background: "rgba(255,255,255,.18)", width: 40 + i * 8 }} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: 18, background: "#f8fafc", overflow: "hidden" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div style={{ height: 13, width: 95, background: "#0f172a", borderRadius: 4, opacity: .7, marginBottom: 5 }} />
                      <div style={{ height: 8, width: 150, background: "#cbd5e1", borderRadius: 4 }} />
                    </div>
                    <div style={{ height: 28, width: 100, background: "#f97316", borderRadius: 7 }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ background: i === 0 ? "#fff7ed" : "#fff", border: `1px solid ${i === 0 ? "#fed7aa" : "#e2e8f0"}`, borderRadius: 9, padding: "9px 7px" }}>
                        <div style={{ height: 13, width: 24, background: i === 0 ? "#f97316" : "#94a3b8", borderRadius: 3, marginBottom: 5, opacity: .8 }} />
                        <div style={{ height: 6, width: 32, background: "#e2e8f0", borderRadius: 3 }} />
                      </div>
                    ))}
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3" style={{ background: "#fff", borderRadius: 8, padding: "9px 11px", marginBottom: 5, border: "1px solid #e2e8f0" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 999, background: "#e2e8f0", flexShrink: 0 }} />
                      <div style={{ flex: 1, height: 7, background: "#e2e8f0", borderRadius: 3 }} />
                      <div style={{ height: 7, width: 55, background: "#f97316", borderRadius: 3, opacity: .45 }} />
                      <div style={{ height: 16, width: 44, background: "#f1f5f9", borderRadius: 9999 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Foglio Excel sfondo */}
            <div className="absolute" style={{ inset: "14% -8% -10% 28%", borderRadius: 8, zIndex: -1, opacity: .8, background: "repeating-linear-gradient(transparent 0 21px,rgba(15,23,42,.05) 21px 22px), repeating-linear-gradient(90deg,transparent 0 58px,rgba(15,23,42,.05) 58px 59px), #FAFAF7", boxShadow: "0 18px 40px rgba(15,23,42,.10)", transform: "rotateY(-6deg) rotateX(2deg) translateZ(-80px)" }} />

            {/* Tag flottante top */}
            <div className="absolute flex items-center gap-2" style={{ top: "8%", left: "-4%", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15,23,42,.10)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#f97316", boxShadow: "0 0 0 4px rgba(249,115,22,.18)", flexShrink: 0 }} />
              AI estrae 47 voci
            </div>

            {/* Tag flottante bottom */}
            <div className="absolute flex items-center gap-2" style={{ bottom: "6%", right: "-3%", background: "#0f172a", border: "1px solid #1e293b", boxShadow: "0 4px 12px rgba(15,23,42,.20)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#fb923c", boxShadow: "0 0 0 4px rgba(249,115,22,.18)", flexShrink: 0 }} />
              Pronto in 2:48
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}