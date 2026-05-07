import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Carica il documento",
    description:
      "Carica il computo metrico che ti ha mandato il committente: PDF, Excel o XML. Il Computatore AI parte da zero se non hai nessun documento.",
  },
  {
    number: "02",
    title: "L'AI elabora tutto",
    description:
      "Estrae le voci, le abbina ai prezzari regionali, calcola le quantità dalle piantine. La chat integrata controlla che non manchi nulla.",
  },
  {
    number: "03",
    title: "Scarica il preventivo",
    description:
      "Genera il PDF professionale con il tuo logo e i tuoi colori aziendali. Pronto da inviare al cliente. In meno di 3 minuti.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-14">
            <span className="eyebrow text-orange-500">Come funziona</span>
            <h2 className="mt-3 font-display font-extrabold text-navy text-4xl md:text-5xl">
              3 passi. Niente di più.
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Nessuna formazione tecnica richiesta. Funziona per qualsiasi impresa edile, dalla piccola ditta al gruppo strutturato.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Linea connettore desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.12}>
                <div className="relative text-center p-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 mb-5">
                    <span className="font-display font-extrabold text-3xl text-orange-500">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}