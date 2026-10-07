import { euro } from "@/lib/prova/analisi";

/**
 * La riga del mercato (07/10/2026): il prezzo basso-alto della regione come una fascia, il prezzo suggerito sopra la
 * riga e, se l'ha scritto, il prezzo suo sotto. È il punto della pagina che si capisce senza leggere: dove sta lui
 * rispetto al mercato e all'analisi.
 *
 * Le etichette vicine ai bordi si allineano verso l'interno, così a 390 px non escono dallo schermo.
 */
type Props = {
  mercato: { basso: number; medio: number; alto: number };
  prezzo: number;
  prezzoTuo: number | null;
  unita: string;
  regione: string;
};

function allinea(p: number) {
  if (p < 20) return { left: `${p}%`, transform: "translateX(-12px)" };
  if (p > 80) return { left: `${p}%`, transform: "translateX(calc(-100% + 12px))" };
  return { left: `${p}%`, transform: "translateX(-50%)" };
}

export default function RigaMercato({ mercato, prezzo, prezzoTuo, unita, regione }: Props) {
  const valori = [mercato.basso, mercato.alto, prezzo, ...(prezzoTuo !== null ? [prezzoTuo] : [])];
  const lo = Math.min(...valori);
  const hi = Math.max(...valori);
  const margine = (hi - lo) * 0.12 || hi * 0.1;
  const min = Math.max(0, lo - margine);
  const max = hi + margine;
  const pos = (v: number) => ((v - min) / (max - min)) * 100;

  const descrizione =
    `Prezzi di mercato in ${regione}: da ${euro(mercato.basso)} a ${euro(mercato.alto)}, medio ${euro(mercato.medio)} per ${unita}. ` +
    `Prezzo suggerito ${euro(prezzo)}.` +
    (prezzoTuo !== null ? ` Il tuo prezzo ${euro(prezzoTuo)}.` : "");

  return (
    <figure className="mt-6">
      <div role="img" aria-label={descrizione} className={`relative ${prezzoTuo !== null ? "h-[104px]" : "h-[68px]"}`}>
        {/* Il prezzo suggerito, sopra la riga */}
        <div className="absolute top-0 flex flex-col items-start" style={allinea(pos(prezzo))}>
          <span className="whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[14px] font-semibold tabular-nums text-white">
            Suggerito {euro(prezzo)}
          </span>
        </div>
        <span aria-hidden="true" className="absolute top-[30px] h-[18px] w-0.5 -translate-x-1/2 bg-navy" style={{ left: `${pos(prezzo)}%` }} />

        {/* La riga: tutto il campo, la fascia del mercato, il medio */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[46px] h-2.5 rounded-full bg-navy-100" />
        <div
          aria-hidden="true"
          className="absolute top-[46px] h-2.5 rounded-full bg-navy-300"
          style={{ left: `${pos(mercato.basso)}%`, width: `${pos(mercato.alto) - pos(mercato.basso)}%` }}
        />
        <span aria-hidden="true" className="absolute top-[43px] h-4 w-0.5 -translate-x-1/2 bg-navy-600" style={{ left: `${pos(mercato.medio)}%` }} />
        <span aria-hidden="true" className="absolute top-[42px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-white bg-navy shadow" style={{ left: `${pos(prezzo)}%` }} />

        {/* Il prezzo suo, sotto la riga */}
        {prezzoTuo !== null && (
          <>
            <span aria-hidden="true" className="absolute top-[42px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-white bg-orange-500 shadow" style={{ left: `${pos(prezzoTuo)}%` }} />
            <span aria-hidden="true" className="absolute top-[60px] h-[14px] w-0.5 -translate-x-1/2 bg-orange-500" style={{ left: `${pos(prezzoTuo)}%` }} />
            <div className="absolute top-[74px]" style={allinea(pos(prezzoTuo))}>
              <span className="whitespace-nowrap rounded-md bg-orange-500 px-2 py-1 text-[14px] font-semibold tabular-nums text-navy">
                Il tuo {euro(prezzoTuo)}
              </span>
            </div>
          </>
        )}
      </div>
      <figcaption className="mt-3 text-[14px] leading-snug text-navy-600">
        <span className="mr-2 inline-block h-2.5 w-5 rounded-full bg-navy-300 align-middle" aria-hidden="true" />
        Mercato in {regione}: <span className="tabular-nums">{euro(mercato.basso)} – {euro(mercato.alto)}</span> per {unita}, medio{" "}
        <span className="tabular-nums">{euro(mercato.medio)}</span>
      </figcaption>
    </figure>
  );
}
