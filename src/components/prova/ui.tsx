import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";

/**
 * I pezzi dell'interfaccia del Preventivatore (shadcn/ui di `preventivatorepro`, 07/10/2026) rifatti con le classi del
 * sito: stesse forme, stessi colori (navy = primary, arancio = accent, bordo #e2e8f0, sfondo #f8fafc, raggio 8 px).
 * Le differenze sono solo per il telefono: testo mai sotto i 14 px, campi a 16 px (iOS non ingrandisce la pagina),
 * bersagli da 44 px.
 */

const unisci = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={unisci("rounded-lg border border-navy-200 bg-white text-navy shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1.5 p-4 pb-3 md:p-6 md:pb-3">{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={unisci("flex items-center gap-1.5 font-semibold leading-none tracking-tight", className ?? "text-[15px]")}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={unisci("p-4 pt-0 md:p-6 md:pt-0", className)}>{children}</div>;
}

type Variante = "default" | "outline" | "ghost" | "accent";
type Misura = "sm" | "default" | "lg";

const VARIANTI: Record<Variante, string> = {
  default: "bg-navy text-white hover:bg-navy/90",
  outline: "border border-navy-200 bg-white text-navy hover:bg-orange-500 hover:text-white",
  ghost: "text-navy-600 hover:bg-orange-500 hover:text-white",
  // L'arancio del pulsante principale (accent nel prodotto) un tono più scuro: col bianco sopra si legge anche al sole.
  accent: "bg-orange-600 text-white hover:bg-orange-600/90",
};
const MISURE: Record<Misura, string> = {
  sm: "min-h-11 px-3 text-sm md:min-h-9",
  default: "min-h-11 px-4 text-sm md:min-h-10",
  lg: "min-h-12 px-8 text-[16px]",
};

export function Bottone({
  variante = "default",
  misura = "default",
  className,
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; misura?: Misura }) {
  return (
    <button
      type="button"
      {...resto}
      className={unisci(
        "inline-flex items-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        VARIANTI[variante],
        MISURE[misura],
        // Centrato, salvo chi chiede un'altra disposizione (es. «Parametri avanzati»: testo a sinistra, freccia a destra).
        !className?.includes("justify-") && "justify-center",
        className,
      )}
    />
  );
}

export function Etichetta({ htmlFor, piccola, children }: { htmlFor?: string; piccola?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={piccola ? "block text-sm text-navy-600" : "block text-sm font-medium text-navy"}>
      {children}
    </label>
  );
}

const CAMPO =
  "w-full rounded-md border border-navy-200 bg-white px-3 text-[16px] text-navy placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:text-sm";

export function Tendina({
  etichetta,
  piccola,
  valore,
  onCambia,
  opzioni,
  segnaposto,
}: {
  etichetta: string;
  piccola?: boolean;
  valore: string;
  onCambia: (v: string) => void;
  opzioni: readonly { valore: string; etichetta: string }[];
  segnaposto?: string;
}) {
  const id = useId();
  return (
    <div>
      <Etichetta htmlFor={id} piccola={piccola}>
        {etichetta}
      </Etichetta>
      <div className={unisci("relative", piccola ? "mt-1" : "mt-1.5")}>
        <select
          id={id}
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          className={unisci(CAMPO, "min-h-11 appearance-none py-2 pr-9 md:min-h-10", valore === "" && "text-navy-500")}
        >
          {segnaposto && (
            <option value="" disabled>
              {segnaposto}
            </option>
          )}
          {opzioni.map((o) => (
            <option key={o.valore} value={o.valore}>
              {o.etichetta}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" aria-hidden="true" />
      </div>
    </div>
  );
}

export function Testo({
  etichetta,
  piccola,
  valore,
  onCambia,
  segnaposto,
  righe,
  max,
  altezza,
}: {
  etichetta: string;
  piccola?: boolean;
  valore: string;
  onCambia: (v: string) => void;
  segnaposto: string;
  righe?: number;
  max?: number;
  altezza: string;
}) {
  const id = useId();
  return (
    <div>
      <Etichetta htmlFor={id} piccola={piccola}>
        {etichetta}
      </Etichetta>
      <textarea
        id={id}
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        placeholder={segnaposto}
        rows={righe}
        maxLength={max}
        className={unisci(CAMPO, "mt-1.5 py-2 leading-relaxed", altezza)}
      />
    </div>
  );
}

/** Le scelte a pallino del prodotto (RadioGroup): un cerchio navy col punto pieno, in fila e a capo. */
export function GruppoRadio({
  etichetta,
  nome,
  valore,
  onCambia,
  opzioni,
}: {
  etichetta: string;
  nome: string;
  valore: string;
  onCambia: (v: string) => void;
  opzioni: readonly { valore: string; etichetta: string }[];
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy">{etichetta}</legend>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0">
        {opzioni.map((o) => (
          <label key={o.valore} className="group flex min-h-10 cursor-pointer items-center gap-2 text-sm text-navy">
            <input
              type="radio"
              name={nome}
              value={o.valore}
              checked={valore === o.valore}
              onChange={() => onCambia(o.valore)}
              className="sr-only"
            />
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-navy group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-orange-500 group-has-[:focus-visible]:ring-offset-2">
              <span className="h-2.5 w-2.5 scale-0 rounded-full bg-navy transition-transform group-has-[:checked]:scale-100" />
            </span>
            {o.etichetta}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Cursore({ nome, valore, max, onCambia }: { nome: string; valore: number; max: number; onCambia: (v: number) => void }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="text-navy-600">
          {nome}
        </label>
        <span className="font-medium tabular-nums">{valore}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={valore}
        onChange={(e) => onCambia(Number(e.target.value))}
        className="h-6 w-full cursor-pointer accent-navy"
      />
    </div>
  );
}

export function Badge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={unisci("inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold", className)}>{children}</span>;
}

/** Il tooltip dell'icona «i»: col mouse al passaggio, al telefono col tocco (prende il fuoco). */
export function Suggerimento({ testo }: { testo: string }) {
  return (
    <span className="group relative inline-flex">
      <button type="button" className="-m-2.5 grid h-10 w-10 place-items-center rounded-full text-navy-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={testo}>
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-20 mt-1 w-64 -translate-x-1/2 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm font-normal leading-snug text-navy shadow-md group-hover:visible group-focus-within:visible"
      >
        {testo}
      </span>
    </span>
  );
}
