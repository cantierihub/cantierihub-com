"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { leggiConsenso, salvaConsenso } from "@/lib/consenso";

/**
 * Banner del consenso.
 *
 * Due differenze rispetto a prima, e sono quelle che contano:
 * 1. **«Rifiuta» viene registrato.** Prima chiudeva solo il banner, che poi ricompariva
 *    alla visita dopo: la scelta non veniva mai presa sul serio.
 * 2. **La scelta comanda davvero qualcosa.** Gli script di tracciamento leggono questo
 *    consenso e si caricano solo su «Accetta» (vedi `lib/consenso.ts`).
 *
 * I due pulsanti hanno lo stesso peso visivo di proposito: un «rifiuta» nascosto o
 * sbiadito non è una scelta libera.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Compare solo a chi non ha ancora scelto.
    if (leggiConsenso() === null) setVisible(true);
  }, []);

  function scegli(scelta: "accettato" | "rifiutato") {
    salvaConsenso(scelta);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          role="dialog"
          aria-label="Consenso al tracciamento"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-5"
        >
          <p className="text-sm font-semibold text-navy mb-1.5">Prima di continuare</p>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Vorremmo capire da quale contenuto arrivi, così sappiamo cosa vale la pena
            raccontare. Sono strumenti di terze parti: <strong>partono solo se ci dai l&apos;ok</strong>.
            Se rifiuti il sito funziona esattamente come prima.{" "}
            <Link href="/cookie" className="text-orange-500 underline hover:text-orange-600">
              Dettagli
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => scegli("accettato")}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              Accetta
            </button>
            <button
              onClick={() => scegli("rifiutato")}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold text-navy bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Rifiuta
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
