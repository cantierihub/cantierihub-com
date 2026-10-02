import Link from "next/link";

// La 404 del sito (audit SEO 01/10/2026). Prima c'era quella di Next: titolo in inglese («404: This page could not be
// found.») accanto a quello del sito, e due meta robots in contraddizione. Next aggiunge da solo il `noindex`.
export default function NonTrovata() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-main max-w-2xl text-center">
        <p className="eyebrow !text-orange-600">Errore 404</p>
        <h1 className="mt-3 font-display font-extrabold text-navy text-4xl md:text-5xl">Questa pagina non c&apos;è.</h1>
        <p className="mt-4 text-navy-600 text-lg">
          Forse il link è vecchio o c&apos;è un errore nell&apos;indirizzo. Da qui puoi ripartire:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600">Home</Link>
          <Link href="/notizie" className="rounded-lg border border-navy-200 px-5 py-3 font-semibold text-navy hover:border-orange-300">Notizie</Link>
          <Link href="/preventivatore" className="rounded-lg border border-navy-200 px-5 py-3 font-semibold text-navy hover:border-orange-300">Preventivatore AI</Link>
          <Link href="/contatti" className="rounded-lg border border-navy-200 px-5 py-3 font-semibold text-navy hover:border-orange-300">Contatti</Link>
        </div>
      </div>
    </section>
  );
}
