"use client";

import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import { MessageCircle, Calendar, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

const contactOptions = [
  {
    icon: Calendar,
    title: "Prenota una Demo",
    description: "30 minuti con un consulente. Vedi il prodotto con i tuoi file reali. Nessun impegno.",
    cta: "Prenota su Calendly",
    href: "#",
    primary: true,
  },
  {
    icon: MessageCircle,
    title: "Scrivici su WhatsApp",
    description: "Risposta diretta. Nessun chatbot, nessun ticket. Un essere umano che conosce il prodotto.",
    cta: "Apri WhatsApp",
    href: "#",
    primary: false,
  },
  {
    icon: Mail,
    title: "Manda una email",
    description: "Per richieste formali o partnership. Risposta entro 24 ore.",
    cta: "info@cantierihub.com",
    href: "mailto:info@cantierihub.com",
    primary: false,
  },
];

export default function ContattiPage() {
  const [form, setForm] = useState({ nome: "", azienda: "", telefono: "", messaggio: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
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
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                La demo è gratuita. In 30 minuti vedi come funziona con i tuoi file reali. Nessun obbligo.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {contactOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <Reveal key={opt.title} delay={i * 0.1}>
                  <div className={`p-6 rounded-2xl border flex flex-col h-full ${opt.primary ? "bg-navy border-navy text-white" : "bg-gray-50 border-gray-200"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${opt.primary ? "bg-white/10" : "bg-orange-100"}`}>
                      <Icon size={20} className={opt.primary ? "text-orange-400" : "text-orange-500"} />
                    </div>
                    <h3 className={`font-display font-bold text-lg mb-2 ${opt.primary ? "text-white" : "text-navy"}`}>{opt.title}</h3>
                    <p className={`text-sm leading-relaxed mb-5 flex-1 ${opt.primary ? "text-gray-300" : "text-gray-500"}`}>{opt.description}</p>
                    <a
                      href={opt.href}
                      className={`inline-flex items-center gap-2 text-sm font-semibold group transition-colors ${opt.primary ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"}`}
                    >
                      {opt.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Form */}
          <Reveal delay={0.2}>
            <div className="max-w-xl mx-auto">
              <h2 className="font-display font-bold text-navy text-2xl mb-6 text-center">
                O lasciaci un messaggio
              </h2>
              {sent ? (
                <div className="text-center py-12 px-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-navy text-xl mb-2">Messaggio ricevuto!</h3>
                  <p className="text-gray-500 text-sm">Ti ricontattiamo entro 24 ore.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { id: "nome", label: "Nome e Cognome", type: "text", placeholder: "Mario Rossi", required: true },
                    { id: "azienda", label: "Azienda", type: "text", placeholder: "Impresa Rossi Costruzioni", required: true },
                    { id: "telefono", label: "Telefono", type: "tel", placeholder: "+39 333 000 0000", required: false },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-navy mb-1.5">
                        {field.label} {field.required && <span className="text-orange-500">*</span>}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors bg-white"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="messaggio" className="block text-sm font-medium text-navy mb-1.5">
                      Messaggio <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      id="messaggio"
                      rows={4}
                      placeholder="Descrivici brevemente come lavori e cosa stai cercando..."
                      required
                      value={form.messaggio}
                      onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors bg-white resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="cta-shimmer w-full py-3.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                  >
                    Invia messaggio →
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Inviando accetti la nostra{" "}
                    <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}