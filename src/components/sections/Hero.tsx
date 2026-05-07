"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ArrowRight, MessageCircle } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-50 blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50 blur-[100px] opacity-40" />
        {/* Griglia sottile */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 80%)",
          }}
        />
      </div>

      <div className="container-main relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <Badge dot>Software AI per l&apos;edilizia italiana</Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 font-display font-extrabold text-navy leading-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            10 Preventivi nel
            <br />
            <span className="text-orange-500">Tempo di Uno.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto"
          >
            Cantieri Hub è il software AI per imprese edili italiane. Carica il computo metrico,
            l&apos;AI estrae le voci, abbina i prezzari regionali e genera il preventivo PDF.{" "}
            <strong className="text-navy">In 3 minuti, non in 3 ore.</strong>
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/contatti"
              className="cta-shimmer inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center"
            >
              Prenota una Demo <ArrowRight size={18} />
            </Link>
            <Link
              href="#prodotti"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-navy border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle size={18} />
              Scopri i Prodotti
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500"
          >
            {["Demo personalizzata", "Supporto in italiano", "Dati protetti e sicuri"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Mockup grafico prodotto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative bg-navy rounded-2xl shadow-2xl overflow-hidden border border-white/10 aspect-[16/9]">
            {/* Mockup UI semplificata */}
            <div className="absolute inset-0 flex">
              {/* Sidebar */}
              <div className="w-48 bg-navy-dark border-r border-white/10 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-orange-500" />
                  <div className="h-3 w-20 bg-white/20 rounded" />
                </div>
                {["Dashboard", "Preventivi", "Clienti", "Prezzari", "Analisi AI"].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${i === 1 ? "bg-white/10 border-l-2 border-orange-500" : ""}`}
                  >
                    <div className="w-3 h-3 rounded-sm bg-white/30" />
                    <div className="h-2.5 rounded bg-white/20" style={{ width: `${50 + i * 10}px` }} />
                  </div>
                ))}
              </div>
              {/* Contenuto principale */}
              <div className="flex-1 p-6 bg-base">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="h-5 w-32 bg-navy/20 rounded mb-1" />
                    <div className="h-3 w-48 bg-gray-300 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-28 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-28 bg-orange-500 rounded-lg flex items-center justify-center">
                      <div className="h-2.5 w-20 bg-white/80 rounded" />
                    </div>
                  </div>
                </div>
                {/* KPI cards */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Totale", val: "47", active: true },
                    { label: "Bozze", val: "31", active: false },
                    { label: "Inviati", val: "12", active: false },
                    { label: "Accettati", val: "4", active: false },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className={`rounded-xl p-3 border ${k.active ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"}`}
                    >
                      <div className="h-5 w-8 bg-navy/20 rounded mb-1 font-bold text-sm" />
                      <div className="h-2.5 w-12 bg-gray-300 rounded" />
                    </div>
                  ))}
                </div>
                {/* Rows */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1 h-2.5 bg-gray-200 rounded" />
                      <div className="h-2.5 w-16 bg-gray-200 rounded" />
                      <div className="h-2.5 w-20 bg-orange-200 rounded" />
                      <div className="h-5 w-14 bg-gray-100 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badge flottante */}
          <div className="absolute bottom-8 right-8 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy">Preventivo generato</p>
              <p className="text-xs text-gray-500">2 minuti e 43 secondi</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
