import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, FileText, Calculator } from "lucide-react";

const products = [
  {
    icon: FileText,
    badge: "Prodotto principale",
    name: "Preventivatore AI",
    tagline: "Dal computo metrico al preventivo in 3 minuti.",
    description:
      "Carica il file del committente. L'AI estrae ogni voce, la abbina ai prezzari regionali (DEI, Regione Lombardia, Sicilia e altri) e genera un preventivo PDF professionale con il tuo logo. Tu rivedi e mandi.",
    features: [
      "Estrazione AI da PDF, Excel e XML",
      "Matching su prezzari regionali e interno aziendale",
      "Analisi Prezzi AI per voci fuori prezzario",
      "PDF e Excel brandizzati",
      "Archivio Storico e riuso preventivi",
    ],
    href: "/preventivatore",
    color: "orange",
  },
  {
    icon: Calculator,
    badge: "Nuovo prodotto",
    name: "Computatore AI",
    tagline: "Genera il computo metrico da zero, in pochi minuti.",
    description:
      "Descrivi il lavoro e carica le foto del sopralluogo. L'AI costruisce l'intero computo metrico. La chat integrata controlla che non manchi nulla. Tu approvi ed esporti — pronto per il Preventivatore.",
    features: [
      "Generazione da descrizione + foto di sopralluogo",
      "Estrazione da capitolati PDF/Excel",
      "Stima quantità dalle piantine architettoniche",
      "Chat AI autocorrettiva integrata",
      "Flusso diretto verso il Preventivatore AI",
    ],
    href: "/computatore",
    color: "navy",
  },
];

export default function Products() {
  return (
    <section id="prodotti" className="section-padding bg-base">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-14">
            <span className="eyebrow text-orange-500">I nostri prodotti</span>
            <h2 className="mt-3 font-display font-extrabold text-navy text-4xl md:text-5xl">
              Due strumenti. Un ecosistema.
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Il Computatore genera il computo. Il Preventivatore lo trasforma in un&apos;offerta commerciale.
              Usali insieme o separatamente.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p, i) => {
            const Icon = p.icon;
            const isOrange = p.color === "orange";
            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl border p-8 flex flex-col h-full transition-shadow hover:shadow-xl ${
                    isOrange
                      ? "bg-white border-orange-100"
                      : "bg-navy text-white border-navy"
                  }`}
                >
                  {/* Badge */}
                  <span
                    className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold mb-6 ${
                      isOrange
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    {p.badge}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isOrange ? "bg-orange-50" : "bg-white/10"
                    }`}
                  >
                    <Icon size={24} className={isOrange ? "text-orange-500" : "text-orange-400"} />
                  </div>

                  <h3
                    className={`font-display font-bold text-2xl mb-2 ${
                      isOrange ? "text-navy" : "text-white"
                    }`}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={`font-semibold mb-3 ${
                      isOrange ? "text-orange-500" : "text-orange-400"
                    }`}
                  >
                    {p.tagline}
                  </p>
                  <p className={`text-sm leading-relaxed mb-6 ${isOrange ? "text-gray-500" : "text-gray-300"}`}>
                    {p.description}
                  </p>

                  <ul className="space-y-2 mb-8 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <svg
                          className={`w-4 h-4 mt-0.5 shrink-0 ${isOrange ? "text-orange-500" : "text-orange-400"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className={isOrange ? "text-gray-600" : "text-gray-300"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={p.href}
                    className={`inline-flex items-center gap-2 font-semibold text-sm transition-colors group ${
                      isOrange ? "text-orange-500 hover:text-orange-600" : "text-orange-400 hover:text-orange-300"
                    }`}
                  >
                    Scopri {p.name}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
