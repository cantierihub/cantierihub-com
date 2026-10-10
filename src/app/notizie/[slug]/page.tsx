import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, HardHat, Info, ListChecks, Plus } from "lucide-react";
import IndiceArticolo from "@/components/notizie/IndiceArticolo";
import BloccoProdotto from "@/components/notizie/BloccoProdotto";
import BarraPubblicita from "@/components/notizie/BarraPubblicita";
import CartaPubblicita from "@/components/notizie/CartaPubblicita";
import TestataNotizie from "@/components/notizie/TestataNotizie";
import SchedaNotizia from "@/components/notizie/SchedaNotizia";
import {
  attoCorto,
  CATEGORIE,
  categoriaDa,
  dataLeggibile,
  fontiPerEnte,
  notiziaDa,
  notizieDellaCategoria,
  tieniInsieme,
  tutteLeNotizie,
  type Fonte,
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

  // Il blocco «Pubblicità» va SEMPRE dopo l'ultima sezione del corpo (di regola «Cosa fare adesso»), mai in mezzo al
  // testo della redazione: un sottotitolo a domanda come «Cosa fare se…» a metà articolo non lo deve attirare lì.
  const indiceBlocco = n.sezioni.length - 1;

  // L'indice: le domande del corpo, poi le domande frequenti e le fonti.
  const voci = [
    ...n.sezioni.filter((s) => s.titolo).map((s) => ({ id: s.id, titolo: s.titolo! })),
    ...(n.faq.length ? [{ id: "domande-frequenti", titolo: "Domande frequenti" }] : []),
    ...(n.fonti.length ? [{ id: "fonti", titolo: "Fonti" }] : []),
  ];

  return (
    <>
      <article className="pagina-articolo bg-white">
        <header className="container-main pt-8 md:pt-14">
          <div className="mx-auto max-w-[680px]">
            <nav aria-label="Percorso" className="flex flex-wrap items-center gap-1 text-sm text-navy-500">
              <Link href="/notizie" className="inline-flex min-h-11 items-center hover:text-navy">Notizie</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Link href={`/notizie/${categoria.slug}`} className="inline-flex min-h-11 items-center font-semibold text-orange-700 hover:text-orange-800">
                {categoria.nome}
              </Link>
            </nav>

            <h1 className="mt-2 font-display font-bold text-navy text-[2rem] leading-[1.15] tracking-[-0.02em] md:text-[2.75rem] md:leading-[1.1]">
              {tieniInsieme(n.titolo)}
            </h1>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-navy-700 md:text-xl">{tieniInsieme(n.descrizione)}</p>

            <div className="mt-6 flex items-center gap-3">
              <MarchioCH />
              <div className="min-w-0 text-sm leading-snug">
                {/* La firma porta a chi siamo e a come lavoriamo (CONFORMITA §3.2, 03/10: con la riga sull'AI in alto
                    se n'è andato il suo «Come lavoriamo»; Google chiede che la firma porti a chi scrive). */}
                <Link href="/ai-trasparenza#notizie" className="-my-3 inline-block py-3 font-semibold text-navy underline decoration-navy-300 underline-offset-[3px] hover:decoration-navy">
                  {n.autore}
                </Link>
                <p className="mt-0.5 text-navy-600">
                  <time dateTime={n.dataPubblicazione}>{dataLeggibile(n.dataPubblicazione)}</time>
                  {aggiornato && (
                    <>
                      {" · "}
                      <span className="font-semibold text-orange-800">
                        aggiornato il <time dateTime={n.dataAggiornamento}>{dataLeggibile(n.dataAggiornamento)}</time>
                      </span>
                    </>
                  )}
                  {` · ${n.minutiLettura} min di lettura`}
                </p>
              </div>
            </div>
            {/* Dal 03/10 la nota sull'AI è una sola, in fondo (Raffaele; CONFORMITA §3.2). Questa riga resta spenta e si
                riaccende con `nota_ai_in_alto: true` se un articolo esce senza la lettura completa di Raffaele: allora
                l'esenzione dell'AI Act cade e la dichiarazione va «all'inizio» del testo (linee guida, punto 143). */}
            {n.notaAiInAlto && (
              <p className="mt-4 border-t border-navy-200 pt-3 text-sm leading-snug text-navy-600">
                Scritto con l&apos;aiuto dell&apos;intelligenza artificiale.{" "}
                <Link href="/ai-trasparenza#notizie" className="whitespace-nowrap font-medium text-navy underline decoration-navy-300 underline-offset-[3px] hover:decoration-navy">
                  Come lavoriamo
                </Link>
              </p>
            )}
          </div>
        </header>

        {n.immagine && (
          <figure className="mx-auto mt-8 md:w-[min(960px,calc(100%_-_48px))]">
            <div className="relative aspect-[16/9] overflow-hidden bg-navy-100 md:rounded-2xl">
              <Image src={n.immagine} alt={n.immagineAlt ?? ""} fill priority sizes="(max-width: 1000px) 100vw, 960px" style={{ objectFit: "cover" }} />
            </div>
            {/* Niente didascalia dal 03/10: l'immagine AI è dichiarata dall'icona UE «AI GENERATED» dentro il file, a
                1/5 della larghezza perché si legga dal telefono (CONFORMITA §3.3), e dal riquadro in fondo. */}
          </figure>
        )}

        <div className="container-main pb-16 md:pb-24">
          <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_680px_minmax(0,1fr)] xl:gap-x-12">
            <div className="mx-auto max-w-[680px] xl:col-start-2 xl:mx-0">
              {n.inBreve && (
                <section aria-labelledby="in-breve" className="in-breve mt-8 md:mt-10">
                  <h2 id="in-breve">In breve</h2>
                  <p>{tieniInsieme(n.inBreve)}</p>
                </section>
              )}

              {aggiornato && n.notaAggiornamento && (
                <p className="mt-6 flex gap-2 rounded-xl bg-orange-50 px-4 py-3 text-[15px] text-orange-900">
                  <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span><strong>Aggiornamento del {dataLeggibile(n.dataAggiornamento)}:</strong> {tieniInsieme(n.notaAggiornamento)}</span>
                </p>
              )}

              {voci.length >= 3 && (
                <details className="indice-mobile mt-4 xl:hidden">
                  <summary>
                    <span>In questo articolo</span>
                    <span className="indice-mobile__conta">{voci.length} sezioni</span>
                    <ChevronDown size={18} aria-hidden="true" className="indice-mobile__freccia" />
                  </summary>
                  <ol>
                    {voci.map((v) => (
                      <li key={v.id}><a href={`#${v.id}`}>{v.titolo}</a></li>
                    ))}
                  </ol>
                </details>
              )}

              <div className="articolo mt-8">
                {n.sezioni.map((s, i) => (
                  <Fragment key={s.id}>
                    {s.tipo === "testo" ? (
                      <div>
                        {s.titolo && <h2 id={s.id}>{s.titolo}</h2>}
                        <div dangerouslySetInnerHTML={{ __html: s.html }} />
                      </div>
                    ) : (
                      <section aria-labelledby={s.id} className={`riquadro riquadro--${s.tipo}`}>
                        <h2 id={s.id}>
                          <span className="riquadro__icona" aria-hidden="true">
                            {s.tipo === "cambia" ? <HardHat size={20} /> : <ListChecks size={20} />}
                          </span>
                          {s.titolo}
                        </h2>
                        <div dangerouslySetInnerHTML={{ __html: s.html }} />
                      </section>
                    )}
                    {/* Il blocco «Pubblicità» chiude l'articolo: dopo l'ultima sezione (di regola «Cosa fare adesso»), quando
                        chi legge si chiede cosa fare, e prima delle domande e delle fonti. */}
                    {n.prodotto && i === indiceBlocco && <BloccoProdotto prodotto={n.prodotto} articolo={n.slug} gancio={n.gancio} />}
                  </Fragment>
                ))}

                {n.faq.length > 0 && (
                  <section aria-labelledby="domande-frequenti">
                    <h2 id="domande-frequenti">Domande frequenti</h2>
                    <div className="domande">
                      {n.faq.map((d) => (
                        <details key={d.domanda}>
                          <summary>
                            <h3>{tieniInsieme(d.domanda)}</h3>
                            <Plus size={20} aria-hidden="true" className="domande__segno" />
                          </summary>
                          <p>{tieniInsieme(d.risposta)}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {n.fonti.length > 0 && (
                  <section aria-labelledby="fonti">
                    <h2 id="fonti">Fonti</h2>
                    <ol className="fonti">
                      {/* Tutta la riga è il link, ente compreso (CAN-196): il solo atto era alto 20 px. Così chi
                          usa un lettore di schermo sente anche l'ente («Normattiva, Codice civile Art. 1329»).
                          Le fonti di fila con lo stesso ente stanno sotto un'etichetta sola (CAN-272): l'etichetta il
                          lettore di schermo la salta, e l'ente lo sente dentro ogni link, come prima. Dentro il gruppo
                          gli atti corti stanno in fila (CAN-349), ma la lista resta una e nello stesso ordine. */}
                      {fontiPerEnte(n.fonti).map((gruppo) =>
                        gruppo.length === 1 ? (
                          <li key={gruppo[0].url}>
                            <a href={gruppo[0].url} target="_blank" rel="noopener">
                              <span className="fonti__ente">{tieniInsieme(gruppo[0].ente)}</span>{" "}
                              <AttoDellaFonte fonte={gruppo[0]} />
                            </a>
                          </li>
                        ) : (
                          <li key={gruppo[0].url} className="fonti__gruppo">
                            <span className="fonti__ente" aria-hidden="true">{tieniInsieme(gruppo[0].ente)}</span>
                            <ol className="fonti__atti">
                              {gruppo.map((f) => (
                                <li key={f.url} className={attoCorto(f) ? "fonti__corto" : undefined}>
                                  <a href={f.url} target="_blank" rel="noopener">
                                    <span className="sr-only">{tieniInsieme(f.ente)} </span>
                                    <AttoDellaFonte fonte={f} />
                                  </a>
                                </li>
                              ))}
                            </ol>
                          </li>
                        ),
                      )}
                    </ol>
                  </section>
                )}
              </div>

              {/* Testo da CONFORMITA.md §3.2 (Conformità AI e legale, 03/10/2026, CAN-37): l'unica nota sull'AI della pagina. */}
              <section aria-labelledby="come-nasce" className="mt-12 rounded-2xl bg-navy-50 p-5 text-[15px] leading-relaxed text-navy-700 md:p-6">
                <h2 id="come-nasce" className="font-display text-base font-semibold tracking-normal text-navy">Come è nato questo articolo</h2>
                <p className="mt-2">
                  Abbiamo preparato questo articolo con l&apos;aiuto di strumenti di intelligenza artificiale, partendo solo
                  dagli atti ufficiali elencati nelle Fonti. Prima di pubblicarlo, una persona della Redazione Cantieri Hub
                  l&apos;ha letto per intero e ha controllato i fatti sulle fonti. La responsabilità di quello che pubblichiamo
                  è di Cantieri Hub.
                  {n.immagine && n.immagineAi && (
                    <>
                      {" "}Anche l&apos;immagine di copertina è fatta con l&apos;intelligenza artificiale, come dice l&apos;etichetta
                      «AI» nell&apos;angolo: non è una foto vera.
                    </>
                  )}
                </p>
                <p className="mt-2">
                  L&apos;articolo spiega la norma in generale: per il tuo caso chiedi al tuo commercialista, al consulente del
                  lavoro o a un avvocato. Hai visto un errore? Scrivi a{" "}
                  <a href="mailto:info@cantierihub.com" className="font-medium text-navy underline decoration-navy-300 underline-offset-[3px] hover:decoration-navy">info@cantierihub.com</a>:
                  lo correggiamo e lo diciamo in cima all&apos;articolo.{" "}
                  <Link href="/ai-trasparenza#notizie" className="font-medium text-navy underline decoration-navy-300 underline-offset-[3px] hover:decoration-navy">Come lavoriamo</Link>
                </p>
              </section>

              <nav aria-label="Altre notizie" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
                <Link href="/notizie" className="inline-flex min-h-11 items-center gap-1.5 text-navy hover:text-orange-700">
                  <ArrowLeft size={16} aria-hidden="true" /> Tutte le notizie
                </Link>
                <Link href={`/notizie/${categoria.slug}`} className="inline-flex min-h-11 items-center text-navy hover:text-orange-700">
                  Altro su {categoria.nome.toLowerCase()}
                </Link>
              </nav>
            </div>

            {voci.length >= 3 && (
              <aside className="hidden xl:block">
                <div className="sticky top-28 pt-10">
                  <IndiceArticolo voci={voci} />
                </div>
              </aside>
            )}

            {/* «Ti accompagna» (09/10): da 1280 px il richiamo al prodotto sta fermo nella colonna di sinistra, che era
                vuota. Nel codice viene DOPO l'articolo, così chi usa un lettore di schermo legge prima la notizia. */}
            {n.prodotto && (
              <div className="hidden xl:block xl:col-start-1 xl:row-start-1">
                <div className="sticky top-28 pt-10">
                  <CartaPubblicita prodotto={n.prodotto} articolo={n.slug} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sul telefono lo stesso richiamo è una barra in basso, che compare dentro l'articolo e sparisce al blocco. */}
        {n.prodotto && <BarraPubblicita prodotto={n.prodotto} articolo={n.slug} />}
      </article>

      {correlate.length > 0 && (
        <section className="bg-navy-50 py-12 md:py-16">
          <div className="container-main">
            <h2 className="font-display font-bold text-navy text-2xl tracking-[-0.01em]">Altre notizie su {categoria.nome.toLowerCase()}</h2>
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

/** L'atto di una fonte, la parte sottolineata del link nel riquadro Fonti. L'icona va a capo con l'ultima parola, mai
 *  da sola (CAN-349: a 390 px quella di «Delibera n. 262…» finiva sulla riga dopo). */
function AttoDellaFonte({ fonte }: { fonte: Fonte }) {
  const atto = tieniInsieme(fonte.titolo);
  const fine = atto.lastIndexOf(" ") + 1;
  return (
    <span className="fonti__atto">
      {atto.slice(0, fine)}
      <span className="whitespace-nowrap">
        {atto.slice(fine)}
        <ExternalLink size={14} className="ml-1 inline align-[-2px]" aria-hidden="true" />
      </span>
    </span>
  );
}

/** Il marchio di Cantieri Hub accanto alla firma: è la redazione che firma, non una persona. */
function MarchioCH() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="8" fill="#0f172a" />
      <rect x="6.5" y="9" width="2.8" height="14" rx="1.4" fill="#f97316" />
      <path d="M9.3 10.5 C12 10.5 13.5 8 16.5 8 L21.5 8" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.3 13.5 L21.5 13.5" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.3 18.5 L21.5 18.5" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.3 21.5 C12 21.5 13.5 24 16.5 24 L21.5 24" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="23.2" cy="8" r="1.7" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="23.2" cy="13.5" r="1.7" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="23.2" cy="18.5" r="1.7" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="23.2" cy="24" r="1.7" stroke="#f97316" strokeWidth="1.5" />
    </svg>
  );
}
