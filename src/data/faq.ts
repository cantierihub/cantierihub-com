export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  title: string;
  faqs: FAQItem[];
}

// Fonte unica delle FAQ. La pagina /faq mostra tutte le categorie;
// la home mostra il sottoinsieme `homeFaqs` (derivato da qui, niente doppioni).
export const faqCategories: FAQCategory[] = [
  {
    title: "Il prodotto",
    faqs: [
      { q: "Devo installare qualcosa sul mio computer?", a: "No. Cantieri Hub è un software cloud. Basta un browser aggiornato e una connessione internet. Funziona su PC, Mac e tablet." },
      { q: "Che formati di file posso caricare?", a: "PDF, Excel (.xlsx, .xls) e XML (formato standard del settore). Per il Computatore AI puoi anche caricare immagini (JPG, PNG) delle piantine e foto di cantiere." },
      { q: "I prezzari regionali sono inclusi?", a: "Sì. Sono inclusi DEI, Regione Lombardia, Sicilia e altri prezzari regionali italiani. Puoi anche importare e mantenere il tuo prezzario aziendale personalizzato." },
      { q: "Quanti utenti posso avere?", a: "Ogni licenza include 3 utenti: il titolare e 2 collaboratori. Tutti accedono agli stessi dati aziendali in tempo reale, con ruoli differenziati." },
      { q: "Qual è la differenza tra Preventivatore e Computatore?", a: "Il Computatore genera il computo metrico (la lista di voci di lavorazione con quantità). Il Preventivatore lo trasforma in un'offerta commerciale con prezzi, ribassi e PDF brandizzato. Possono essere usati insieme o separatamente." },
      { q: "C'è un'app mobile?", a: "Al momento no — il prodotto è ottimizzato per desktop e tablet. Stiamo valutando una versione mobile per fasi future." },
    ],
  },
  {
    title: "Prezzi e contratti",
    faqs: [
      { q: "Quanto costa?", a: "Il prezzo non è comunicato pubblicamente — viene discusso durante la demo, su misura per la tua impresa. Prenota una chiamata gratuita per scoprirlo." },
      { q: "Ci sono piani mensili?", a: "No. La licenza è annuale. In casi eccezionali è possibile rateizzare in 3-4 rate. Non esiste un piano mensile." },
      { q: "Esiste una versione di prova gratuita?", a: "No. Ogni onboarding ha un costo operativo, quindi non offriamo trial. Offriamo invece una demo gratuita in cui vedi il prodotto funzionare con i tuoi file reali." },
      { q: "Posso acquistare solo il Computatore AI senza il Preventivatore?", a: "Sì. Sono prodotti separati con licenze separate. Chi ha già il Preventivatore paga meno per aggiungere il Computatore." },
    ],
  },
  {
    title: "Sicurezza e dati",
    faqs: [
      { q: "I miei dati aziendali sono al sicuro?", a: "I dati sono isolati per azienda tramite Row Level Security su Supabase — nessun altro cliente può accedervi. Tutto è crittografato in transito e a riposo." },
      { q: "Rispettate il GDPR?", a: "Sì. I dati sono ospitati su infrastruttura europea (Supabase EU) e trattiamo i dati nel rispetto della normativa GDPR." },
      { q: "I miei prezzari e preventivi storici restano privati?", a: "Assolutamente. Il prezzario interno e l'archivio storico sono isolati per azienda. Nessun dato viene condiviso tra clienti diversi." },
    ],
  },
  {
    title: "Supporto e onboarding",
    faqs: [
      { q: "Come funziona l'onboarding?", a: "Dopo la firma, vieni inserito in un gruppo WhatsApp dedicato con il tuo referente. Si organizza subito una chiamata di formazione guidata dove usi il prodotto con i tuoi file reali." },
      { q: "Con chi parlo se ho un problema?", a: "Hai un referente diretto raggiungibile via WhatsApp e videochiamata. Non esistono ticket anonimi — parli con una persona che conosce il tuo caso." },
      { q: "Quanto tempo ci vuole per imparare a usarlo?", a: "La maggior parte dei clienti genera il primo preventivo nella stessa sessione di onboarding. L'interfaccia è pensata per chi non è un tecnico informatico." },
    ],
  },
];

// Sottoinsieme mostrato nella sezione FAQ della home — riferimenti diretti alle
// stesse voci di `faqCategories`, così home e /faq non possono divergere.
export const homeFaqs: FAQItem[] = [
  faqCategories[0].faqs[0], // Devo installare qualcosa sul mio computer?
  faqCategories[0].faqs[1], // Che formati di file posso caricare?
  faqCategories[0].faqs[2], // I prezzari regionali sono inclusi?
  faqCategories[2].faqs[0], // I miei dati aziendali sono al sicuro?
  faqCategories[3].faqs[1], // Con chi parlo se ho un problema?
  faqCategories[1].faqs[0], // Quanto costa?
];
