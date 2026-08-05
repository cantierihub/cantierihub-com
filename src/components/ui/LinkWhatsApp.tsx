"use client";

import { useEffect, useState, type ReactNode } from "react";
import { waLink } from "@/data/site";
import { valoriProvenienza } from "@/lib/provenienza";

/**
 * Link a WhatsApp che si porta dietro il canale di provenienza.
 *
 * **Il problema che risolve.** Chi sceglie WhatsApp invece del modulo non lascia niente
 * nel CRM: nessun contatto, nessun cartellino, nessun canale. È l'unica strada del sito
 * che resta cieca. Non possiamo tracciarla come un modulo — ma possiamo far sì che il
 * setter, aprendo la chat, legga da dove arriva la persona nella prima riga.
 *
 * Il messaggio resta una frase che una persona scriverebbe davvero: *«Ciao! Vi ho trovati
 * su Instagram e vorrei prenotare una demo»*. Chi scrive lo vede prima di inviarlo, quindi
 * non deve sembrare un codice a barre.
 *
 * Senza provenienza nota resta il messaggio di sempre: meglio niente che un canale inventato.
 */

const CANALI: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  google: "Google",
};

function nomeCanale(source: string): string | null {
  const s = source.toLowerCase();
  // `includes` e non uguaglianza: senza UTM la sorgente è il dominio del referrer
  // («l.instagram.com», «www.google.com»), che contiene comunque il nome del canale.
  for (const [chiave, nome] of Object.entries(CANALI)) {
    if (s.includes(chiave)) return nome;
  }
  return null;
}

type Props = {
  /** La richiesta, all'infinito e senza saluto: «prenotare una demo gratuita». */
  richiesta: string;
  className?: string;
  children: ReactNode;
};

export default function LinkWhatsApp({ richiesta, className, children }: Props) {
  const senzaCanale = `Ciao! Vorrei ${richiesta}.`;
  const [href, setHref] = useState(() => waLink(senzaCanale));

  useEffect(() => {
    const canale = nomeCanale(valoriProvenienza().source);
    setHref(waLink(canale ? `Ciao! Vi ho trovati su ${canale} e vorrei ${richiesta}.` : senzaCanale));
  }, [richiesta, senzaCanale]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
