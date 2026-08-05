import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import { Calendar, Mail, ArrowRight } from "lucide-react";
import ContattiForm from "./ContattiForm";
import LinkWhatsApp from "@/components/ui/LinkWhatsApp";
import { WA_DEMO, CONTACT_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Contatti · Prenota una demo gratuita",
  description:
    "Parla con Cantieri Hub: prenota una demo gratuita di 30 minuti su WhatsApp, scrivici o mandaci una email. Ti rispondiamo entro 24 ore.",
  alternates: { canonical: "/contatti" },
  openGraph: {
    title: "Contatti · Prenota una demo gratuita",
    description:
      "Parla con Cantieri Hub: prenota una demo gratuita di 30 minuti su WhatsApp, scrivici o mandaci una email. Ti rispondiamo entro 24 ore.",
    url: "https://cantierihub.com/contatti",
    type: "website",
  },
};

const contactOptions = [
  {
    icon: Calendar,
    title: "Prenota una Demo",
    description: "30 minuti con un consulente. Vedi il prodotto con i tuoi file reali. Nessun impegno.",
    cta: "Scrivici su WhatsApp",
    href: WA_DEMO,
    external: true,
    primary: true,
    // Il link vero lo costruisce LinkWhatsApp al volo, col canale dentro il messaggio.
    whatsapp: true,
  },
  // Il riquadro "Scrivici su WhatsApp" separato e' stato tolto il 28/07/2026 (scelta di
  // Chiara). Resta questa scheda, ed e' quella che conta: dal 05/08/2026 i pulsanti
  // "Prenota una Demo" di home e barra in alto atterrano qui, dove la persona sceglie
  // fra modulo (entra nel CRM) e WhatsApp (piu' veloce, ma cieco).
  {
    icon: Mail,
    title: "Manda una email",
    description: "Per richieste formali o partnership. Risposta entro 24 ore.",
    cta: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    primary: false,
    whatsapp: false,
  },
];

export default function ContattiPage() {
  return (
    <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 bg-white overflow-hidden">
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.065) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, right: -60, width: 480, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)", filter: "blur(48px)", pointerEvents: "none" }} />
      <div className="container-main relative z-10">
        <Reveal>
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="pill">
              <span className="pill__dot" />
              Demo gratuita
            </span>
            <h1 className="mt-5 font-display font-extrabold text-navy text-4xl md:text-5xl leading-tight">
              Parliamoci.
            </h1>
            <p className="mt-4 text-lg text-navy-500 leading-relaxed">
              La demo è gratuita. In 30 minuti vedi come funziona con i tuoi file reali. Nessun obbligo.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 mb-16 max-w-3xl">
          {contactOptions.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <Reveal key={opt.title} delay={i * 0.1}>
                <div className={`p-6 rounded-2xl border flex flex-col h-full ${opt.primary ? "bg-navy border-navy text-white" : "bg-gray-50 border-gray-200"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${opt.primary ? "bg-white/10" : "bg-orange-100"}`}>
                    <Icon size={20} className={opt.primary ? "text-orange-400" : "text-orange-500"} />
                  </div>
                  <h3 className={`font-display font-bold text-lg mb-2 ${opt.primary ? "text-white" : "text-navy"}`}>{opt.title}</h3>
                  <p className={`text-sm leading-relaxed mb-5 flex-1 ${opt.primary ? "text-gray-300" : "text-navy-500"}`}>{opt.description}</p>
                  {/* Il riquadro WhatsApp usa un link che si porta dietro il canale: chi
                      sceglie la chat invece del modulo non lascia niente nel CRM, e almeno
                      il setter legge da dove arriva nella prima riga del messaggio. */}
                  {opt.whatsapp ? (
                    <LinkWhatsApp
                      richiesta="prenotare una demo gratuita di Cantieri Hub"
                      className="inline-flex items-center gap-2 text-sm font-semibold group transition-colors text-orange-400 hover:text-orange-300"
                    >
                      {opt.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </LinkWhatsApp>
                  ) : (
                    <a
                      href={opt.href}
                      {...(opt.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`inline-flex items-center gap-2 text-sm font-semibold group transition-colors ${opt.primary ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"}`}
                    >
                      {opt.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="max-w-xl mx-auto">
            <h2 className="font-display font-bold text-navy text-2xl mb-6 text-center">
              Compila il modulo per essere ricontattato
            </h2>
            <ContattiForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
