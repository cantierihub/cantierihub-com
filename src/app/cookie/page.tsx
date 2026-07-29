import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/cookie" },
  title: "Cookie Policy · Cantieri Hub",
  description: "Informativa sull'uso dei cookie su Cantieri Hub.",
};

export default function CookiePage() {
  return (
    <section className="pt-12 pb-8 md:pt-24 md:pb-16 bg-white">
      <div className="container-main">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow text-orange-500">Legale</span>
            <h1 className="mt-3 font-display font-extrabold text-navy text-4xl mb-8">Cookie Policy</h1>
            <div className="prose prose-sm text-gray-600 space-y-6">
              <p>Ultimo aggiornamento: luglio 2026</p>
              <p>
                Questo sito è volutamente leggero: <strong>non usa cookie di profilazione e non traccia le persone su altri siti</strong>. Qui sotto trovi esattamente cosa viene salvato e perché.
              </p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Cosa salviamo davvero</h2>
              <div className="space-y-4">
                {[
                  { tipo: "Memoria tecnica del browser", desc: "Serve al funzionamento del sito. Ricorda che hai già visto l'avviso cookie e, per la sola durata della scheda, da quale canale sei arrivato, così sappiamo a cosa attribuire un messaggio che ci invii. Non richiede consenso e non contiene dati personali.", esempio: "ch-cookies-accepted, ch-provenienza" },
                  { tipo: "Statistiche di traffico senza cookie", desc: "Conteggi aggregati delle visite (pagine viste, provenienza, tipo di dispositivo) tramite Vercel Web Analytics. Non installa cookie, non crea profili e non identifica le singole persone.", esempio: "Vercel Web Analytics" },
                  { tipo: "Cookie di marketing e retargeting", desc: "Al momento NON ne usiamo: nessun Meta Pixel, nessun TikTok Pixel, nessun Google Analytics. Se in futuro dovessimo introdurli, questa pagina verrà aggiornata e il consenso ti sarà chiesto prima dell'attivazione.", esempio: "nessuno attivo" },
                ].map((c) => (
                  <div key={c.tipo} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-navy mb-1">{c.tipo}</p>
                    <p className="text-sm mb-1">{c.desc}</p>
                    <p className="text-xs text-gray-400">Esempi: {c.esempio}</p>
                  </div>
                ))}
              </div>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Come cancellare quello che è stato salvato</h2>
              <p>
                Puoi svuotare in qualsiasi momento la memoria del sito dalle impostazioni del browser, alla voce dati dei siti o cronologia. Chiudendo la scheda, il dato sulla provenienza si cancella da solo. Per maggiori informazioni consulta la nostra{" "}
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