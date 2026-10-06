"use client";

import { usePathname } from "next/navigation";
import { WA_DEMO } from "@/data/site";

/**
 * La colonna «Inizia adesso» del piè di pagina. Sulle pagine di candidatura delle Notizie (/demo/<prodotto>) non c'è:
 * il modulo è già nella pagina, e il WhatsApp perderebbe l'articolo di provenienza (revisione del 03/10/2026).
 */
export default function ColonnaCtaFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/demo/")) return <div aria-hidden="true" />;
  return (
    <div>
      <h4 className="eyebrow" style={{ color: "#94a3b8", marginBottom: 16 }}>
        Inizia adesso
      </h4>
      <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.65, marginBottom: 20 }}>
        30 minuti di demo gratuita. Vedi come funziona con i tuoi file reali.
      </p>
      <a
        href={WA_DEMO}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary cta-shimmer"
        style={{ width: "100%", justifyContent: "center" }}
      >
        Prenota Demo <span className="arrow">→</span>
      </a>
    </div>
  );
}
