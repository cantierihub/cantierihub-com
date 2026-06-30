import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import {
  Shield,
  Lock,
  Server,
  Database,
  FileKey,
  RefreshCw,
  Check,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sicurezza dei dati — I tuoi prezzari e preventivi al sicuro",
  description:
    "Come Cantieri Hub protegge i tuoi dati: isolamento per azienda, crittografia in transito e a riposo, hosting europeo conforme GDPR e backup automatici.",
  alternates: { canonical: "/sicurezza" },
};

const garanzie = [
  {
    icon: Shield,
    titolo: "I tuoi dati restano tuoi",
    desc:
      "Ogni azienda è isolata dalle altre a livello di database (Row Level Security). Nessun altro cliente può vedere, leggere o toccare i tuoi dati: la separazione è imposta dal sistema, non dalla buona volontà.",
  },
  {
    icon: Lock,
    titolo: "Crittografia in transito e a riposo",
    desc:
      "Tutto quello che passa tra il tuo computer e Cantieri Hub viaggia cifrato (HTTPS/TLS). E i dati restano cifrati anche quando sono fermi sui server. Chi non ha le chiavi non legge niente.",
  },
  {
    icon: Server,
    titolo: "Server in Europa, conformi GDPR",
    desc:
      "L'infrastruttura è ospitata su data center europei e gestita nel rispetto del GDPR. I tuoi dati non finiscono in giro per il mondo: restano dove la legge italiana ed europea li tutela.",
  },
  {
    icon: FileKey,
    titolo: "Prezzari e preventivi privati",
    desc:
      "I tuoi prezzi, i tuoi listini, lo storico dei preventivi: sono il cuore della tua azienda. Restano riservati al tuo account e non vengono mai condivisi né usati per altri.",
  },
  {
    icon: Database,
    titolo: "Accesso solo a chi autorizzi tu",
    desc:
      "Entri con le tue credenziali e vedi solo il tuo spazio di lavoro. Nessun accesso incrociato tra aziende, nessuna porta lasciata aperta: l'isolamento vale a ogni richiesta.",
  },
  {
    icon: RefreshCw,
    titolo: "Backup automatici",
    desc:
      "I tuoi dati vengono salvati con backup regolari. Se succede qualcosa — un errore, un imprevisto — il lavoro non va perso: si recupera.",
  },
];

const garanzieRapide = [
  "Un'azienda non vede mai i dati di un'altra",
  "Dati cifrati mentre viaggiano e mentre sono fermi",
  "Server europei, gestiti secondo il GDPR",
  "Backup regolari: il tuo lavoro non si perde",
];

export default function SicurezzaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-10 md:pt-24 md:pb-20 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Sicurezza e privacy
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-5 font-display font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
              >
                I tuoi dati. <span className="text-orange-400">Al sicuro.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-2xl">
                I tuoi prezzi, i tuoi preventivi, lo storico dei tuoi cantieri: è il patrimonio
                della tua impresa. Lo trattiamo come tale.{" "}
                <strong className="text-white">
                  Isolato, cifrato, ospitato in Europa e salvato di continuo.
                </strong>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Le garanzie */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow text-orange-500">Come proteggiamo i tuoi dati</span>
              <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                Niente promesse vaghe. Misure concrete.
              </h2>
              <p className="mt-4 text-navy-500 leading-relaxed">
                Ogni punto qui sotto è un meccanismo reale che gira sotto il cofano di Cantieri Hub,
                ogni giorno, senza che tu debba pensarci.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {garanzie.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.titolo} delay={i * 0.06}>
                  <div className="h-full flex items-start gap-5 p-5 md:p-6 rounded-xl bg-white border border-gray-200 feature-card">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{g.titolo}</h3>
                      <p className="mt-1 text-sm text-navy-500 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Isolamento per azienda — focus */}
      <section style={{ background: "#f8fafc" }} className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="eyebrow text-orange-500">Il punto che conta di più</span>
                <h2 className="mt-3 font-display font-extrabold text-navy text-3xl md:text-4xl leading-tight">
                  Nessun altro cliente accede ai tuoi dati.
                </h2>
                <p className="mt-5 text-navy-500 leading-relaxed">
                  Cantieri Hub usa un sistema di isolamento a livello di database: ogni richiesta è
                  filtrata in automatico sulla tua azienda. È la stessa logica con cui una banca tiene
                  separati i conti dei clienti: <strong className="text-navy">i tuoi dati sono in una
                  stanza chiusa a chiave, e la chiave ce l&apos;hai solo tu.</strong>
                </p>
                <div className="mt-7">
                  <a
                    href="/note-legali"
                    className="inline-flex items-center gap-2 text-orange-500 font-semibold"
                  >
                    Privacy e trattamento dei dati
                    <ArrowRight size={18} className="arrow" />
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="rounded-2xl bg-navy text-white p-7 md:p-9">
                <p className="eyebrow text-orange-400">In sintesi</p>
                <h3 className="mt-3 font-display font-bold text-2xl">Le garanzie, in una riga.</h3>
                <ul className="mt-6 space-y-4">
                  {garanzieRapide.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                        <Check size={13} className="text-orange-400" />
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

      <CTASection
        title="Domande sulla sicurezza dei tuoi dati?"
        subtitle="Scrivici su WhatsApp: ti spieghiamo nel dettaglio come proteggiamo prezzari e preventivi della tua azienda."
        primaryLabel="Parlane con noi"
        whatsappText="Ciao! Vorrei capire come Cantieri Hub protegge i dati della mia azienda."
      />
    </>
  );
}
