import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy policy",
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
              <p>Ultimo aggiornamento: ottobre 2026</p>

              {/* Riscritta il 06/10/2026 con le correzioni della Conformità (vault, sito-seo, CONFORMITA §3.7, CAN-39):
                  titolare con i dati dei contratti, Salesflow fra i fornitori, base giuridica per ogni finalità, email
                  promozionali solo con la casella del modulo, conservazione con un periodo. Le scelte sono di Raffaele
                  (06/10): casella su /contatti e sulla demo, 24 mesi, sede legale come nei contratti. */}
              <h2 className="font-display font-bold text-navy text-xl mt-8">Chi tratta i tuoi dati</h2>
              <p>
                Il titolare del trattamento dei dati raccolti con il sito cantierihub.com e con la piattaforma è{" "}
                <strong>Adact Studio International LLC</strong>, società di diritto statunitense costituita nello Stato del
                Wyoming il 6 febbraio 2024 (Filing Number 2024-001405443, EIN 35-2837991), con sede legale in 30 N Gould St
                Ste R, Sheridan, WY 82801, Stati Uniti. Opera con il marchio Cantieri Hub.
              </p>
              <p>Per tutto quello che riguarda i tuoi dati scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Dati raccolti</h2>
              <p>Raccogliamo soltanto quello che serve, e solo quando sei tu a darcelo:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Form di contatto:</strong> nome, cognome, email, telefono, azienda, il servizio che ti interessa, cosa ti serve risolvere, come ci hai conosciuti e il messaggio.</li>
                <li><strong>Richiesta di demo:</strong> nome, cognome, azienda, email, telefono, il tuo ruolo, lo strumento che vuoi vedere, il messaggio e, se arrivi da un articolo della sezione Notizie, quale articolo stavi leggendo.</li>
                <li><strong>Email promozionali:</strong> se nel modulo spunti la casella per riceverle, lo registriamo insieme alla tua richiesta.</li>
                <li><strong>Guide gratuite:</strong> l&apos;indirizzo email e quale guida hai richiesto.</li>
                <li><strong>Candidature:</strong> nome, email, telefono, ruolo, messaggio e il curriculum che alleghi.</li>
                <li><strong>Provenienza:</strong> da quale canale sei arrivato sul sito (per esempio un link con etichetta da un social). Serve a capire quali contenuti funzionano, viene allegata al messaggio che ci invii e non identifica nessuno.</li>
                <li><strong>Statistiche di navigazione:</strong> conteggi aggregati delle pagine viste, raccolti senza cookie e senza creare profili individuali.</li>
              </ul>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Perché usiamo i tuoi dati, e su quale base</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rispondere alle tue richieste, richiamarti per fissare la demo che hai chiesto e fartela vedere: lo chiedi tu (misure precontrattuali, art. 6, par. 1, lett. b GDPR).</li>
                <li>Mandarti la guida che hai richiesto: stessa base.</li>
                <li>Mandarti via email consigli, novità e offerte sui prodotti di Cantieri Hub, <strong>solo se l&apos;hai chiesto spuntando la casella nel modulo</strong>: il tuo consenso (art. 6, par. 1, lett. a GDPR e art. 130 del Codice privacy). Puoi ritirarlo quando vuoi.</li>
                <li>Valutare la tua candidatura, se ti sei proposto per una posizione: lett. b.</li>
                <li>Gestire il contratto con i clienti della piattaforma: lett. b, e gli obblighi di legge (lett. c).</li>
                <li>Capire in forma aggregata come viene usato il sito: il nostro legittimo interesse (lett. f), senza cookie.</li>
                <li>Capire da quale canale arrivano le richieste, con lo script del CRM: solo se accetti i cookie (vedi la <a href="/cookie" className="text-orange-500 hover:underline">Cookie Policy</a>).</li>
              </ul>
              <p>Non vendiamo i tuoi dati e non li cediamo a terzi per finalità pubblicitarie.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Puoi dire di no alle email promozionali, sempre</h2>
              <p>In fondo a ogni email c&apos;è il link per non riceverne più. Oppure scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>. Da quel momento non te ne mandiamo più.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">A chi comunichiamo i dati</h2>
              <p>Per far funzionare il sito ci appoggiamo ad alcuni fornitori, che trattano i dati per nostro conto e solo per le finalità qui indicate:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Vercel</strong>: ospita il sito e ne raccoglie le statistiche aggregate.</li>
                <li><strong>Resend</strong>: recapita alla nostra casella i messaggi e le candidature inviate dai form.</li>
                <li><strong>Notion</strong>: conserva le richieste delle guide gratuite.</li>
                <li><strong>Salesflow</strong>: il nostro CRM, che usa la piattaforma HighLevel (LeadConnector) negli Stati Uniti. Conserva i contatti e le richieste di demo, ci serve per richiamarti e manda le email. Se accetti i cookie di tracciamento, registra anche le pagine che visiti sul sito.</li>
              </ul>
              <p>Vercel, Resend, Notion e HighLevel hanno sede negli Stati Uniti. Il trasferimento avviene con le garanzie previste dal GDPR (Capo V): la decisione di adeguatezza UE-USA (Data Privacy Framework) per i fornitori certificati, oppure le clausole contrattuali standard della Commissione europea. Per saperne di più scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Conservazione</h2>
              <p>Le richieste di contatto, di demo e delle guide le teniamo per 24 mesi dall&apos;ultima volta che ci siamo sentiti, poi le cancelliamo, a meno che tu non diventi cliente: in quel caso valgono i tempi del contratto e quelli di legge. Se ritiri il consenso alle email, smettiamo subito di mandartele.</p>
              <p>Gli altri dati li teniamo per il tempo necessario alle finalità indicate, o per gli obblighi di legge. Il dato sulla provenienza si cancella da solo quando chiudi la scheda del browser.</p>

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