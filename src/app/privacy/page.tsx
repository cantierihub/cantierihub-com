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
                  titolare con i dati dei contratti, Salesflow fra i fornitori, base giuridica per ogni finalità,
                  conservazione con un periodo. Le scelte sono di Raffaele (06/10): 24 mesi, sede legale come nei
                  contratti, e niente casella per le email promozionali, ma la frase sopra il pulsante di ogni modulo
                  (`lib/emailPromozionali.ts`). La Conformità consigliava la casella: domanda 7 al legale.
                  Unita lo stesso giorno con le sezioni sulla piattaforma (#40-#42): quelle restano com'erano. */}
              <h2 className="font-display font-bold text-navy text-xl mt-8">Chi tratta i tuoi dati</h2>
              <p>
                Il titolare del trattamento è <strong>Adact Studio International LLC</strong>, società di diritto statunitense
                costituita nello Stato del Wyoming il 6 febbraio 2024 (Filing Number 2024-001405443, EIN 35-2837991), con sede
                legale in 30 N Gould St, Ste R, Sheridan, WY 82801, Stati Uniti: la società che gestisce il marchio Cantieri Hub,
                il sito cantierihub.com e le sue piattaforme.
              </p>
              <p>Per tutto quello che riguarda i tuoi dati scrivi a <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline">info@cantierihub.com</a>.</p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Dati raccolti</h2>
              <p>Raccogliamo soltanto quello che serve, e solo quando sei tu a darcelo:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Form di contatto:</strong> nome, cognome, email, telefono, azienda, il servizio che ti interessa, cosa ti serve risolvere, come ci hai conosciuti e il messaggio.</li>
                <li><strong>Richiesta di demo:</strong> nome, cognome, azienda, email, telefono, il tuo ruolo, lo strumento che vuoi vedere, il messaggio e, se arrivi da un articolo della sezione Notizie, quale articolo stavi leggendo.</li>
                <li><strong>Guide gratuite:</strong> l&apos;indirizzo email e quale guida hai richiesto.</li>
                <li><strong>Candidature:</strong> nome, email, telefono, ruolo, messaggio e il curriculum che alleghi.</li>
                <li><strong>Provenienza:</strong> da quale canale sei arrivato sul sito (per esempio un link con etichetta da un social). Serve a capire quali contenuti funzionano, viene allegata al messaggio che ci invii e non identifica nessuno.</li>
                <li><strong>Statistiche di navigazione:</strong> conteggi aggregati delle pagine viste, raccolti senza cookie e senza creare profili individuali.</li>
              </ul>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Perché usiamo i tuoi dati, e su quale base</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rispondere alle tue richieste, richiamarti per fissare la demo che hai chiesto e fartela vedere: lo chiedi tu (misure precontrattuali, art. 6, par. 1, lett. b GDPR).</li>
                <li>Mandarti la guida che hai richiesto: stessa base.</li>
                <li>Mandarti via email consigli, novità e offerte sui prodotti di Cantieri Hub. <strong>Te lo diciamo in ogni modulo, sopra il pulsante, prima che tu lo invii</strong>: inviandolo ci dai il tuo consenso (art. 6, par. 1, lett. a GDPR e art. 130 del Codice privacy). Puoi ritirarlo quando vuoi, con un clic.</li>
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
              {/* La parte sulla piattaforma (06/10/2026, domande di Stilcolor): deve combaciare con l'Allegato A del contratto, che per
                  l'elenco dei sub-responsabili rimanda a questa pagina: a ogni cambio di fornitore si aggiorna qui. */}
              <h2 className="font-display font-bold text-navy text-xl mt-8">I dati nella piattaforma</h2>
              <p>
                Per i dati dei clienti della piattaforma (account, utenti, fatturazione) il titolare è Adact Studio International LLC.
                Per i dati che il cliente inserisce nella piattaforma, per esempio le anagrafiche dei suoi clienti e fornitori o i
                documenti che carica, il titolare è il cliente: noi li trattiamo per suo conto, come responsabile del trattamento
                (art. 28 GDPR), secondo il contratto di licenza.
              </p>
              <p>Per far funzionare la piattaforma ci appoggiamo a questi fornitori (sub-responsabili del trattamento):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Lovable</strong> — ospita l&apos;applicazione e dà l&apos;accesso ai modelli di intelligenza artificiale.</li>
                <li><strong>Supabase</strong> — database e archivio dei file, su server nell&apos;Unione Europea: a Francoforte per il Preventivatore, a Parigi per il Computatore.</li>
                <li><strong>Google</strong> — i modelli di intelligenza artificiale Gemini.</li>
                <li><strong>Resend</strong> — le email di servizio, come gli avvisi e il recupero della password.</li>
                <li><strong>Stripe</strong> — i pagamenti dei pacchetti di crediti.</li>
              </ul>
              <p>
                Come usiamo l&apos;intelligenza artificiale con i tuoi dati lo spieghiamo in{" "}
                <a href="/ai-trasparenza#dati-e-ai" className="text-orange-500 hover:underline">AI e trasparenza</a>.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Trasferimenti fuori dall&apos;Unione Europea</h2>
              <p>
                Adact Studio International LLC ha sede negli Stati Uniti, e alcuni fornitori trattano dati fuori dall&apos;Unione
                Europea. I trasferimenti avvengono con le garanzie del Capo V del GDPR, come le clausole contrattuali tipo adottate
                dalla Commissione europea o l&apos;adesione del destinatario al Data Privacy Framework UE-USA.
              </p>

              <h2 className="font-display font-bold text-navy text-xl mt-8">Conservazione</h2>
              <p>Le richieste di contatto, di demo e delle guide le teniamo per 24 mesi dall&apos;ultima volta che ci siamo sentiti, poi le cancelliamo, a meno che tu non diventi cliente: in quel caso valgono i tempi del contratto e quelli di legge. Se ritiri il consenso alle email, smettiamo subito di mandartele.</p>
              <p>Gli altri dati li teniamo per il tempo necessario alle finalità indicate, o per gli obblighi di legge. Il dato sulla provenienza si cancella da solo quando chiudi la scheda del browser.</p>
              <p>I dati della piattaforma si cancellano alla fine del contratto, come previsto dal contratto di licenza: entro 60 giorni dalla cessazione, ed entro 90 giorni anche dalle copie di backup.</p>

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