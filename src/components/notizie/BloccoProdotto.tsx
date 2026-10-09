import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNNEL, type ProdottoFunnel } from "@/data/funnelNotizie";
import ClipVetrina from "@/components/notizie/ClipVetrina";

/**
 * Il blocco «Pubblicità» in fondo all'articolo: il primo passo del funnel delle Notizie (Raffaele, 03/10/2026).
 * Porta a /demo/<prodotto>?da=<slug>, dove si legge cosa fa il prodotto e ci si candida per la demo.
 *
 * «La vetrina» (Raffaele, 09/10/2026: «migliorare il placement… quando proponiamo uno dei nostri prodotti»): quando il
 * prodotto ha una clip vera (`vetrina` in `funnelNotizie.ts`) il blocco la mostra in un palco, perché fino a lì era
 * solo testo e il prodotto non si vedeva. I testi sono nella voce delle statiche Meta (titolo, pulsante e nota in
 * `funnelNotizie.ts`): il pulsante dice cosa provi, la nota com'è la demo.
 *
 * ⛔ È pubblicità e deve sembrarlo (D.Lgs. 145/2007, art. 5; CONFORMITA §1.6):
 * - l'etichetta «Pubblicità» è testo vero, in alto, leggibile senza cliccare;
 * - il blocco ha una forma che i riquadri della redazione non hanno (bordo tratteggiato, o il palco con la clip), così
 *   non si confonde con «In breve», «Cosa cambia» o «Cosa fare adesso»;
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
  const v = p.vetrina;
  return (
    // Il nome per chi usa un lettore di schermo dice subito che è pubblicità, non solo il titolo.
    <aside aria-label={`Pubblicità: ${p.nome}`} className={v ? "blocco-prodotto blocco-prodotto--vetrina" : "blocco-prodotto"}>
      <p className="blocco-prodotto__testa">
        <span className="blocco-prodotto__etichetta">Pubblicità</span>
        <span>
          {p.slug === "cantieri-hub" ? "Cantieri Hub" : `${p.nome}, un software di Cantieri Hub`}, l&apos;azienda che pubblica
          queste notizie
        </span>
      </p>
      {v && (
        <div className="blocco-prodotto__palco">
          <span className="blocco-prodotto__vero">
            <span className="blocco-prodotto__punto" aria-hidden="true" />
            Il programma vero
          </span>
          {/* La finestra ha le proporzioni del ritaglio; la clip, più grande, si sposta dentro finché il ritaglio
              combacia (le percentuali di `top` si contano sull'altezza della finestra, quelle di `left` e `width`
              sulla larghezza). */}
          <div className="blocco-prodotto__finestra" style={{ aspectRatio: `${v.ritaglio.larghezza} / ${v.ritaglio.altezza}` }}>
            <ClipVetrina
              clip={v.clip}
              descrizione={v.descrizione}
              stile={{
                width: `${(v.fotogramma.larghezza / v.ritaglio.larghezza) * 100}%`,
                left: `${(-v.ritaglio.x / v.ritaglio.larghezza) * 100}%`,
                top: `${(-v.ritaglio.y / v.ritaglio.altezza) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
      <div className="blocco-prodotto__corpo">
        {/* Il titolo è lo stesso della pagina della demo: chi clicca ritrova la promessa che ha cliccato. Il gancio
            dell'articolo, se c'è, apre il testo. */}
        <h2>{p.blocco.titolo}</h2>
        <p className="blocco-prodotto__testo">
          {gancio ? `${gancio.replace(/[.\s]+$/, "")}. ` : ""}
          {p.blocco.testo}
        </p>
        <Link href={`/demo/${p.slug}?da=${encodeURIComponent(articolo)}`} className="btn-funnel blocco-prodotto__pulsante">
          {p.blocco.pulsante} <ArrowRight size={16} className="arrow" aria-hidden="true" />
        </Link>
        <p className="blocco-prodotto__nota">{p.blocco.nota}</p>
      </div>
    </aside>
  );
}
