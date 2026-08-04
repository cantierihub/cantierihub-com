import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-trasparenza" },
  title: "AI e Trasparenza · Cantieri Hub",
  description:
    "Dove Cantieri Hub usa l'intelligenza artificiale, cosa comporta per il tuo lavoro e come restano il controllo e la responsabilità professionale.",
};

export default function AiTrasparenzaPage() {
  return (
    <section className="pt-12 pb-8 md:pt-24 md:pb-16 bg-white">
      <div className="container-main">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow text-orange-500">Trasparenza</span>
            <h1 className="mt-3 font-display font-extrabold text-navy text-4xl mb-8">AI e Trasparenza</h1>
            <div className="prose prose-sm text-gray-600 space-y-6">
              <p>Ultimo aggiornamento: agosto 2026</p>
              <p>
                I prodotti Cantieri Hub usano l&apos;intelligenza artificiale. Riteniamo giusto dirti dove la usiamo,
                cosa comporta per il tuo lavoro e dove resta la tua responsabilità professionale.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Dove usiamo l&apos;intelligenza artificiale</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Preventivatore AI</strong> — genera il preventivo a partire dal computo metrico</li>
                <li><strong>Computatore AI</strong> — genera il computo metrico da foto e descrizioni del sopralluogo</li>
                <li><strong>Analisi Prezzi AI</strong> — ricostruisce e confronta i prezzi unitari delle lavorazioni</li>
                <li><strong>EdilChat</strong> — assistente conversazionale su normative e pratiche di settore</li>
                <li><strong>Comunicazione</strong> — parte dei contenuti che pubblichiamo (video, immagini, voce) è realizzata con strumenti di AI generativa</li>
              </ul>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Cosa comporta per te</h2>
              <p>
                I documenti prodotti dai nostri strumenti sono <strong>una base di lavoro, non un elaborato definitivo</strong>.
                Voci, quantità e prezzi vanno sempre verificati e validati da un tecnico qualificato prima di essere
                utilizzati per offerte, contratti o gare d&apos;appalto.
              </p>
              <p>L&apos;intelligenza artificiale accelera il lavoro. Non sostituisce la tua responsabilità professionale.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Il controllo resta tuo</h2>
              <p>
                Ogni risultato generato è rivedibile e modificabile prima dell&apos;esportazione. Sei tu a decidere cosa
                esce dal tuo studio e con quale firma.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Quando parli con un&apos;AI</h2>
              <p>
                Dove un nostro strumento risponde tramite intelligenza artificiale te lo diciamo apertamente. In ogni
                conversazione di EdilChat è fissato l&apos;avviso <em>&laquo;EdilChat può sbagliare. Verifica sempre con
                un tecnico abilitato&raquo;</em>: le risposte vanno controllate prima di essere usate in un progetto o
                in una gara.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Contenuti generati con AI</h2>
              <p>
                Quando in un contenuto che pubblichiamo usiamo una voce sintetica o immagini generate
                dall&apos;intelligenza artificiale, lo dichiariamo apertamente.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Domande</h2>
              <p>
                Per qualsiasi chiarimento su come usiamo l&apos;intelligenza artificiale scrivi a{" "}
                <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
