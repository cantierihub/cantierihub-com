# Design · cantierihub.com

Il sistema visivo che esiste già in produzione (tokens in `src/app/globals.css`, `@theme`). Questo file lo descrive per
chi tocca il sito, persone o agenti: si parte da qui, non si inventa.

## Colori
- **Navy** `#0f172a` (navy-900): titoli, testo forte, fondi scuri (testate, «Cosa fare adesso», footer).
- **Arancio** `#f97316` (orange-500): l'accento. Pulsanti principali, pallini, numeri dei passi, stato attivo.
  Per il testo arancio su bianco si usa **orange-700 `#c2410c`** (contrasto 5,2:1), mai il 500 (2,8:1).
- Neutri: la scala `navy-50…950` (slate). Testo del corpo `#1e293b`, testo secondario **almeno navy-600 `#475569`**
  (7,5:1); navy-500 `#64748b` solo per testo ≥ 14 px non essenziale.
- Fondi: bianco; `navy-50 #f8fafc` per i blocchi in evidenza; `orange-50 #fff7ed` + bordo `orange-200` per
  «Cosa cambia per la tua impresa».

## Caratteri
- **Poppins** (600-900) per i titoli, **Inter** per il testo. Niente terzo carattere.
- Titoli: `text-wrap: balance`. Nei titoli lunghi in Poppins la spaziatura sta fra **-0.01em e -0.02em**: più stretta
  e le parole si attaccano (lo spazio fra le parole sparisce, visto il 03/10 su «E i prezzi dell'industria?»).
- Corpo dell'articolo: **17 px su telefono, 18 px da 768 px**, interlinea 1,7-1,75, colonna di **680 px** (~68
  caratteri). **Mai testo sotto i 14 px su telefono.**

## Spazi e forme
- Contenitore `container-main` (1200 px, 24 px di margine su telefono). Raggi: 12-18 px sui blocchi, pieno sulle
  pillole. Ombre leggere solo su elementi che si sollevano al passaggio del mouse.
- ⛔ Niente bordo colorato su un lato solo (`border-left` come accento), niente testo a gradiente, niente schede uguali
  in griglia quando basta un elenco.

## La pagina articolo (`/notizie/<slug>`)
Ordine fisso, dall'alto: percorso (Notizie › categoria) · titolo · descrizione · firma col marchio («Redazione
Cantieri Hub», data, minuti) · nota AI · copertina (a tutto schermo su telefono, dichiarata AI) · **In breve** ·
indice (chiuso su telefono, fisso a destra da 1280 px) · corpo · **Cosa cambia per la tua impresa** (riquadro
arancio chiaro) · **Cosa fare adesso** (riquadro navy, passi numerati in cerchi arancio; l'eventuale aggancio a un
prodotto sta sotto una riga, separato dai consigli) · Domande frequenti (a fisarmonica) · Fonti (ente sopra, atto
sotto) · «Come è nato questo articolo» · link a tutte le notizie.

Il Markdown dell'articolo diventa così:
| Markdown | Sulla pagina |
|---|---|
| `## Domanda?` | sottotitolo con una riga sottile sopra, voce dell'indice |
| `## Cosa cambia…` / `## Cosa fare…` | i due riquadri |
| `- voce` | elenco col pallino arancio |
| `1. passo` | passi numerati in cerchi |
| tabella | riquadro con bordo; le colonne di soli numeri si allineano a destra, cifre di larghezza fissa |
| `*Fonte: …*` (paragrafo tutto in corsivo) | nota piccola e grigia, dritta |

⛔ Tailwind toglie pallini e numeri agli elenchi: in `.articolo` sono rimessi a mano. Un elenco nuovo fuori da
`.articolo` va trattato allo stesso modo.

## Controllo prima di mandare un'anteprima
`node "<vault>/Business/cantieri-hub/sistemi/sito-seo/strumenti/controlla-anteprima.mjs" <url>`: misura a 390 e
1440 px simboli HTML a vista, Markdown non tradotto, pagina che scorre di lato, elenchi senza pallino, immagini rotte,
testo sotto i 14 px, e salva gli scatti da guardare.
