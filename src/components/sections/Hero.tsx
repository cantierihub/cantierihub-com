"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
      style={{ background: "#fff" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Animated blob — orange top-right */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute", top: "-20%", right: "-8%",
          width: 700, height: 650, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)",
          filter: "blur(48px)", pointerEvents: "none", zIndex: 0,
          willChange: "transform",
        }}
        animate={{ scale: [1, 1.14, 1], x: [0, 40, 0], y: [0, -28, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated blob — navy bottom-left */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "-15%", left: "-8%",
          width: 600, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,23,42,0.06) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
          willChange: "transform",
        }}
        animate={{ scale: [1, 1.20, 1], x: [0, -24, 0], y: [0, 32, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="container-main py-16 md:py-24" style={{ position: "relative", zIndex: 1 }}>
        <div className="grid items-center gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

          {/* ── Left: copy ── */}
          <div style={{ maxWidth: 600 }}>
            <motion.div {...fade(0)}>
              <span className="pill">
                <span className="pill__dot" />
                Il network dell&apos;edilizia italiana
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="mt-5 font-display font-extrabold"
              style={{ fontSize: "clamp(30px, 5.2vw, 66px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "#0f172a" }}
            >
              Il network di riferimento{" "}
              <em className="not-italic" style={{ color: "#f97316" }}>
                per chi costruisce l&apos;Italia.
              </em>
            </motion.h1>

            <motion.p
              {...fade(0.2)}
              style={{ fontSize: "clamp(17px, 1.4vw, 19px)", lineHeight: 1.6, color: "#475569", marginTop: 20, maxWidth: 560 }}
            >
              Strumenti AI che azzerano il tempo sui preventivi. Marketing specializzato per trovare i clienti giusti. Formazione che fa crescere l&apos;impresa.{" "}
              <strong style={{ color: "#0f172a" }}>Tutto in un posto.</strong>
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

          {/* ── Right: foto ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative hidden lg:block"
            style={{ aspectRatio: "5/4" }}
          >
            {/* Foto principale */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 24px 48px rgba(15,23,42,.14), 0 8px 16px rgba(15,23,42,.06)" }}
            >
              <Image
                src="/images/hero-imprenditore.png"
                alt="Imprenditore edile che usa Cantieri Hub"
                fill
                style={{ objectFit: "cover", objectPosition: "center 20%" }}
                sizes="(max-width: 1024px) 0vw, 50vw"
                priority
              />
              {/* Gradient overlay bottom per i tag */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
                background: "linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 100%)",
              }} />
            </div>

            {/* Tag flottante top */}
            <div className="absolute flex items-center gap-2" style={{ top: "8%", left: "-4%", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15,23,42,.12)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#0f172a", zIndex: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#f97316", boxShadow: "0 0 0 4px rgba(249,115,22,.18)", flexShrink: 0 }} />
              AI estrae 47 voci
            </div>

            {/* Tag flottante bottom */}
            <div className="absolute flex items-center gap-2" style={{ bottom: "6%", right: "-3%", background: "#0f172a", border: "1px solid #1e293b", boxShadow: "0 4px 12px rgba(15,23,42,.20)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#fff", zIndex: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#fb923c", boxShadow: "0 0 0 4px rgba(249,115,22,.18)", flexShrink: 0 }} />
              Pronto in 2:48
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}