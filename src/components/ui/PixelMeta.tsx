"use client";

import { useEffect, useState } from "react";
import { EVENTO_CONSENSO, leggiConsenso } from "@/lib/consenso";
import { caricaPixelMeta } from "@/lib/pixelMeta";

/**
 * Carica il Meta Pixel, ma solo dopo un sì esplicito.
 *
 * Stessa struttura di `TracciamentoSalesflow`: ascolta il cambio di consenso, così chi
 * accetta viene tracciato subito senza dover ricaricare, e chi rifiuta non scarica
 * nemmeno lo script.
 */
export default function PixelMeta() {
  const [consenso, setConsenso] = useState(() => leggiConsenso());

  useEffect(() => {
    function aggiorna() {
      setConsenso(leggiConsenso());
    }
    window.addEventListener(EVENTO_CONSENSO, aggiorna);
    return () => window.removeEventListener(EVENTO_CONSENSO, aggiorna);
  }, []);

  useEffect(() => {
    if (consenso !== "accettato") return;
    caricaPixelMeta();
  }, [consenso]);

  return null;
}
