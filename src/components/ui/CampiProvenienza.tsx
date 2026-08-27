"use client";

import { useEffect, useRef } from "react";
import { catturaProvenienza, valoriProvenienza } from "@/lib/provenienza";

/**
 * I campi tecnici che ogni modulo lead passa al CRM: **da dove arriva** la persona e
 * **quando** ha compilato.
 *
 * ── `form_inviato_il` ──
 * Un orario ISO, riscritto a ogni caricamento della pagina. Serve a dare al CRM un
 * **segnale che cambia solo quando qualcuno compila davvero**: su Salesflow il trigger
 * «Modulo inviato» copre soltanto i moduli nativi (il nostro è un modulo del sito,
 * catturato dallo script di tracciamento), e l'unica alternativa — «Contatto aggiornato»
 * sui campi del modulo — scatterebbe anche quando un setter modifica la scheda a mano.
 * Ascoltando questo campo invece non ci sono falsi positivi: nessuno lo tocca a mano.
 *
 * Effetto collaterale utile: dice **quando** una persona ha compilato l'ultima volta.
 * Un lead che torna a scrivere dopo mesi è un segnale forte, e prima non lo vedeva nessuno.
 *
 * ── la provenienza ──
 *
 * **Perché servono.** L'attribuzione nativa di Salesflow, al momento dell'invio del
 * modulo, dice `Direct traffic`: gli UTM li ha visti solo la pagina di atterraggio, e
 * quella sessione il CRM non la collega al contatto. Verificato dal vivo il 05/08/2026,
 * su due prove: il lead arrivava senza canale e finiva etichettato «passaparola».
 *
 * **Come arrivano al CRM.** Non li legge il nostro `handleSubmit`: li legge lo script di
 * tracciamento di Salesflow, che ispeziona il modulo per conto suo e mappa gli attributi
 * `name` sulle chiavi dei campi personalizzati. I nomi qui sotto devono combaciare
 * **esattamente** con quelle chiavi — un nome diverso e il campo resta vuoto, in silenzio.
 *
 * **Due dettagli che sembrano pignoleria e non lo sono:**
 *
 * 1. Sono `type="text"` nascosti col CSS, non `type="hidden"`. Con gli `hidden` la prima
 *    prova è arrivata al CRM con i campi vuoti: uno script che ispeziona un modulo può
 *    saltarli. Un campo di testo fuori schermo lo vede chiunque — è la stessa tecnica
 *    dell'honeypot, che in questi moduli funziona già.
 * 2. Il valore si scrive sia sulla proprietà `value` sia sull'attributo. React aggiorna
 *    solo la prima, e non sappiamo quale delle due guardi lo script.
 */

const NASCOSTO: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: 1,
  height: 1,
  opacity: 0,
};

export default function CampiProvenienza() {
  const source = useRef<HTMLInputElement>(null);
  const medium = useRef<HTMLInputElement>(null);
  const campagna = useRef<HTMLInputElement>(null);
  const invio = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // `sessionStorage` non esiste durante il render sul server: si legge dopo il montaggio.
    //
    // ⚠️ E si cattura PRIMA di leggere. React esegue gli effetti dal figlio al genitore:
    // questo componente sta dentro il modulo, `CatturaProvenienza` sta nel layout, quindi
    // qui si arrivava prima che la provenienza fosse stata scritta. Sulla pagina di
    // ATTERRAGGIO i tre campi UTM restavano vuoti per sempre, perché le dipendenze sono
    // vuote e l'effetto non ripassa. Dalla seconda pagina in poi funzionava, ed è per
    // questo che non si vedeva: si vedeva solo in chi atterra e compila subito, cioè
    // esattamente chi arriva dal link in bio a una pagina con il modulo dentro.
    // `catturaProvenienza` è first-touch e idempotente: chiamarla qui non sovrascrive niente.
    catturaProvenienza();

    const v = valoriProvenienza();

    const scrivi = (el: HTMLInputElement | null, valore: string) => {
      if (!el) return;
      el.value = valore;
      el.setAttribute("value", valore);
    };

    scrivi(source.current, v.source);
    scrivi(medium.current, v.medium);
    scrivi(campagna.current, v.campagna);
    scrivi(invio.current, new Date().toISOString());
  }, []);

  const comuni = {
    type: "text" as const,
    defaultValue: "",
    readOnly: true,
    tabIndex: -1,
    autoComplete: "off",
    "aria-hidden": true,
    style: NASCOSTO,
  };

  return (
    <>
      <input ref={source} name="form_utm_source" {...comuni} />
      <input ref={medium} name="form_utm_medium" {...comuni} />
      <input ref={campagna} name="form_utm_campaign" {...comuni} />
      <input ref={invio} name="form_inviato_il" {...comuni} />
    </>
  );
}
