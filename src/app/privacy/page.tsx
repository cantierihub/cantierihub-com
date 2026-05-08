import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy — Cantieri Hub",
  description: "Informativa sul trattamento dei dati personali di Cantieri Hub.",
};

export default function PrivacyPage() {
  return (
    <section className="pt-12 pb-8 md:pt-24 md:pb-16 bg-white">
      <div className="container-main">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <span className="eyebrow text-orange-500">Legale</span>
            <h1 className="mt-3 font-display font-extrabold text-navy text-4xl mb-8">Privacy Policy</h1>
            <div className="prose prose-sm text-gray-600 space-y-6">
              <p>Ultimo aggiornamento: maggio 2026</p>
              <p>
                Cantieri Hub è il titolare del trattamento dei dati personali raccolti tramite il sito cantierihub.com e la piattaforma SaaS.
              </p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Dati raccolti</h2>
              <p>Raccogliamo i dati che fornisci volontariamente (nome, email, azienda, telefono) tramite i form di contatto, e dati tecnici di navigazione (indirizzo IP, browser, pagine visitate) tramite cookie e strumenti di analytics.</p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Finalità del trattamento</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rispondere alle tue richieste di informazioni o demo</li>
                <li>Gestire il rapporto contrattuale con i clienti della piattaforma</li>
                <li>Migliorare il servizio tramite analytics aggregati</li>
                <li>Inviare comunicazioni di marketing (solo con consenso esplicito)</li>
              </ul>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Base giuridica</h2>
              <p>Il trattamento si basa sul consenso dell'interessato, sull'esecuzione del contratto o sul legittimo interesse del titolare, a seconda della finalità.</p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Conservazione</h2>
              <p>I dati sono conservati per il tempo necessario alle finalità indicate, o per gli obblighi di legge applicabili.</p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Diritti dell'interessato</h2>
              <p>Hai diritto di accedere, rettificare, cancellare o limitare il trattamento dei tuoi dati. Per esercitare questi diritti scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.</p>
              <h2 className="font-display font-bold text-navy text-xl mt-8">Cookie</h2>
              <p>Per informazioni dettagliate sull'uso dei cookie, consulta la nostra <a href="/cookie" className="text-orange-500 hover:underline">Cookie Policy</a>.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}