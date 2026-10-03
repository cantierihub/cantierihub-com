import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNNEL, type ProdottoFunnel } from "@/data/funnelNotizie";

/**
 * Il blocco «Pubblicità» in fondo all'articolo: il primo passo del funnel delle Notizie (Raffaele, 03/10/2026).
 * Porta a /demo/<prodotto>?da=<slug>, dove si legge cosa fa il prodotto e ci si candida per la demo.
 *
 * ⛔ È pubblicità e deve sembrarlo (D.Lgs. 145/2007, art. 5; CONFORMITA §1.6):
 * - l'etichetta «Pubblicità» è testo vero, in alto, leggibile senza cliccare;
 * - il blocco ha una forma che i riquadri della redazione non hanno (bordo, fondo a puntini), così non si confonde
 *   con «Cosa cambia» o «Cosa fare adesso»;
 * - un solo pulsante, che dice dove porta.
 */
export default function BloccoProdotto({
  prodotto,
  articolo,
  gancio,
}: {
  prodotto: ProdottoFunnel;
  articolo: string;
  gancio?: string;
}) {
  const p = FUNNEL[prodotto];
  return (
    <aside aria-labelledby="blocco-prodotto-titolo" className="blocco-prodotto">
      <p className="blocco-prodotto__testa">
        <span className="blocco-prodotto__etichetta">Pubblicità</span>
        <span>Il software di Cantieri Hub, che cura queste notizie</span>
      </p>
      <p className="blocco-prodotto__nome">{p.nome}</p>
      <h2 id="blocco-prodotto-titolo">{gancio || p.blocco.titolo}</h2>
      <p className="blocco-prodotto__testo">{p.blocco.testo}</p>
      <Link href={`/demo/${p.slug}?da=${encodeURIComponent(articolo)}`} className="btn-primary blocco-prodotto__pulsante">
        Guarda cosa fa e candidati <ArrowRight size={16} className="arrow" aria-hidden="true" />
      </Link>
      <p className="blocco-prodotto__nota">Demo gratuita, dal vivo, sui tuoi file. Nessun impegno.</p>
    </aside>
  );
}
