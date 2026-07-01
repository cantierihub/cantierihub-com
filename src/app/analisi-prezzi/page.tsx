import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import {
  Package,
  Users,
  Truck,
  Briefcase,
  ShieldCheck,
  Layers,
  Building2,
  Gauge,
  MapPin,
  Zap,
  SlidersHorizontal,
  ArrowRight,
  Check,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analisi Prezzi AI — La scomposizione costi di qualsiasi voce",
  description:
    "Genera la scomposizione di costo di qualsiasi voce d'opera: materiali, manodopera, noli, spese generali e sicurezza. Editabile, ricalcolata live, esportabile.",
  openGraph: {
    title: "Analisi Prezzi AI — La scomposizione costi di qualsiasi voce",
    description:
      "Genera la scomposizione di costo di qualsiasi voce d'opera: materiali, manodopera, noli, spese generali e sicurezza. Editabile, ricalcolata live, esportabile.",
    url: "https://cantierihub.com/analisi-prezzi",
    type: "website",
  },
  // Pagina riservata: niente menu, niente indicizzazione.
  robots: { index: false, follow: false },
};

const componenti = [
  {
    icon: Package,
    nome: "Materiali",
    desc: "Costo dei materiali della lavorazione, con quantità e incidenza realistiche per la voce.",
  },
  {
    icon: Users,
    nome: "Manodopera",
    desc: "Ore e costo orario della manodopera necessaria, calibrati sul tipo di intervento.",
  },
  {
    icon: Truck,
    nome: "Noli e attrezzature",
    desc: "Mezzi, ponteggi e attrezzature di cantiere, con la quota di utile d'impresa.",
  },
  {
    icon: Briefcase,
    nome: "Spese generali",
    desc: "La quota di spese generali aziendali ribaltata sulla singola voce.",
  },
  {
    icon: ShieldCheck,
    nome: "Sicurezza",
    desc: "Gli oneri della sicurezza, esposti separatamente come richiede il computo.",
  },
];

const parametri = [
  { icon: Layers, label: "Tipo di lavorazione", value: "Solo posa · Fornitura e posa · Subappalto" },
  { icon: Building2, label: "Dimensione cantiere", value: "Dal piccolo intervento alla grande opera" },
  { icon: Gauge, label: "Piano e accessibilità", value: "Quota di lavoro e difficoltà logistica" },
  { icon: MapPin, label: "Distanza", value: "Logistica e trasporto verso il cantiere" },
  { icon: Zap, label: "Urgenza", value: "Tempi stretti riflessi nel costo" },
  { icon: SlidersHorizontal, label: "Raffinatura", value: "Affini il risultato finché non torna" },
];

const faq = [
  {
    q: "Funziona anche sulle voci che non trovo nei prezzari?",
    a: "È esattamente il caso d'uso principale. Quando una voce non esiste sul prezzario regionale, l'Analisi Prezzi AI la ricostruisce da zero scomponendo materiali, manodopera, noli, spese generali e sicurezza, con un ragionamento esplicito che puoi verificare.",
  },
  {
    q: "Il risultato è modificabile?",
    a: "Sì. Ogni componente del prezzo è editabile e il totale si ricalcola in tempo reale. L'AI propone una base attendibile, tu hai sempre l'ultima parola.",
  },
  {
    q: "Posso analizzare tante voci insieme?",
    a: "Sì. Oltre alla modalità singola (voce per voce) c'è la modalità batch, che analizza interi blocchi di voci in un colpo solo.",
  },
  {
    q: "Posso esportare l'analisi per il cliente?",
    a: "Sì. Il risultato si esporta in PDF ed Excel con il logo e i colori della tua azienda, pronto da allegare al preventivo.",
  },
];

export default function AnalisiPrezziPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Il motore dietro ogni preventivo
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                La scomposizione di costo di qualsiasi voce.{" "}
                <span className="text-orange-400">In pochi secondi.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Dai all&apos;AI una lavorazione e ti restituisce il prezzo costruito pezzo per pezzo —
                materiali, manodopera, noli, spese generali, sicurezza — con un ragionamento che puoi
                leggere, modificare e firmare. <strong className="text-white">Niente più voci stimate a occhio.</strong>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Il problema */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="eyebrow text-orange-500">Il problema</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  Le voci fuori prezzario ti rubano mezza giornata.
                </h2>
                <p className="mt-5 text-gray-500 leading-relaxed">
                  Quando una lavorazione non c&apos;è sul prezzario regionale, parte la ricerca: telefonate
                  ai fornitori, vecchi preventivi da spulciare, stime fatte a sensazione. Ore di lavoro per
                  un solo numero — che poi rischi di sbagliare in difetto e di lavorare in perdita.
                </p>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-9">
                <p className="font-display font-bold text-navy text-lg mb-5">Senza Analisi Prezzi AI</p>
                <ul className="space-y-3.5 text-sm text-gray-600">
                  <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">—</span> Cerchi il prezzo su tre fonti diverse e non combaciano</li>
                  <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">—</span> Stimi a memoria e speri di non rimetterci</li>
                  <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">—</span> Non sai spiegare al cliente come hai fatto quel numero</li>
                  <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">—</span> Ogni voce nuova riparte da zero, ogni volta</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa scompone */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Come costruisce il prezzo</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Cinque componenti, come li scomporresti tu.
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                L&apos;AI non sputa un numero: lo costruisce voce per voce, esattamente come farebbe un
                computista esperto. E ti mostra ogni passaggio.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3.5">
            {componenti.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.nome} delay={i * 0.06}>
                  <div className="flex items-start gap-5 p-5 md:p-6 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{c.nome}</h3>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parametri reali */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Calibrata sul cantiere vero</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Lo stesso lavoro non costa uguale ovunque.
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Imposti i parametri reali dell&apos;intervento e il prezzo si adatta. Perché posare in un
                attico al sesto piano senza ascensore non è come posare a piano terra.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parametri.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.label} delay={i * 0.05}>
                  <div className="h-full p-5 rounded-xl border border-gray-200 bg-gray-50">
                    <Icon size={20} className="text-navy-600" />
                    <p className="mt-3 font-display font-bold text-navy">{p.label}</p>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{p.value}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Singola vs Batch + Risultato */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-navy text-white">
                <p className="eyebrow text-orange-400">Due modalità</p>
                <h3 className="mt-3 font-display font-bold text-2xl">Una voce o cento.</h3>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  <strong className="text-white">Singola</strong> — analizzi la voce critica, quella fuori
                  prezzario, in pochi secondi.
                </p>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  <strong className="text-white">Batch</strong> — analizzi interi blocchi di voci in un colpo
                  solo, quando devi prezzare un computo intero.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full p-7 md:p-9 rounded-2xl bg-white border border-gray-200">
                <p className="eyebrow text-orange-500">Il risultato</p>
                <h3 className="mt-3 font-display font-bold text-navy text-2xl">Tuo, non dell&apos;AI.</h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "Ogni componente è editabile",
                    "Il totale si ricalcola in tempo reale",
                    "Esporti in PDF ed Excel con il tuo logo e i tuoi colori",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                        <Check size={13} className="text-orange-500" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Perché è diverso */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Nessun altro software edile lo fa a questo livello.
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed text-lg">
                La scomposizione di costo contestuale — attendibile, ragionata, calibrata sul cantiere reale —
                è il cuore di Cantieri Hub. È la differenza tra un software che archivia prezzi e uno che
                ti aiuta davvero a fare il prezzo giusto.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-orange-500 font-semibold">
                Disponibile dentro la piattaforma Cantieri Hub
                <ArrowRight size={18} className="arrow" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faq}
        title="Domande sull'Analisi Prezzi"
        subtitle="Quello che chiedono prima di provarla."
        showCTA={false}
      />

      <CTASection
        title="Vuoi vederla sui tuoi computi?"
        subtitle="Richiedi una demo: ti mostriamo l'Analisi Prezzi sulle tue voci reali, dal vivo."
        primaryLabel="Richiedi una demo"
      />
    </>
  );
}
