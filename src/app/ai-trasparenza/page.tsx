import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-trasparenza" },
  title: "AI e trasparenza: come la usiamo",
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
              <p>Ultimo aggiornamento: ottobre 2026</p>
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

              {/* Le domande dei clienti su dati e AI (Stilcolor, 05/10/2026): fornitore, addestramento, conservazione,
                  dove lavora. Deve combaciare col contratto di licenza (art. 5.2 e Allegato B). */}
              <h2 id="dati-e-ai" className="font-display font-bold text-navy text-xl mt-8 scroll-mt-24">I tuoi dati e l&apos;AI</h2>
              <p>Vale per il Preventivatore AI, dove carichi computi, preventivi e prezzi della tua impresa.</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Chi fa il lavoro.</strong> I modelli Gemini di Google, ai quali la piattaforma accede tramite Lovable, il fornitore che la ospita. Nessun altro fornitore di intelligenza artificiale riceve i tuoi dati.</li>
                <li><strong>Cosa riceve.</strong> Solo quello che serve all&apos;operazione che avvii: il computo da leggere, la voce da analizzare, la descrizione e le foto da cui creare un preventivo.</li>
                <li><strong>Niente addestramento.</strong> Non usiamo i tuoi dati per addestrare modelli di intelligenza artificiale e non li usiamo per lavorare per altri clienti. Dati anonimi o aggregati li usiamo solo con il tuo consenso scritto, che puoi ritirare quando vuoi.</li>
                <li><strong>Cosa resta.</strong> Nel tuo account restano i tuoi file e i risultati, per esempio le voci del preventivo. Delle richieste all&apos;AI non teniamo copie: per ogni operazione registriamo solo il tipo e i crediti usati. Anche i fornitori non conservano il testo delle richieste dopo la risposta.</li>
                <li><strong>Dove lavora.</strong> Il database e i file stanno nell&apos;Unione Europea, a Francoforte. L&apos;elaborazione con l&apos;AI può avvenire anche fuori dall&apos;UE: in quel caso il trasferimento avviene con le garanzie del GDPR, come le clausole contrattuali tipo della Commissione europea o il Data Privacy Framework UE-USA.</li>
              </ul>
              <p>Per i clienti della piattaforma questi impegni sono scritti nel contratto di licenza: all&apos;articolo 5 e nell&apos;Allegato B, sul trattamento dei dati personali.</p>

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

              {/* Sezione chiesta dallo studio di conformità della redazione (vault: sito-seo/CONFORMITA.md §3.4,
                  AI Act art. 50 e linee guida della Commissione, 02/10/2026). La firma degli articoli porta qui. */}
              <h2 id="notizie" className="font-display font-bold text-navy text-xl mt-8 scroll-mt-24">Le notizie e le guide del sito</h2>
              <p>Gli articoli della sezione Notizie li firma la Redazione Cantieri Hub. Li prepariamo così:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>partiamo solo da atti ufficiali (Gazzetta Ufficiale, ministeri, Agenzia delle Entrate, INPS, INAIL, Regioni…) e li citiamo in fondo a ogni articolo;</li>
                <li>strumenti di intelligenza artificiale ci aiutano a leggere gli atti, a scrivere una prima versione, a controllare ogni dato sulla fonte e a preparare le immagini;</li>
                <li>prima di pubblicare, una persona della Redazione legge l&apos;articolo per intero, controlla i fatti sulle fonti e decide se pubblicarlo, correggerlo o scartarlo. Nessun articolo va online senza questo passaggio;</li>
                <li>le immagini sono generate con l&apos;intelligenza artificiale e lo scriviamo su ognuna. Non ritraggono persone reali, luoghi veri o fatti accaduti;</li>
                <li>non usiamo mai i dati dei clienti di Cantieri Hub, né quello che ci raccontano, per scrivere gli articoli;</li>
                <li>gli articoli spiegano le norme in generale e non sono una consulenza sul tuo caso: per quella rivolgiti al tuo commercialista, al consulente del lavoro o a un avvocato.</li>
              </ul>
              <p>La sezione Notizie è lo spazio informativo di un&apos;azienda di software, non una testata giornalistica.</p>
              <p>
                <strong>Responsabilità editoriale:</strong> Cantieri Hub. Contatti:{" "}
                <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.{" "}
                <strong>Hai visto un errore?</strong> Scrivici: lo correggiamo e in cima all&apos;articolo trovi la data e cosa è cambiato.
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
