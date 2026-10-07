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
- **Eccezione, il riquadro della prova** (`/prova/analisi-prezzi`, Raffaele 07/10): la demo del Preventivatore sta in
  un palco arancio (fondo `orange-100`, bordo `orange-300`, raggio 18 px, ombra `shadow-riquadro`) perché si veda dove
  la prova comincia e finisce. Dentro, le schede restano quelle del prodotto (bianche, raggio 8 px). Il palco è uno
  per pagina: non è un modello per gli altri blocchi.
- ⛔ Niente bordo colorato su un lato solo (`border-left` come accento), niente testo a gradiente, niente schede uguali
  in griglia quando basta un elenco.

## La pagina articolo (`/notizie/<slug>`)
Ordine fisso, dall'alto (aggiornato il 03/10 sera, CAN-37 e funnel delle Notizie):
percorso (Notizie › categoria) · titolo · descrizione · firma col marchio («Redazione Cantieri Hub», link a
`/ai-trasparenza#notizie`, data, minuti) · copertina (a tutto schermo su telefono; l'immagine AI porta **dentro il
file** l'icona UE «AI GENERATED» a 1/5 della larghezza, niente didascalia) · **In breve** · indice (chiuso su telefono,
fisso a destra da 1280 px) · corpo · **Cosa cambia per la tua impresa** (riquadro arancio chiaro) · **Cosa fare
adesso** (riquadro navy, passi numerati in cerchi arancio) · **blocco «Pubblicità»** (dopo l'ultima sezione; bordo
tratteggiato, etichetta scritta, titolo in Inter; testi fissi in `src/data/funnelNotizie.ts`; si spegne con
`prodotto: nessuno`) · Domande frequenti (a fisarmonica) · Fonti (ente sopra, atto sotto) · **«Come è nato questo
articolo»** (l'unica nota sull'AI della pagina, con la frase sulla copertina) · link a tutte le notizie.

⛔ In alto niente nota sull'AI (si riaccende solo con `nota_ai_in_alto: true`) e nel testo nessun prodotto: il richiamo
commerciale è il blocco, e solo lui. Il blocco non deve somigliare ai riquadri della redazione.

## Il funnel delle Notizie (`/demo/<prodotto>`)
Articolo → blocco «Pubblicità» → `/demo/<prodotto>?da=<slug>` (cosa fa, il limite, la candidatura, come funziona, le
domande; noindex) → `/grazie?da=<slug>` («Candidatura ricevuta»). Il pulsante del funnel è `.btn-funnel`: arancio del
marchio con il testo **navy** (il bianco sull'arancio fa 2,8:1 e al sole non si legge). Sulle `/demo/*` il pulsante del
menu porta al modulo della pagina e il piè di pagina non ha la colonna «Inizia adesso».

Il Markdown dell'articolo diventa così:
| Markdown | Sulla pagina |
|---|---|
| `## Domanda?` | sottotitolo con una riga sottile sopra, voce dell'indice |
| `## Cosa cambia…` / `## Cosa fare…` | i due riquadri (il blocco «Pubblicità» lo aggiunge il sito dopo l'ultima sezione) |
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
