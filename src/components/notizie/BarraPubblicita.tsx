"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { FUNNEL, type ProdottoFunnel } from "@/data/funnelNotizie";
import { leggiConsenso } from "@/lib/consenso";
import { RICHIAMO } from "@/data/richiamoNotizie";

const CHIUSA = "barra-pubblicita-chiusa";

/**
 * La barra «Pubblicità» in basso sul telefono («Ti accompagna», Raffaele 09/10/2026): il blocco in fondo arriva dopo
 * 14.000 px di guida e chi si ferma prima non vede mai il prodotto. La barra porta lo stesso richiamo a chi è dentro
 * l'articolo, senza entrare nel testo della redazione.
 *
 * ⛔ Non deve diventare il portale pieno di banner (PRODUCT.md, anti-riferimenti):
 * - una barra sola, sottile, che non copre il testo che si sta leggendo e si chiude con la X (vale per la visita);
 * - compare dopo il primo schermo e solo a chi ha già scelto sui cookie, così non si somma al banner del consenso;
 * - sparisce quando arriva il blocco in fondo: lì il richiamo c'è già, due insieme sarebbero troppo;
 * - da 1280 px non c'è: sul computer lo stesso richiamo sta fermo nella colonna di sinistra (`CartaPubblicita`).
 * È pubblicità e lo dice: l'etichetta scritta, come nel blocco (D.Lgs. 145/2007, art. 5).
 */
export default function BarraPubblicita({ prodotto, articolo }: { prodotto: ProdottoFunnel; articolo: string }) {
  const p = FUNNEL[prodotto];
  const [inCorsa, setInCorsa] = useState(false);
  // Chiusa con la X in questa visita? Si legge una volta, quando la barra nasce. Sul server vale «no»: la prima
  // pagina è uguale lo stesso, perché la barra parte nascosta finché non si scorre.
  const [chiusa, setChiusa] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(window.sessionStorage.getItem(CHIUSA));
    } catch {
      // Storage negato: la barra si chiude lo stesso, solo che alla pagina dopo ricompare.
      return false;
    }
  });

  useEffect(() => {
    let atteso = 0;
    const aggiorna = () => {
      atteso = 0;
      const blocco = document.querySelector(".blocco-prodotto");
      const arrivato = blocco ? blocco.getBoundingClientRect().top < window.innerHeight : false;
      setInCorsa(window.scrollY > window.innerHeight && !arrivato && leggiConsenso() !== null);
    };
    const suScorrimento = () => {
      if (!atteso) atteso = window.requestAnimationFrame(aggiorna);
    };
    suScorrimento();
    window.addEventListener("scroll", suScorrimento, { passive: true });
    window.addEventListener("resize", suScorrimento);
    return () => {
      window.removeEventListener("scroll", suScorrimento);
      window.removeEventListener("resize", suScorrimento);
      if (atteso) window.cancelAnimationFrame(atteso);
    };
  }, []);

  const mostra = inCorsa && !chiusa;

  // Il pulsante «Torna in cima» sta nello stesso angolo: con la barra su, sale (globals.css, `.torna-su`).
  useEffect(() => {
    const html = document.documentElement;
    if (mostra) html.dataset.barraPubblicita = "";
    else delete html.dataset.barraPubblicita;
    return () => {
      delete html.dataset.barraPubblicita;
    };
  }, [mostra]);

  function chiudi() {
    setChiusa(true);
    try {
      window.sessionStorage.setItem(CHIUSA, "1");
    } catch {
      // vedi sopra
    }
  }

  return (
    <div
      className="barra-pubblicita"
      data-visibile={mostra ? "" : undefined}
      role="complementary"
      aria-label={`Pubblicità: ${p.nome}`}
      inert={!mostra}
    >
      <div className="barra-pubblicita__testo">
        <span className="barra-pubblicita__riga">
          <span className="blocco-prodotto__etichetta">Pubblicità</span>
          {p.nome}
        </span>
        <span className="barra-pubblicita__frase">{RICHIAMO[prodotto].frase}</span>
      </div>
      <Link href={`/demo/${p.slug}?da=${encodeURIComponent(articolo)}`} className="barra-pubblicita__vai">
        Provalo <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <button type="button" onClick={chiudi} className="barra-pubblicita__chiudi" aria-label="Chiudi la pubblicità">
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
