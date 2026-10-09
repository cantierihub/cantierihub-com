import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNNEL, type ProdottoFunnel } from "@/data/funnelNotizie";

/**
 * Il blocco «Pubblicità» in fondo all'articolo: il primo passo del funnel delle Notizie (Raffaele, 03/10/2026).
 * Porta a /demo/<prodotto>?da=<slug>, dove si legge cosa fa il prodotto e ci si candida per la demo.
 *
 * «Il seguito dell'articolo» (Raffaele, 09/10/2026: «migliorare il placement… quando proponiamo uno dei nostri
 * prodotti»): quando il prodotto ha i suoi passi con le schermate vere (`passi` in `funnelNotizie.ts`), chi ha appena
 * letto come si fa una cosa a mano vede come la fa il programma, in tre passi. Senza, resta il blocco di solo testo.
 *
 * ⛔ È pubblicità e deve sembrarlo (D.Lgs. 145/2007, art. 5; CONFORMITA §1.6):
 * - l'etichetta «Pubblicità» è testo vero, in alto, leggibile senza cliccare;
 * - il blocco ha una forma che i riquadri della redazione non hanno (bordo tratteggiato, o le tre schermate del
 *   programma), così non si confonde con «In breve», «Cosa cambia» o «Cosa fare adesso»;
 * - un solo pulsante, che dice dove porta; i cerchi dei passi sono navy, non arancio come i passi della redazione.
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
  const link = `/demo/${p.slug}?da=${encodeURIComponent(articolo)}`;
  const testa = (
    <p className="blocco-prodotto__testa">
      <span className="blocco-prodotto__etichetta">Pubblicità</span>
      <span>
        {p.slug === "cantieri-hub" ? "Cantieri Hub" : `${p.nome}, un software di Cantieri Hub`}, l&apos;azienda che pubblica
        queste notizie
      </span>
    </p>
  );

  if (p.passi) {
    return (
      <aside aria-label={`Pubblicità: ${p.nome}`} className="blocco-prodotto blocco-prodotto--passi">
        {testa}
        {/* Il titolo è lo stesso della pagina della demo: chi clicca ritrova la promessa che ha cliccato. */}
        <h2>{p.blocco.titolo}</h2>
        <p className="blocco-prodotto__sotto">
          {gancio ? `${gancio.replace(/[.\s]+$/, "")}. ` : ""}Ecco come, nel programma vero:
        </p>
        <ol className="blocco-prodotto__passi">
          {p.passi.map((passo) => {
            const r = passo.schermata.ritaglio;
            const f = passo.schermata.fotogramma;
            return (
              <li key={passo.titolo} className="blocco-prodotto__passo">
                {/* Il riquadro ha le proporzioni del ritaglio; l'immagine intera, più grande, si sposta dentro finché il
                    ritaglio combacia (`top` in percentuale si conta sull'altezza del riquadro). */}
                <div className="blocco-prodotto__schermata" style={{ aspectRatio: `${r.larghezza} / ${r.altezza}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- ritaglio a mano: next/image con fill non lo fa */}
                  <img
                    src={passo.schermata.immagine}
                    alt={passo.schermata.descrizione}
                    loading="lazy"
                    decoding="async"
                    width={f.larghezza}
                    height={f.altezza}
                    style={{
                      width: `${(f.larghezza / r.larghezza) * 100}%`,
                      left: `${(-r.x / r.larghezza) * 100}%`,
                      top: `${(-r.y / r.altezza) * 100}%`,
                    }}
                  />
                </div>
                {/* Il numero lo scrive il CSS sull'elenco (`li::before`), come nei passi della redazione. */}
                <p className="blocco-prodotto__nome">{passo.titolo}</p>
                <p className="blocco-prodotto__cosa">{passo.testo}</p>
              </li>
            );
          })}
        </ol>
        <Link href={link} className="btn-funnel blocco-prodotto__pulsante">
          {p.blocco.pulsante} <ArrowRight size={16} className="arrow" aria-hidden="true" />
        </Link>
        <p className="blocco-prodotto__nota">{p.blocco.nota}</p>
      </aside>
    );
  }

  return (
    // Il nome per chi usa un lettore di schermo dice subito che è pubblicità, non solo il titolo.
    <aside aria-label={`Pubblicità: ${p.nome}`} className="blocco-prodotto">
      {testa}
      {/* Il titolo è lo stesso della pagina della demo: chi clicca ritrova la promessa che ha cliccato. Il gancio
          dell'articolo, se c'è, apre il testo. */}
      <h2>{p.blocco.titolo}</h2>
      <p className="blocco-prodotto__testo">
        {gancio ? `${gancio.replace(/[.\s]+$/, "")}. ` : ""}
        {p.blocco.testo}
      </p>
      <Link href={link} className="btn-funnel blocco-prodotto__pulsante">
        {p.blocco.pulsante} <ArrowRight size={16} className="arrow" aria-hidden="true" />
      </Link>
      <p className="blocco-prodotto__nota">{p.blocco.nota}</p>
    </aside>
  );
}
