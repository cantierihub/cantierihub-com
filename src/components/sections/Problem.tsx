import Reveal from "@/components/ui/Reveal";
import { Clock, AlertTriangle, TrendingDown, FileX } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Ore perse ogni settimana",
    description: "Ridigitare voci da PDF cartacei, cercare codici sui prezzari, riformattare documenti. Ore di lavoro tecnico che non produce nulla.",
  },
  {
    icon: AlertTriangle,
    title: "Errori di trascrizione",
    description: "Copiare centinaia di voci a mano significa inevitabilmente sbagliare. Un errore in un preventivo può costare margine o clienti.",
  },
  {
    icon: TrendingDown,
    title: "Margini che si assottigliano",
    description: "Chi non stima bene le voci fuori prezzario lascia soldi sul tavolo. Ogni preventivo impreciso è un'opportunità mancata.",
  },
  {
    icon: FileX,
    title: "Documenti non professionali",
    description: "Excel con formattazioni diverse, PDF copiati da modelli vecchi. Il documento che arriva al cliente non rappresenta la qualità del tuo lavoro.",
  },
];

export default function Problem() {
  return (
    <section className="section-padding bg-navy">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-14">
            <span className="eyebrow text-orange-400">Il problema</span>
            <h2 className="mt-3 font-display font-extrabold text-white text-4xl md:text-5xl">
              Ogni preventivo ti costa{" "}
              <span className="text-orange-400">ore.</span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              E ogni ora persa è margine che sparisce. Non è un problema di capacità — è che gli strumenti che usi non sono pensati per l&apos;edilizia italiana di oggi.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {problems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.09}>
                <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Icon size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-10 text-center">
            <p className="text-gray-300 text-lg">
              Cantieri Hub risolve tutto questo.{" "}
              <span className="text-orange-400 font-semibold">In 3 minuti per preventivo.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}