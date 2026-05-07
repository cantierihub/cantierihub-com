import Link from "next/link";

const prodotti = [
  { label: "Preventivatore AI", href: "/preventivatore" },
  { label: "Computatore AI", href: "/computatore" },
];

const azienda = [
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contatti", href: "/contatti" },
];

const legale = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookie" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#1e293b" />
                <path d="M6 16h4M22 16h4M16 6v4M16 22v4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="4" fill="#f97316" />
                <path d="M10 10l3 3M19 19l3 3M10 22l3-3M19 13l3-3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-display font-bold text-white text-lg">
                Cantieri<span className="text-orange-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Il software AI per imprese edili italiane. Dal computo metrico al preventivo professionale, in pochi minuti.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Adact Studio International LLC<br />
              13057 Park Blvd, Seminole FL 33776, USA
            </p>
          </div>

          {/* Prodotti */}
          <div>
            <h4 className="eyebrow text-gray-400 mb-4">Prodotti</h4>
            <ul className="space-y-2">
              {prodotti.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h4 className="eyebrow text-gray-400 mb-4">Azienda</h4>
            <ul className="space-y-2">
              {azienda.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="eyebrow text-gray-400 mb-4">Inizia ora</h4>
            <p className="text-sm text-gray-400 mb-4">
              Prenota una demo gratuita e scopri come Cantieri Hub trasforma il tuo modo di lavorare.
            </p>
            <Link
              href="/contatti"
              className="cta-shimmer inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              Prenota Demo →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Cantieri Hub — Adact Studio International LLC. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-4">
            {legale.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}