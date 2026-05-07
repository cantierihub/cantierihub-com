import Reveal from "@/components/ui/Reveal";

const testimonials = [
  {
    quote:
      "Prima mi ci voleva mezza giornata per fare un preventivo da un computo metrico. Adesso lo faccio in 10 minuti, PDF incluso. Non tornerei indietro.",
    author: "Marco R.",
    role: "Titolare, impresa edile — Milano",
  },
  {
    quote:
      "Il WOW moment vero è stato quando ha letto il mio computo da 200 voci e me lo ha abbinato al prezzario in 2 minuti. Roba che prima facevo a mano in 3 ore.",
    author: "Giuseppe L.",
    role: "Geometra — Napoli",
  },
  {
    quote:
      "Finalmente un software edile che capisce come lavoriamo. Semplice, in italiano, e supporto su WhatsApp. Nessun altro lo fa.",
    author: "Antonio M.",
    role: "Titolare, impresa di ristrutturazioni — Roma",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-base">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-14">
            <span className="eyebrow text-orange-500">Cosa dicono i clienti</span>
            <h2 className="mt-3 font-display font-extrabold text-navy text-4xl md:text-5xl">
              Chi l&apos;ha provato non torna indietro.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.1}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 text-sm leading-relaxed flex-1">
                  &quot;{t.quote}&quot;
                </blockquote>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.author}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}