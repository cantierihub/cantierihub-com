"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
}

const defaultFAQs: FAQItem[] = [
  {
    q: "Devo installare qualcosa?",
    a: "No. Cantieri Hub è un software cloud. Basta un browser e una connessione internet — funziona su PC, Mac e tablet.",
  },
  {
    q: "Quali formati di file posso caricare?",
    a: "PDF, Excel (.xlsx, .xls) e XML (formato PriMus). Il sistema gestisce anche documenti scansionati con qualità sufficiente.",
  },
  {
    q: "I prezzari regionali sono inclusi?",
    a: "Sì. Sono inclusi i principali prezzari regionali italiani (DEI, Regione Lombardia, Sicilia e altri) e puoi importare il tuo prezzario aziendale personalizzato.",
  },
  {
    q: "I miei dati aziendali sono al sicuro?",
    a: "I dati sono isolati per azienda (nessun altro cliente può vederli) e ospitati su Supabase con crittografia. Rispettiamo il GDPR.",
  },
  {
    q: "Come funziona il supporto?",
    a: "Ogni cliente ha un referente diretto raggiungibile via WhatsApp e videochiamata. Non esistono ticket anonimi — parli con una persona.",
  },
  {
    q: "Quanto costa?",
    a: "Il prezzo non è pubblico — viene comunicato durante la demo, su misura per la tua impresa. Prenota una chiamata gratuita per scoprirlo.",
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-5 text-left gap-4 group"
      >
        <span className={`font-display font-semibold text-base transition-colors ${isOpen ? "text-orange-500" : "text-navy group-hover:text-orange-500"}`}>
          {item.q}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-500"}`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection({
  items = defaultFAQs,
  title = "Domande frequenti",
  subtitle = "Tutto quello che vuoi sapere prima di prenotare una demo.",
  showCTA = true,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-12">
            <span className="eyebrow text-orange-500">FAQ</span>
            <h2 className="mt-3 font-display font-extrabold text-navy text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">{subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl border border-gray-200 px-6">
            {items.map((item, i) => (
              <FAQAccordionItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>

        {showCTA && (
          <Reveal delay={0.2}>
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-4">Non hai trovato risposta? Parliamo direttamente.</p>
              <Link
                href="/contatti"
                className="cta-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Prenota una Demo →
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}