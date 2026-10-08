// ⛔ COPIA dal Preventivatore (cantierihub/preventivatorepro, origin/main 4eefacec, 07/10/2026): non si modifica qui.
// La prova del sito deve fare le stesse domande del prodotto. Se il prodotto cambia, si ricopia il file intero.
/**
 * 24 categorie edili standard utilizzate in tutta l'app
 * per prezzari interni, archivio storico e analisi prezzi AI.
 */
export const CONSTRUCTION_CATEGORIES = [
  'Lavori preliminari e provvisori',
  'Movimenti di terra',
  'Demolizioni e smaltimenti',
  'Opere di fondazione',
  'Strutture (solai, pilastri, tetti)',
  'Tamponamenti e tramezzi',
  'Intonaci e stucchi',
  'Pavimenti e rivestimenti',
  'Controsoffitti e cartongesso',
  'Infissi e serramenti',
  'Opere in ferro, legno e metallo',
  'Impermeabilizzazioni',
  'Coperture',
  'Rifiniture e tinteggiature',
  'Opere esterne e sistemazioni',
  'Impianti idraulici e sanitari',
  'Impianti termici e climatizzazione',
  'Impianti elettrici',
  'Impianti speciali (antincendio, ascensori)',
  'Verde, arredo e urbanistiche',
  'Noleggi',
  'Mano d\'opera',
  'Opere stradali',
  'Oneri di sicurezza e generali',
] as const;

export type ConstructionCategory = typeof CONSTRUCTION_CATEGORIES[number];

/** Dove finisce una voce che nessuna regola sa mettere in una delle 24. */
export const ALTRE_LAVORAZIONI = 'Altre Lavorazioni';

/**
 * Parole chiave → categoria standard.
 *
 * Una parola chiave vale solo dove nel testo COMINCIA una parola: «nolo» non si trova dentro
 * «tecnologici», «presa» non dentro «compresa», «terra» non dentro «terrazzo».
 *
 * Come si scrive:
 *  - `paviment*`        radice: ogni parola che comincia così (pavimento, pavimenti, pavimentazione);
 *  - `porta`            parola intera: «porta» sì, «portata» no;
 *  - `pomp* di calore`  più parole di seguito, ognuna radice o intera, con in mezzo spazi o un trattino.
 *
 * Le parole composte vanno scritte: «termoidraulico» non comincia con «idraulic», «idropittura» non
 * comincia con «pittur».
 *
 * `sempre` vale nei nomi dei capitoli e nelle descrizioni delle voci.
 * `etichetta` vale solo nel nome di un capitolo o di una categoria («Oneri della sicurezza»,
 * «Opere in ferro», «Strutture»): nella descrizione di una voce le stesse parole sono di passaggio
 * («vetro di sicurezza», «struttura metallica del controsoffitto», «lana di vetro») e lì non contano.
 *
 * Una parola che da sola inganna anche in un'etichetta non c'è: al suo posto c'è il modo di dire
 * intero. «Piano terra» e «Cantiere di via Roma» non dicono che lavoro è, «movimenti di terra» e
 * «impianto di cantiere» sì.
 */
interface VociDiCategoria {
  categoria: ConstructionCategory;
  sempre: string[];
  etichetta?: string[];
}

const PAROLE_CHIAVE: VociDiCategoria[] = [
  {
    categoria: 'Lavori preliminari e provvisori',
    sempre: ['preliminar*', 'provvisor*', 'allestiment*', 'recinzion*', 'ponteggi*', 'cantierizzazion*', 'accantierament*',
      'impianto di cantiere', 'impianto cantiere', 'installazione di cantiere', 'installazione cantiere', 'opere di cantiere'],
    etichetta: ['provvision*'],
  },
  {
    categoria: 'Movimenti di terra',
    sempre: ['scavo', 'scavi', 'sbancament*', 'rilevato', 'rilevati', 'moviment* terra', 'moviment* di terra'],
  },
  {
    categoria: 'Demolizioni e smaltimenti',
    sempre: ['demolizion*', 'smaltiment*', 'rimozion*'],
  },
  {
    categoria: 'Opere di fondazione',
    sempre: ['fondazion*', 'sottofondazion*', 'platea', 'platee', 'micropal*'],
  },
  {
    categoria: 'Strutture (solai, pilastri, tetti)',
    sempre: ['solaio', 'solai', 'pilastr*', 'trave', 'travi', 'travett*', 'architrav*', 'armatur*'],
    // La sigla da sola no: «c.a.» è anche la corrente alternata, e sta dentro «C.A.M.».
    etichetta: ['struttur*', 'calcestruzz*', 'cls', 'cemento armato', 'opere in c.a.'],
  },
  {
    categoria: 'Tamponamenti e tramezzi',
    sempre: ['tamponam*', 'tamponatur*', 'tramezz*', 'muratura', 'murature'],
    // «Opere da muratore» è un capitolo di murature; «muratore» da solo è una persona (Mano d'opera).
    etichetta: ['opere da muratore', 'murar*', 'parete', 'pareti'],
  },
  {
    categoria: 'Intonaci e stucchi',
    sempre: ['intonac*', 'stucc*', 'rasatur*', 'rasante', 'rasanti', 'arricci*'],
  },
  {
    categoria: 'Pavimenti e rivestimenti',
    sempre: ['paviment*', 'ripavimentazion*', 'rivestiment*', 'piastrell*', 'gres', 'ceramica', 'ceramiche', 'marmo', 'marmi'],
  },
  {
    categoria: 'Controsoffitti e cartongesso',
    sempre: ['controsoffit*', 'cartongess*'],
    etichetta: ['gesso', 'secco'],
  },
  {
    categoria: 'Infissi e serramenti',
    sempre: ['infiss*', 'serrament*', 'finestr*', 'portafinestr*', 'portefinestr*', 'porta', 'porte', 'porton*', 'vetrat*'],
    etichetta: ['vetro', 'vetri'],
  },
  {
    categoria: 'Opere in ferro, legno e metallo',
    sempre: ['ringhier*', 'fabbro', 'carpenteri*'],
    etichetta: ['opere in ferro', 'opere in legno', 'opere in metallo', 'opere in acciaio', 'opere metalliche'],
  },
  {
    categoria: 'Impermeabilizzazioni',
    sempre: ['impermeabilizz*', 'guaina', 'guaine', 'membrana', 'membrane'],
  },
  {
    categoria: 'Coperture',
    sempre: ['copertur*', 'tett*', 'tegol*', 'lattoneri*', 'grond*'],
    etichetta: ['lattonier*'],
  },
  {
    categoria: 'Rifiniture e tinteggiature',
    sempre: ['rifinit*', 'tinteggiatur*', 'ritinteggiatur*', 'pittur*', 'idropittur*', 'verniciatur*', 'riverniciatur*', 'sverniciatur*', 'imbiancatur*'],
    etichetta: ['pittore', 'pittori'],
  },
  {
    categoria: 'Opere esterne e sistemazioni',
    sempre: ['cancello', 'cancelli', 'cancellata', 'cancellate', 'pavimentazion* estern*'],
    etichetta: ['marciapied*', 'sistemazion*', 'opere esterne', 'aree esterne', 'area esterna'],
  },
  {
    categoria: 'Impianti idraulici e sanitari',
    sempre: ['idraulic*', 'termoidraulic*', 'sanitar*', 'idrosanitar*', 'termosanitar*', 'idrotermosanitar*', 'tubazion*', 'fognatur*',
      'scaldabagn*', 'scaldacqu*'],
    etichetta: ['scarico', 'scarichi', 'acqua', 'idric*'],
  },
  {
    categoria: 'Impianti termici e climatizzazione',
    sempre: ['climatizz*', 'riscaldament*', 'condizionament*', 'caldai*', 'radiator*', 'termoarred*', 'hvac',
      'pomp* di calore', 'impiant* termic*', 'central* termic*'],
  },
  {
    categoria: 'Impianti elettrici',
    // Il magnetotermico è un interruttore: «termic» lo portava tra gli impianti termici.
    sempre: ['elettric*', 'magnetotermic*', 'cablaggi*', 'illuminazion*', 'presa di corrente', 'prese di corrente', 'punto presa', 'punti presa'],
    etichetta: ['presa', 'prese'],
  },
  {
    categoria: 'Impianti speciali (antincendio, ascensori)',
    sempre: ['ascensor*', 'elevator*', 'domotic*', 'fotovoltaic*', 'videosorveglianza', 'impiant* special*'],
    etichetta: ['antincendio'],
  },
  {
    categoria: 'Verde, arredo e urbanistiche',
    sempre: ['arred* urban*', 'urbanistic*', 'piantumazion*'],
    etichetta: ['verde', 'giardin*', 'aiuol*'],
  },
  {
    categoria: 'Noleggi',
    sempre: ['noleggi*', 'nolo', 'noli'],
  },
  {
    categoria: 'Mano d\'opera',
    sempre: ['mano d\'opera', 'manodopera', 'operaio', 'operai', 'muratore', 'muratori'],
  },
  {
    categoria: 'Opere stradali',
    sempre: ['asfalt*', 'conglomerat* bituminos*', 'carreggiat*', 'segnaletic*', 'guard rail', 'guardrail'],
    etichetta: ['stradal*', 'bitum*'],
  },
  {
    categoria: 'Oneri di sicurezza e generali',
    sempre: ['imprevisti', 'spese generali', 'oneri generali'],
    etichetta: ['oneri', 'sicurezza'],
  },
];

/**
 * Di una descrizione conta l'inizio, dove sta scritto che lavoro è. Più avanti ci sono le cose
 * comprese nel prezzo («compreso il trasporto, lo smaltimento, le opere provvisionali»): su 1.867
 * voci già classificate, le parole trovate dopo questo punto sbagliavano categoria due volte su tre.
 */
const INIZIO_DESCRIZIONE = 80;
/** Quanto testo si legge oltre quel punto, perché la parola cominciata lì dentro ci stia tutta. */
const CODA_DI_LETTURA = 60;

const LETTERA_O_CIFRA = '[\\p{L}\\p{N}]';
const FINE_PAROLA = `(?!${LETTERA_O_CIFRA})`;

interface ParolaChiave {
  categoria: ConstructionCategory;
  scritta: string;
  lunghezza: number;
  ordine: number;
}

function paroleDi(conEtichetta: boolean): ParolaChiave[] {
  const parole: ParolaChiave[] = [];
  PAROLE_CHIAVE.forEach((voce, ordine) => {
    for (const scritta of [...voce.sempre, ...(conEtichetta ? voce.etichetta ?? [] : [])]) {
      parole.push({ categoria: voce.categoria, scritta, lunghezza: scritta.replace(/\*$/, '').length, ordine });
    }
  });
  return parole;
}

/**
 * `paviment*` → radice, `porta` → parola intera. Una radice che non è l'ultima parola del modo di
 * dire si porta dietro il resto della sua parola («pomp* di calore»: pompa, pompe). In una sigla
 * l'ultimo punto può mancare; l'apostrofo può essere dritto, curvo o un accento.
 */
function espressioneDi(scritta: string): string {
  const pezzi = scritta.split(' ');
  return pezzi.map((pezzo, i) => {
    const radice = pezzo.endsWith('*');
    const nudo = radice ? pezzo.slice(0, -1) : pezzo;
    const protetto = nudo
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\.$/, '\\.?')
      .replace(/'/g, '[\'’`´]\\s*');
    if (!radice) return protetto + FINE_PAROLA;
    return protetto + (i < pezzi.length - 1 ? `${LETTERA_O_CIFRA}*` : '');
  }).join('[\\s-]+');
}

interface Cercatore {
  espressione: RegExp;
  parole: ParolaChiave[];
}

/**
 * Un'espressione sola per tutte le parole: trova la prima parola chiave del testo. Se due cominciano
 * nello stesso punto vince la più lunga («pavimentazione esterna» su «paviment*»), poi l'ordine
 * delle categorie. Il carattere prima della parola fa parte dell'espressione, senza guardare
 * all'indietro: Safari prima del 16.4 non lo sa fare.
 */
function cercatore(conEtichetta: boolean): Cercatore {
  const parole = paroleDi(conEtichetta).sort((a, b) => b.lunghezza - a.lunghezza || a.ordine - b.ordine);
  const alternative = parole.map((p) => `(${espressioneDi(p.scritta)})`).join('|');
  return { espressione: new RegExp(`(^|[^\\p{L}\\p{N}])(?:${alternative})`, 'u'), parole };
}

let perEtichette: Cercatore | null = null;
let perDescrizioni: Cercatore | null = null;

interface Trovata {
  categoria: ConstructionCategory;
  parola: string;
  posizione: number;
}

function primaParolaChiave(testo: string, conEtichetta: boolean): Trovata | null {
  const c = conEtichetta ? (perEtichette ??= cercatore(true)) : (perDescrizioni ??= cercatore(false));
  const m = c.espressione.exec(testo.toLowerCase());
  if (!m) return null;
  const quale = m.findIndex((gruppo, i) => i >= 2 && gruppo !== undefined);
  if (quale < 0) return null;
  const parola = c.parole[quale - 2];
  return { categoria: parola.categoria, parola: parola.scritta, posizione: m.index + m[1].length };
}

/** Da un file o dall'AI può arrivare un numero al posto di un testo. */
function testoDi(valore: unknown): string {
  return valore == null ? '' : String(valore).trim();
}

/** Una delle 24, scritta com'è nell'elenco: maiuscole e spazi attorno non contano. */
export function categoriaStandard(testo: string | null | undefined): ConstructionCategory | null {
  const cercata = testoDi(testo).toLowerCase();
  if (!cercata) return null;
  return CONSTRUCTION_CATEGORIES.find((c) => c.toLowerCase() === cercata) ?? null;
}

/** La categoria che corrisponde al NOME di un capitolo o di una categoria, se c'è. */
export function categoriaDaEtichetta(etichetta: string | null | undefined): ConstructionCategory | null {
  const testo = testoDi(etichetta);
  if (!testo) return null;
  return categoriaStandard(testo) ?? primaParolaChiave(testo, true)?.categoria ?? null;
}

/**
 * La categoria che si legge nella DESCRIZIONE di una voce, se c'è. È l'ultima risorsa: una
 * descrizione nomina molte cose, e qui contano solo le parole che dicono il lavoro, all'inizio.
 */
export function categoriaDaDescrizione(descrizione: string | null | undefined): ConstructionCategory | null {
  const testo = testoDi(descrizione).slice(0, INIZIO_DESCRIZIONE + CODA_DI_LETTURA);
  if (!testo) return null;
  const trovata = primaParolaChiave(testo, false);
  return trovata && trovata.posizione < INIZIO_DESCRIZIONE ? trovata.categoria : null;
}

/**
 * Dato il nome di una categoria o di un capitolo (es. una categoria importata), restituisce la
 * categoria standard più vicina. Se nessuna corrisponde, restituisce il testo originale invariato.
 */
export function matchCategory(input: string | null | undefined): string {
  const testo = testoDi(input);
  if (!testo) return '';
  return categoriaDaEtichetta(testo) ?? testo;
}

/**
 * Verifica se una categoria appartiene alle 24 standard.
 */
export function isStandardCategory(cat: string): boolean {
  return CONSTRUCTION_CATEGORIES.some(c => c === cat);
}

/**
 * Il capitolo da salvare nell'archivio storico per una voce letta dall'AI. Se l'AI ha scelto una
 * delle 24, resta quella; altrimenti si guarda il nome del capitolo, e se non dice niente resta
 * com'è («Altre Lavorazioni»). La descrizione non entra: leggendola, una parola di passaggio
 * cambiava la scelta dell'AI.
 */
export function capitoloDaArchiviare(capitolo: string | null | undefined): string {
  return matchCategory(capitolo);
}

/** Sotto questa lunghezza una descrizione può essere l'inizio di un nome di capitolo («Impianti»). */
const DESCRIZIONE_CORTA = 20;

/**
 * Un capitolo che comincia con la descrizione della voce non è un nome di capitolo: è rimasto da
 * quando, se nessuna parola chiave corrispondeva, si salvava come capitolo il testo intero.
 */
function capitoloConDentroLaDescrizione(capitolo: string, descrizione: string): boolean {
  const piano = (t: string) => t.toLowerCase().replace(/\s+/g, ' ');
  return descrizione.length >= DESCRIZIONE_CORTA && piano(capitolo).startsWith(piano(descrizione));
}

/**
 * La categoria da mostrare per una voce dell'archivio. Nell'ordine: il capitolo salvato, se è una
 * delle 24; la descrizione; il nome del capitolo; «Altre Lavorazioni».
 *
 * La descrizione viene prima del nome del capitolo perché nei preventivi il capitolo è spesso un
 * posto o un lotto («LOCALE CALDAIA», «Platea in c.a.»), e dentro ci sono lavori di ogni genere.
 */
export function categoriaDaMostrare(capitolo: string | null | undefined, descrizione: string | null | undefined): string {
  const scelta = categoriaStandard(capitolo);
  if (scelta) return scelta;
  const dallaDescrizione = categoriaDaDescrizione(descrizione);
  if (dallaDescrizione) return dallaDescrizione;
  if (capitoloConDentroLaDescrizione(testoDi(capitolo), testoDi(descrizione))) return ALTRE_LAVORAZIONI;
  return categoriaDaEtichetta(capitolo) ?? ALTRE_LAVORAZIONI;
}

export interface CategoriaDaImportare {
  /** La categoria da salvare; `undefined` se la cella è vuota o non è un nome. */
  categoria: string | undefined;
  /** La cella c'era ma non aveva lettere (un numero, un codice, un prezzo): non è un nome di categoria. */
  senzaLettere: boolean;
}

/**
 * La categoria di una riga di listino che si sta importando. Una cella fatta solo di numeri non è
 * una categoria: succede quando come «Categoria» si sceglie la colonna sbagliata, e il listino si
 * riempie di migliaia di categorie diverse, una per riga.
 */
export function categoriaDaImportare(cella: string | null | undefined): CategoriaDaImportare {
  const testo = testoDi(cella);
  if (!testo) return { categoria: undefined, senzaLettere: false };
  if (!/\p{L}/u.test(testo)) return { categoria: undefined, senzaLettere: true };
  return { categoria: matchCategory(testo), senzaLettere: false };
}

/** Le parole chiave come sono scritte, per le prove. */
export function paroleChiaveScritte(): { categoria: ConstructionCategory; parola: string; soloEtichetta: boolean }[] {
  return PAROLE_CHIAVE.flatMap((voce) => [
    ...voce.sempre.map((parola) => ({ categoria: voce.categoria, parola, soloEtichetta: false })),
    ...(voce.etichetta ?? []).map((parola) => ({ categoria: voce.categoria, parola, soloEtichetta: true })),
  ]);
}
