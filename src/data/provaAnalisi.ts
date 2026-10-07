import type { Angolo } from "@/lib/prova/analisi";

/**
 * I testi delle due pagine di prova dell'Analisi Prezzi (07/10/2026): stessa prova, due modi di presentarla, per
 * capire quale porta più gente in chiamata. Il link arriva su WhatsApp subito dopo la richiesta del lead.
 *
 * - «margine» parla di soldi: il prezzo a metro quadro dato a occhio e il margine che si lascia al cliente.
 * - «fuori-prezzario» parla di tempo: la voce che non c'è nel prezzario e che oggi si compone la sera.
 *
 * Regole (FONDAMENTA dei contenuti CH): parole del mestiere, una cosa per frase, il prezzo del software mai, nessun
 * numero interno, nessun tempo promesso che non è stato misurato. Il titolo è uguale per tutte e due: lo ha deciso
 * Raffaele.
 */

export type TestiProva = {
  angolo: Angolo;
  /** Il nome nel CRM e nella pagina, per chi la guarda da dentro. */
  nome: string;
  descrizioneMeta: string;
  sottotitolo: string;
  punti: string[];
  /** «margine» mette il prezzo suo in vista; «fuori-prezzario» lo tiene fra gli altri dettagli. */
  prezzoTuoInVista: boolean;
  etichettaPrezzoTuo: string;
  aiutoPrezzoTuo: string;
  /** Sotto il risultato, prima delle clip del prodotto. */
  dopoIlRisultato: { titolo: string; testo: string };
  titoloProdotto: string;
  testoProdotto: string;
  messaggioWhatsApp: string;
};

export const TITOLO_PROVA = "Prova l'analisi prezzi su una voce tua";

export const PROVE: Record<Angolo, TestiProva> = {
  margine: {
    angolo: "margine",
    nome: "Il margine",
    descrizioneMeta:
      "Scrivi una voce che prezzi spesso e guarda cosa c'è dentro: materiali, manodopera, noli, spese generali e utile. Due analisi gratuite, senza registrarti.",
    sottotitolo:
      "Il cliente ti chiede il prezzo al metro quadro. Prima di darglielo, guarda cosa c'è dentro: materiali, manodopera, noli, spese generali e utile. Poi mettilo accanto al prezzo che fai tu.",
    punti: ["2 analisi gratuite", "Senza registrarti", "Funziona dal telefono"],
    prezzoTuoInVista: true,
    etichettaPrezzoTuo: "A quanto la fai pagare tu?",
    aiutoPrezzoTuo: "Facoltativo. Serve a metterlo accanto al risultato.",
    dopoIlRisultato: {
      titolo: "Il margine si perde una riga alla volta",
      testo:
        "Una voce sola è un assaggio. In un preventivo ce ne sono decine, e se il prezzo è a occhio il margine che manca si vede solo a cantiere chiuso.",
    },
    titoloProdotto: "Lo stesso controllo, su tutto il computo",
    testoProdotto:
      "L'analisi prezzi è una parte del Preventivatore. Il resto lo vedi qui sotto: video del programma vero, accelerati.",
    messaggioWhatsApp: "Ciao! Ho provato l'analisi prezzi sul sito e vorrei vederla sul mio computo.",
  },
  "fuori-prezzario": {
    angolo: "fuori-prezzario",
    nome: "La voce fuori prezzario",
    descrizioneMeta:
      "La voce che non trovi nel prezzario, divisa in materiali, manodopera e noli, con il prezzo che ne esce. Due analisi gratuite, senza registrarti.",
    sottotitolo:
      "La voce che non trovi nel prezzario di solito la componi la sera: telefonate ai fornitori, ore stimate a occhio, un ricarico per stare tranquillo. Scrivila qui com'è e la vedi divisa in materiali, manodopera e noli, con il prezzo che ne esce.",
    punti: ["2 analisi gratuite", "Senza registrarti", "Funziona dal telefono"],
    prezzoTuoInVista: false,
    etichettaPrezzoTuo: "Il tuo prezzo, se vuoi confrontarlo",
    aiutoPrezzoTuo: "Facoltativo.",
    dopoIlRisultato: {
      titolo: "La sera resta tua",
      testo:
        "Una voce sola è un assaggio. Nel Preventivatore lo stesso lavoro si fa su tutto il computo: le voci del prezzario si abbinano da sole e quelle che mancano passano all'analisi. A te resta il controllo.",
    },
    titoloProdotto: "Dal computo al preventivo, senza ricopiare",
    testoProdotto:
      "L'analisi prezzi è una parte del Preventivatore. Il resto lo vedi qui sotto: video del programma vero, accelerati.",
    messaggioWhatsApp: "Ciao! Ho provato l'analisi prezzi sul sito e vorrei vedere il Preventivatore sul mio computo.",
  },
};

/** Le tre clip del prodotto vero (videocorso del Preventivatore, tagliate e accelerate il 07/10/2026). */
export const CLIP_PRODOTTO = [
  {
    file: "pdf-voci",
    titolo: "Carichi il computo in PDF",
    testo: "Il Preventivatore legge il PDF e ne tira fuori le voci, una per riga, con unità di misura e quantità.",
  },
  {
    file: "prezzario",
    titolo: "Ogni voce col suo prezzo",
    testo: "Scegli il prezzario della tua regione e le voci si abbinano. Quelle che non ci sono passano all'analisi prezzi, la stessa che provi qui sopra.",
  },
  {
    file: "pdf-finale",
    titolo: "Il preventivo pronto da mandare",
    testo: "Esce in PDF col tuo logo e i tuoi dati, con la pagina per l'accettazione del cliente.",
  },
] as const;

export const PASSI_CHIAMATA = [
  { titolo: "Ti chiamiamo noi", testo: "Una persona di Cantieri Hub ti chiama al numero che hai lasciato." },
  { titolo: "Tieni pronto un computo vero", testo: "Uno che hai fatto di recente, in PDF o in Excel. Lo carichiamo insieme durante la chiamata." },
  { titolo: "Lo vedi sul tuo lavoro", testo: "Voci, prezzi e preventivo finito sul tuo computo, non su un esempio. Poi decidi tu." },
] as const;

export const COSA_NON_FA = [
  "Non fa il sopralluogo: le condizioni del cantiere le conosci tu.",
  "Non decide il prezzo: lo propone e lo spiega, l'ultima parola è tua.",
  "Non manda niente al cliente senza di te.",
] as const;

export const DOMANDE_PROVA = [
  {
    d: "È gratis davvero?",
    r: "Sì. Hai 2 analisi gratuite, senza registrarti e senza carta. Servono a farti vedere come ragiona prima della chiamata.",
  },
  {
    d: "Perché solo 2?",
    r: "Due bastano per capire come funziona. Le altre voci le facciamo insieme in chiamata, sul tuo computo.",
  },
  {
    d: "Che voce scrivo?",
    r: "Una che prezzi spesso, o una che ti ha fatto perdere tempo. Scrivila come nel computo: materiale, spessore, finitura.",
  },
  {
    d: "Il prezzo da dove viene?",
    r: "La lavorazione viene divisa in materiali, manodopera e noli, con il costo della manodopera della tua regione. Poi si aggiungono spese generali (15%) e utile (10%). Nel Preventivatore queste due percentuali le decidi tu.",
  },
  {
    d: "Quello che scrivo dove va?",
    r: "La descrizione va al nostro sistema di analisi, che usa l'intelligenza artificiale: non scrivere nomi di clienti o indirizzi. Se sei arrivato dal nostro messaggio su WhatsApp, la voce e il risultato li vede anche chi ti chiamerà, così parte dal tuo lavoro.",
  },
  {
    d: "Quanto costa il Preventivatore?",
    r: "Il prezzo lo vediamo insieme in chiamata, in base a cosa ti serve davvero.",
  },
] as const;
