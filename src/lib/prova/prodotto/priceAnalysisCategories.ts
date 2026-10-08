// ⛔ COPIA dal Preventivatore (cantierihub/preventivatorepro, origin/main 4eefacec, 07/10/2026): non si modifica qui.
// La prova del sito deve fare le stesse domande del prodotto. Se il prodotto cambia, si ricopia il file intero.
import { categoriaDaDescrizione, type ConstructionCategory } from './constructionCategories';

export interface RefinementQuestion {
  id: string;
  label: string;
  type: 'choice' | 'text';
  options?: string[];
}

/**
 * Le domande di riserva dell'analisi prezzi: si mostrano quando l'AI non ne propone di sue.
 * Sono divise per famiglia di lavoro.
 */
const DOMANDE_PER_FAMIGLIA = {
  demolizioni: [
    { id: 'distanza_discarica', label: 'Distanza dalla discarica?', type: 'choice', options: ['<10 km', '10-30 km', '>30 km'] },
    { id: 'tipo_rifiuto', label: 'Tipo di rifiuto?', type: 'choice', options: ['Inerte', 'Speciale non pericoloso', 'Pericoloso'] },
    { id: 'accesso_mezzi', label: 'Accessibilità mezzi pesanti?', type: 'choice', options: ['Libera', 'Limitata', 'Impossibile (solo manuale)'] },
  ],
  pavimentazioni: [
    { id: 'piano_posa', label: 'Piano di posa?', type: 'choice', options: ['Piano terra', '1°-3° piano', 'Oltre 3° piano'] },
    { id: 'tagli_speciali', label: 'Tagli speciali o sagomature?', type: 'choice', options: ['No', 'Pochi', 'Molti'] },
    { id: 'tipo_fondo', label: 'Tipo di fondo esistente?', type: 'choice', options: ['Massetto livellato', 'Massetto da livellare', 'Vecchia pavimentazione da rimuovere'] },
  ],
  impermeabilizzazioni: [
    { id: 'esposizione', label: 'Esposizione della superficie?', type: 'choice', options: ['Copertura piana', 'Falda inclinata', 'Parete verticale', 'Interrato'] },
    { id: 'pendenze', label: 'Pendenze esistenti?', type: 'choice', options: ['Già corrette', 'Da correggere', 'Non applicabile'] },
    { id: 'accesso_copertura', label: 'Accesso alla copertura?', type: 'choice', options: ['Scala fissa', 'Solo ponteggio', 'Trabattello/piattaforma'] },
  ],
  murature: [
    { id: 'altezza_lavori', label: 'Altezza di lavoro?', type: 'choice', options: ['<3 m', '3-6 m', '>6 m (richiede ponteggio)'] },
    { id: 'ponteggio', label: 'Ponteggio necessario?', type: 'choice', options: ['No', 'Trabattello', 'Ponteggio fisso'] },
    { id: 'tipo_malta', label: 'Tipo di malta/finitura?', type: 'choice', options: ['Malta cementizia', 'Malta bastarda', 'Intonaco premiscelato', 'Intonaco a calce'] },
  ],
  impianti: [
    { id: 'tracce', label: 'Tracce necessarie?', type: 'choice', options: ['No (a vista)', 'Poche', 'Molte (impianto sotto traccia)'] },
    { id: 'tipo_passaggio', label: 'Tipo di passaggio?', type: 'choice', options: ['A vista', 'Sotto traccia', 'Controsoffitto', 'Cavedio'] },
    { id: 'ripristini', label: 'Ripristini murari inclusi?', type: 'choice', options: ['Sì', 'No (solo impianto)'] },
  ],
  pitture: [
    { id: 'altezza_soffitto', label: 'Altezza del soffitto?', type: 'choice', options: ['<2,7 m (standard)', '2,7-4 m', '>4 m (richiede ponteggio)'] },
    { id: 'stato_supporto', label: 'Stato attuale del supporto?', type: 'choice', options: ['Ottimo (solo mano finale)', 'Discreto (stuccature lievi)', 'Scarso (rasatura completa)'] },
    { id: 'numero_mani', label: 'Numero di mani previste?', type: 'choice', options: ['1 mano', '2 mani', '3+ mani'] },
  ],
  scavi: [
    { id: 'profondita', label: 'Profondità di scavo?', type: 'choice', options: ['<1 m', '1-3 m', '>3 m'] },
    { id: 'tipo_terreno', label: 'Tipo di terreno?', type: 'choice', options: ['Sciolto (sabbia/ghiaia)', 'Coerente (argilla/limo)', 'Roccioso/misto'] },
    { id: 'falda', label: 'Presenza di falda acquifera?', type: 'choice', options: ['No', 'Possibile', 'Sì (richiede aggottamento)'] },
  ],
  intonaci: [
    { id: 'tipo_supporto', label: 'Tipo di supporto?', type: 'choice', options: ['Laterizio', 'Calcestruzzo', 'Blocchi in cls', 'Misto'] },
    { id: 'spessore', label: 'Spessore intonaco?', type: 'choice', options: ['Strato sottile (<1,5 cm)', 'Standard (1,5-3 cm)', 'Spesso (>3 cm)'] },
    { id: 'posizione', label: 'Posizione?', type: 'choice', options: ['Interno', 'Esterno', 'Bagni/zone umide'] },
  ],
  serramenti: [
    { id: 'tipo_controtelaio', label: 'Controtelaio esistente?', type: 'choice', options: ['Sì, riutilizzabile', 'Da sostituire', 'Da installare ex novo'] },
    { id: 'piano_installazione', label: 'Piano di installazione?', type: 'choice', options: ['Piano terra', '1°-3° piano', 'Oltre 3° piano'] },
    { id: 'smaltimento', label: 'Smaltimento vecchi infissi?', type: 'choice', options: ['Incluso', 'Escluso', 'Non applicabile'] },
  ],
} satisfies Record<string, RefinementQuestion[]>;

export type FamigliaDiDomande = keyof typeof DOMANDE_PER_FAMIGLIA;

/**
 * Quale famiglia di domande vale per ogni categoria. Le chiavi sono le 24 categorie della
 * piattaforma: un nome che non esiste ferma il controllo dei tipi. Chi non è in elenco non ha
 * domande di riserva, perché nessuna delle famiglie gli si adatta.
 */
const FAMIGLIA_DELLA_CATEGORIA: Partial<Record<ConstructionCategory, FamigliaDiDomande>> = {
  'Demolizioni e smaltimenti': 'demolizioni',
  'Pavimenti e rivestimenti': 'pavimentazioni',
  'Impermeabilizzazioni': 'impermeabilizzazioni',
  'Tamponamenti e tramezzi': 'murature',
  'Impianti elettrici': 'impianti',
  'Impianti idraulici e sanitari': 'impianti',
  'Impianti termici e climatizzazione': 'impianti',
  'Impianti speciali (antincendio, ascensori)': 'impianti',
  'Rifiniture e tinteggiature': 'pitture',
  'Movimenti di terra': 'scavi',
  'Opere di fondazione': 'scavi',
  'Intonaci e stucchi': 'intonaci',
  'Infissi e serramenti': 'serramenti',
};

/**
 * Il testo di una descrizione scritta con l'editor. Al posto di ogni marcatore resta uno spazio:
 * due paragrafi incollati farebbero una parola sola («AIUOLEFornitura»).
 */
function testoSenzaHtml(descrizione: string | null | undefined): string {
  return String(descrizione ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;|&apos;|&rsquo;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** La famiglia di domande di una categoria, se ne ha una. */
export function famigliaDiDomande(categoria: string | null | undefined): FamigliaDiDomande | null {
  if (!categoria) return null;
  return FAMIGLIA_DELLA_CATEGORIA[categoria as ConstructionCategory] ?? null;
}

/**
 * Le domande di riserva per una lavorazione, lette dalla sua descrizione. Elenco vuoto quando la
 * descrizione non dice la categoria, o la categoria non ha domande sue.
 *
 * La categoria la legge lo stesso riconoscitore del resto della piattaforma: parole intere,
 * all'inizio della descrizione. La descrizione può arrivare con l'HTML dell'editor.
 */
export function domandeDiRiserva(descrizione: string | null | undefined): RefinementQuestion[] {
  const famiglia = famigliaDiDomande(categoriaDaDescrizione(testoSenzaHtml(descrizione)));
  return famiglia ? DOMANDE_PER_FAMIGLIA[famiglia].map((d) => ({ ...d, options: d.options ? [...d.options] : undefined })) : [];
}

/** Tutte le famiglie, per le prove. */
export function famiglieDiDomande(): FamigliaDiDomande[] {
  return Object.keys(DOMANDE_PER_FAMIGLIA) as FamigliaDiDomande[];
}
