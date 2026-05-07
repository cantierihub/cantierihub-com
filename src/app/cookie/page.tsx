import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Cookie Policy — Cantieri Hub",
  description: "Informativa sull'uso dei cookie su Cantieri Hub.",
};

export default function CookiePage() {
  return (
    <section className="pt-28 pb-20 bg-white">
      <div className="container-main">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow text-orange-500">Legale</span>
            <h1 className="mt-3 font-display font-extrabold text-navy text-4xl mb-8">Cookie Policy</h1>
            <div className="prose prose-sm text-gray-600 space-y-6">
              <p>Ultimo aggiornamento: maggio 2026</p>
              <p>
                Questo sito utilizza cookie e tecnologie simili per garantire il corretto funzionamento, analizzare il traffico e personalizzare i contenuti.
              </p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Tipi di cookie</h2>
              <div className="space-y-4">
                {[
                  { tipo: "Cookie tecnici", desc: "Necessari per il funzionamento del sito (es. preferenze cookie). Non richiedono consenso.", esempio: "ch-cookies-accepted" },
                  { tipo: "Cookie analytics", desc: "Raccolgono dati aggregati sull'utilizzo del sito (es. Google Analytics). Richiedono consenso.", esempio: "Google Analytics (_ga, _gid)" },
                  { tipo: "Cookie di marketing", desc: "Utilizzati per attività pubblicitarie e retargeting (es. Meta Pixel, TikTok Pixel). Richiedono consenso.", esempio: "fbq, ttq" },
                ].map((c) => (
                  <div key={c.tipo} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-navy mb-1">{c.tipo}</p>
                    <p className="text-sm mb-1">{c.desc}</p>
                    <p className="text-xs text-gray-400">Esempi: {c.esempio}</p>
                  </div>
                ))}
              </div>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Come gestire i cookie</h2>
              <p>
                Puoi revocare il consenso in qualsiasi momento tramite le impostazioni del browser o cliccando nuovamente sul banner cookie. Per maggiori informazioni consulta la nostra{" "}
                <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>.
              </p>
              <p>
                Per contatti: <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}