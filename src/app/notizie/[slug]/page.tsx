import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink, Info, ListChecks, TriangleAlert } from "lucide-react";
import TestataNotizie from "@/components/notizie/TestataNotizie";
import SchedaNotizia from "@/components/notizie/SchedaNotizia";
import {
  CATEGORIE,
  categoriaDa,
  dataLeggibile,
  notiziaDa,
  notizieDellaCategoria,
  tutteLeNotizie,
  type Notizia,
} from "@/lib/notizie";
import { SITE_URL } from "@/data/site";

// Lo stesso segmento serve due cose: /notizie/<categoria> e /notizie/<slug-articolo>. Le categorie sono cinque e fisse,
// gli slug degli articoli sono frasi di 3-6 parole: non si scontrano. Tutto statico: uno slug che non esiste è un 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...CATEGORIE.map((c) => ({ slug: c.slug })), ...tutteLeNotizie().map((n) => ({ slug: n.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoria = categoriaDa(slug);
  if (categoria) {
    const titolo = `${categoria.nome} · Notizie per le imprese edili`;
    return {
      title: titolo,
      description: categoria.breve,
      alternates: { canonical: `/notizie/${slug}` },
      openGraph: { title: titolo, description: categoria.breve, url: `/notizie/${slug}`, images: ["/opengraph-image"] },
    };
  }
  const n = notiziaDa(slug);
  if (!n) return {};
  const immagini = [n.immagine || "/opengraph-image"];
  return {
    title: n.titolo,
    description: n.descrizione,
    authors: [{ name: n.autore }],
    alternates: { canonical: `/notizie/${slug}` },
    openGraph: {
      type: "article",
      title: n.titolo,
      description: n.descrizione,
      url: `/notizie/${slug}`,
      images: immagini,
      publishedTime: n.dataPubblicazione,
      modifiedTime: n.dataAggiornamento,
      section: categoriaDa(n.categoria)?.nome,
    },
    twitter: { card: "summary_large_image", title: n.titolo, description: n.descrizione, images: immagini },
  };
}

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoria = categoriaDa(slug);
  if (categoria) return <PaginaCategoria slug={categoria.slug} />;
  const n = notiziaDa(slug);
  if (!n) notFound();
  return <PaginaArticolo n={n} />;
}

function PaginaCategoria({ slug }: { slug: string }) {
  const c = categoriaDa(slug)!;
  const notizie = notizieDellaCategoria(slug);
  return (
    <>
      <TestataNotizie occhiello="Notizie" titolo={c.nome} sottotitolo={c.breve} attiva={slug} />
      <section className="bg-navy-50 py-12 md:py-16 min-h-[40vh]">
        <div className="container-main">
          {notizie.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-300 bg-white p-8 text-center">
              <p className="font-display font-bold text-navy text-xl">In questa sezione non c&apos;è ancora niente.</p>
              <p className="mt-2 text-navy-600">
                Arriva presto. Intanto, <Link href="/notizie" className="text-orange-700 underline underline-offset-2">tutte le notizie</Link>.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {notizie.map((n) => (
                <SchedaNotizia key={n.slug} notizia={n} />
              ))}
            </div>
          )}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Notizie", item: `${SITE_URL}/notizie` },
              { "@type": "ListItem", position: 3, name: c.nome, item: `${SITE_URL}/notizie/${slug}` },
            ],
          }),
        }}
      />
    </>
  );
}

function PaginaArticolo({ n }: { n: Notizia }) {
  const categoria = categoriaDa(n.categoria)!;
  const aggiornato = n.dataAggiornamento !== n.dataPubblicazione;
  const correlate = notizieDellaCategoria(n.categoria).filter((x) => x.slug !== n.slug).slice(0, 3);
  const url = `${SITE_URL}/notizie/${n.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": n.tipo === "guida" ? "Article" : "NewsArticle",
      headline: n.titolo,
      description: n.descrizione,
      datePublished: n.dataPubblicazione,
      dateModified: n.dataAggiornamento,
      inLanguage: "it-IT",
      articleSection: categoria.nome,
      mainEntityOfPage: url,
      ...(n.immagine ? { image: [`${SITE_URL}${n.immagine}`] } : {}),
      author: { "@type": "Organization", name: n.autore, url: `${SITE_URL}/notizie` },
      publisher: { "@type": "Organization", name: "Cantieri Hub", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-color.png` } },
      ...(n.fonti.length ? { isBasedOn: n.fonti.map((f) => f.url), citation: n.fonti.map((f) => f.url) } : {}),
      ...(n.parolaChiave ? { keywords: n.parolaChiave } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Notizie", item: `${SITE_URL}/notizie` },
        { "@type": "ListItem", position: 3, name: categoria.nome, item: `${SITE_URL}/notizie/${categoria.slug}` },
        { "@type": "ListItem", position: 4, name: n.titolo, item: url },
      ],
    },
    ...(n.faq.length
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: n.faq.map((d) => ({ "@type": "Question", name: d.domanda, acceptedAnswer: { "@type": "Answer", text: d.risposta } })),
        }]
      : []),
  ];

  return (
    <>
      <article className="bg-white">
        <header className="container-main pt-10 md:pt-14">
          <nav aria-label="Percorso" className="flex flex-wrap items-center gap-1 text-[13px] text-navy-500">
            <Link href="/" className="hover:text-navy">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/notizie" className="hover:text-navy">Notizie</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href={`/notizie/${categoria.slug}`} className="font-semibold text-orange-700 hover:text-orange-800">{categoria.nome}</Link>
          </nav>

          <div className="mx-auto max-w-[760px]">
            <h1 className="mt-6 font-display font-extrabold text-navy leading-[1.12] tracking-tight text-[2rem] md:text-[2.75rem]">
              {n.titolo}
            </h1>
            <p className="mt-4 text-navy-600 text-lg md:text-xl leading-relaxed">{n.descrizione}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy-500">
              <span className="font-semibold text-navy">{n.autore}</span>
              <span aria-hidden="true">·</span>
              <span>Pubblicato il <time dateTime={n.dataPubblicazione}>{dataLeggibile(n.dataPubblicazione)}</time></span>
              {aggiornato && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-orange-700">
                    Aggiornato il <time dateTime={n.dataAggiornamento}>{dataLeggibile(n.dataAggiornamento)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{n.minutiLettura} min di lettura</span>
            </p>
            {/* AI Act art. 50: la dichiarazione va «all'inizio» del testo (linee guida della Commissione, punto 143).
                Vault: sito-seo/CONFORMITA.md §3.2. */}
            <p className="mt-2 text-sm text-navy-500">
              Scritto con l&apos;aiuto dell&apos;intelligenza artificiale e controllato da una persona ·{" "}
              <Link href="/ai-trasparenza#notizie" className="underline underline-offset-2 hover:text-navy">Come lavoriamo</Link>
            </p>
          </div>
        </header>

        {n.immagine && (
          <div className="container-main mt-8">
            <figure className="mx-auto max-w-[960px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-navy-100">
                <Image src={n.immagine} alt={n.immagineAlt ?? ""} fill priority sizes="(max-width: 1000px) 100vw, 960px" style={{ objectFit: "cover" }} />
              </div>
              {/* Un'immagine fotorealistica fatta con l'AI va dichiarata a vista (AI Act art. 50, linee guida punto 117). */}
              {n.immagineAi && <figcaption className="mt-2 text-[13px] text-navy-500">Immagine generata con l&apos;intelligenza artificiale</figcaption>}
            </figure>
          </div>
        )}

        <div className="container-main pb-16 md:pb-24">
          <div className="mx-auto max-w-[680px]">
            {n.inBreve && (
              <section aria-label="In breve" className="mt-10 rounded-2xl border-l-4 border-orange-500 bg-navy-50 px-6 py-5">
                <p className="eyebrow !text-orange-700">In breve</p>
                <p className="mt-2 text-[19px] leading-relaxed font-medium text-navy">{n.inBreve}</p>
              </section>
            )}

            {aggiornato && n.notaAggiornamento && (
              <p className="mt-6 flex gap-2 rounded-xl bg-orange-50 px-4 py-3 text-[15px] text-orange-900">
                <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span><strong>Aggiornamento del {dataLeggibile(n.dataAggiornamento)}:</strong> {n.notaAggiornamento}</span>
              </p>
            )}

            <div className="articolo mt-8">
              {n.sezioni.map((s) =>
                s.tipo === "testo" ? (
                  <div key={s.id}>
                    {s.titolo && <h2 id={s.id}>{s.titolo}</h2>}
                    <div dangerouslySetInnerHTML={{ __html: s.html }} />
                  </div>
                ) : (
                  <section key={s.id} className={`riquadro riquadro--${s.tipo}`}>
                    <h2 id={s.id}>
                      {s.tipo === "cambia" ? <TriangleAlert size={22} className="text-orange-600" aria-hidden="true" /> : <ListChecks size={22} className="text-orange-400" aria-hidden="true" />}
                      {s.titolo}
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: s.html }} />
                  </section>
                ),
              )}

              {n.faq.length > 0 && (
                <>
                  <h2 id="domande-frequenti">Domande frequenti</h2>
                  <div className="not-articolo divide-y divide-navy-200 rounded-2xl border border-navy-200">
                    {n.faq.map((d) => (
                      <div key={d.domanda} className="px-5 py-4">
                        <h3 className="!mt-0 !mb-1.5 !text-[17px]">{d.domanda}</h3>
                        <p className="!mb-0 text-[16px] text-navy-700">{d.risposta}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {n.fonti.length > 0 && (
              <section aria-labelledby="fonti" className="mt-12 rounded-2xl border border-navy-200 bg-navy-50 p-6">
                <h2 id="fonti" className="font-display font-bold text-navy text-lg">Fonti</h2>
                <ul className="mt-3 space-y-2.5">
                  {n.fonti.map((f) => (
                    <li key={f.url} className="text-[15px] leading-snug">
                      <span className="font-semibold text-navy">{f.ente}</span>
                      {" — "}
                      <a href={f.url} target="_blank" rel="noopener" className="text-orange-700 underline underline-offset-2 hover:text-orange-800">
                        {f.titolo}
                        <ExternalLink size={13} className="ml-1 inline align-[-1px]" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Testo da CONFORMITA.md §3.2 (studio della Conformità AI e legale, 02/10/2026). */}
            <section aria-labelledby="come-nasce" className="mt-8 rounded-2xl border border-navy-200 p-6 text-[15px] leading-relaxed text-navy-600">
              <h2 id="come-nasce" className="font-display font-bold text-navy text-base">Come è nato questo articolo</h2>
              <p className="mt-2">
                Abbiamo preparato questo articolo con l&apos;aiuto di strumenti di intelligenza artificiale, partendo solo
                dagli atti ufficiali elencati nelle Fonti. Prima di pubblicarlo, una persona della Redazione Cantieri Hub
                l&apos;ha letto per intero e ha controllato i fatti sulle fonti. La responsabilità di quello che pubblichiamo
                è di Cantieri Hub.
              </p>
              <p className="mt-2">
                L&apos;articolo spiega la norma in generale: per il tuo caso chiedi al tuo commercialista, al consulente del
                lavoro o a un avvocato. Hai visto un errore? Scrivi a{" "}
                <a href="mailto:info@cantierihub.com" className="underline underline-offset-2 hover:text-navy">info@cantierihub.com</a>:
                lo correggiamo e lo diciamo in cima all&apos;articolo.{" "}
                <Link href="/ai-trasparenza#notizie" className="underline underline-offset-2 hover:text-navy">Come lavoriamo</Link>
              </p>
            </section>
          </div>
        </div>
      </article>

      {correlate.length > 0 && (
        <section className="bg-navy-50 py-12 md:py-16">
          <div className="container-main">
            <h2 className="font-display font-extrabold text-navy text-2xl">Altre notizie su {categoria.nome.toLowerCase()}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {correlate.map((x) => <SchedaNotizia key={x.slug} notizia={x} />)}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
