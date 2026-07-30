"use client";

import { useEffect, useState } from "react";
import { EVENTO_CONSENSO, leggiConsenso } from "@/lib/consenso";

/**
 * Script di tracciamento esterno di Salesflow (LeadConnector).
 *
 * A cosa serve: unisce l'attribuzione. Registra le visualizzazioni di pagina e, quando
 * qualcuno compila un modulo del sito, **crea o aggiorna il contatto nel CRM** con la
 * sorgente da cui è arrivato. È così che i lead del sito entrano in Salesflow insieme
 * a quelli delle campagne, invece di restare solo in una email.
 *
 * ⚠️ **Si carica solo dopo un sì esplicito** (`lib/consenso.ts`). È un tracciamento di
 * terze parti: senza consenso non deve esistere in pagina, e infatti non viene nemmeno
 * scaricato.
 *
 * Perché non `next/script`: qui il caricamento dipende da uno stato che cambia a runtime
 * (l'utente accetta e lo script deve partire subito, senza ricaricare la pagina), e
 * serve controllare di non inserirlo due volte. Un `<script>` inserito a mano è più
 * chiaro da leggere di una `strategy` condizionale.
 *
 * ⚠️ Perché i moduli vengano sincronizzati col CRM servono tre cose, tutte già vere:
 * 1. su Salesflow, «Analisi delle visualizzazioni», «Analisi dei moduli» e «Invii di
 *    moduli» attivi (fatto il 30/07/2026)
 * 2. ogni campo con un attributo `name`, e in particolare `name="email"`
 * 3. invio tramite l'evento submit nativo, senza `stopPropagation`
 * Se uno dei tre salta, lo script gira ma i contatti non arrivano, **in silenzio**.
 */

const ID_TRACCIAMENTO = "tk_76eeda660be845e29d4ae2b777751136";
const ID_ELEMENTO = "salesflow-external-tracking";

export default function TracciamentoSalesflow() {
  const [consenso, setConsenso] = useState(() => leggiConsenso());

  // Reagisce alla scelta fatta sul banner senza aspettare un ricaricamento.
  useEffect(() => {
    function aggiorna() {
      setConsenso(leggiConsenso());
    }
    window.addEventListener(EVENTO_CONSENSO, aggiorna);
    return () => window.removeEventListener(EVENTO_CONSENSO, aggiorna);
  }, []);

  useEffect(() => {
    if (consenso !== "accettato") return;
    if (document.getElementById(ID_ELEMENTO)) return;

    const s = document.createElement("script");
    s.id = ID_ELEMENTO;
    s.src = "https://link.msgsndr.com/js/external-tracking.js";
    s.async = true;
    s.setAttribute("data-tracking-id", ID_TRACCIAMENTO);

    // In anteprima lascia i log `[LC Tracking]` in console, così si verifica che gli
    // eventi partano davvero. In produzione starebbero solo nella console dei visitatori.
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      s.setAttribute("data-debug", "true");
    }

    document.body.appendChild(s);
  }, [consenso]);

  return null;
}
