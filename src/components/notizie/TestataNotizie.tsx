import Link from "next/link";
import { CATEGORIE } from "@/lib/notizie";

/** La testata blu di /notizie e delle categorie, con le cinque sezioni sempre a portata. */
export default function TestataNotizie({
  occhiello,
  titolo,
  sottotitolo,
  attiva,
}: {
  occhiello: string;
  titolo: string;
  sottotitolo: string;
  attiva?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-16 w-[520px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)" }}
      />
      <div className="container-main relative pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow !text-orange-400">{occhiello}</p>
        <h1 className="mt-3 font-display font-extrabold text-white leading-[1.08] tracking-tight text-[2.1rem] md:text-[3.2rem] max-w-3xl">
          {titolo}
        </h1>
        <p className="mt-4 text-navy-300 text-lg leading-relaxed max-w-2xl">{sottotitolo}</p>

        <nav aria-label="Sezioni delle notizie" className="mt-9 -mx-1 flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/notizie"
            aria-current={attiva === undefined ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              attiva === undefined ? "bg-orange-500 text-white" : "bg-white/10 text-navy-200 hover:bg-white/15 hover:text-white"
            }`}
          >
            Tutte
          </Link>
          {CATEGORIE.map((c) => (
            <Link
              key={c.slug}
              href={`/notizie/${c.slug}`}
              aria-current={attiva === c.slug ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                attiva === c.slug ? "bg-orange-500 text-white" : "bg-white/10 text-navy-200 hover:bg-white/15 hover:text-white"
              }`}
            >
              {c.nome}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
