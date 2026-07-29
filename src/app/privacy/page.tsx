import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy · Cantieri Hub",
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
              <p>Ultimo aggiornamento: luglio 2026</p>
              <p>
                Cantieri Hub è il titolare del trattamento dei dati personali raccolti tramite il sito cantierihub.com e la piattaforma SaaS.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Dati raccolti</h2>
              <p>Raccogliamo soltanto quello che serve, e solo quando sei tu a darcelo:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Form di contatto:</strong> nome, email, azienda, telefono e il testo del messaggio.</li>
                <li><strong>Guide gratuite:</strong> l&apos;indirizzo email e quale guida hai richiesto.</li>
                <li><strong>Candidature:</strong> nome, email, telefono, ruolo, messaggio e il curriculum che alleghi.</li>
                <li><strong>Provenienza:</strong> da quale canale sei arrivato sul sito (per esempio un link con etichetta da un social). Serve a capire quali contenuti funzionano, viene allegata al messaggio che ci invii e non identifica nessuno.</li>
                <li><strong>Statistiche di navigazione:</strong> conteggi aggregati delle pagine viste, raccolti senza cookie e senza creare profili individuali.</li>
              </ul>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Finalità del trattamento</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rispondere alle tue richieste di informazioni o demo</li>
                <li>Inviarti la guida che hai richiesto</li>
                <li>Valutare la tua candidatura, se ti sei proposto per una posizione</li>
                <li>Gestire il rapporto contrattuale con i clienti della piattaforma</li>
                <li>Capire in forma aggregata come viene usato il sito e quali contenuti portano visite</li>
              </ul>
              <p>Non vendiamo i tuoi dati e non li cediamo a terzi per finalità pubblicitarie.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Base giuridica</h2>
              <p>Il trattamento si basa sul consenso dell&apos;interessato, sull&apos;esecuzione del contratto o su misure precontrattuali adottate su tua richiesta, oppure sul legittimo interesse del titolare, a seconda della finalità.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">A chi comunichiamo i dati</h2>
              <p>Per far funzionare il sito ci appoggiamo ad alcuni fornitori, che trattano i dati per nostro conto e solo per le finalità qui indicate:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Vercel</strong> — ospita il sito e ne raccoglie le statistiche aggregate.</li>
                <li><strong>Resend</strong> — recapita alla nostra casella i messaggi e le candidature inviate dai form.</li>
                <li><strong>Notion</strong> — conserva le richieste delle guide gratuite.</li>
              </ul>
              <p>Alcuni di questi fornitori hanno sede fuori dall&apos;Unione Europea: in tal caso il trasferimento avviene sulla base delle garanzie previste dalla normativa applicabile.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Conservazione</h2>
              <p>I dati sono conservati per il tempo necessario alle finalità indicate, o per gli obblighi di legge applicabili. Il dato sulla provenienza si cancella da solo quando chiudi la scheda del browser.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Diritti dell&apos;interessato</h2>
              <p>Hai diritto di accedere ai tuoi dati, chiederne la rettifica o la cancellazione, limitarne o opporti al trattamento, e riceverli in formato leggibile. Dove il trattamento si basa sul consenso, puoi revocarlo in qualsiasi momento senza che questo pregiudichi quanto fatto prima. Per esercitare questi diritti scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.</p>
              <p>Se ritieni che il trattamento non sia conforme alla normativa, puoi rivolgerti al Garante per la protezione dei dati personali.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Cookie</h2>
              <p>Per informazioni dettagliate su cosa viene salvato nel tuo browser, consulta la nostra <a href="/cookie" className="text-orange-500 hover:underline">Cookie Policy</a>.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}