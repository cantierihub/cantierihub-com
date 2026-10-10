import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNNEL, type ProdottoFunnel } from "@/data/funnelNotizie";
import { RICHIAMO } from "@/data/richiamoNotizie";

/**
 * Il riquadro «Pubblicità» nella colonna di sinistra, da 1280 px («Ti accompagna», Raffaele 09/10/2026): la colonna
 * era vuota, e il blocco in fondo lo vede solo chi arriva in fondo. Sta fermo mentre si scorre, come l'indice a destra.
 * Sul telefono lo stesso richiamo è la barra in basso (`BarraPubblicita`).
 *
 * ⛔ È pubblicità e lo dice (D.Lgs. 145/2007, art. 5): etichetta scritta in alto; fuori dalla colonna del testo, così
 * non si confonde con la redazione. La schermata, se c'è, è del programma vero (`schermata` in `richiamoNotizie.ts`).
 */
export default function CartaPubblicita({ prodotto, articolo }: { prodotto: ProdottoFunnel; articolo: string }) {
  const p = FUNNEL[prodotto];
  const s = RICHIAMO[prodotto].schermata;
  // In 212 px il pulsante va a capo, e fra una parola e l'icona il browser può sempre andarci, anche con lo spazio
  // unificatore (CSS Text 3, §5.1): la freccia finiva da sola sotto (CAN-313). L'ultima parola e la freccia stanno in
  // un pezzo che non si spezza.
  const parole = p.blocco.pulsante.split(" ");
  const ultima = parole.pop();
  return (
    <aside aria-label={`Pubblicità: ${p.nome}`} className="carta-pubblicita">
      <p className="carta-pubblicita__riga">
        <span className="blocco-prodotto__etichetta">Pubblicità</span>
        <span>{p.nome}</span>
      </p>
      {s && (
        <div
          role="img"
          aria-label={s.descrizione}
          className="carta-pubblicita__schermata"
          style={{ backgroundImage: `url(${s.immagine})`, backgroundSize: s.ingrandimento, backgroundPosition: s.posizione }}
        />
      )}
      {/* Un punto solo, come nelle statiche: il titolo del blocco, che è anche quello della pagina demo. */}
      <p className="carta-pubblicita__frase">{p.blocco.titolo}</p>
      <Link href={`/demo/${p.slug}?da=${encodeURIComponent(articolo)}`} className="carta-pubblicita__vai">
        {parole.join(" ")}{" "}
        <span className="carta-pubblicita__coda">
          {ultima}
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </aside>
  );
}
