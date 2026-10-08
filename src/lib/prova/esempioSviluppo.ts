/**
 * Solo per lo sviluppo (`PROVA_FINTA=1`): un'analisi VERA della funzione `analyze-price`, fatta il 07/10/2026 da un
 * account interno di Cantieri Hub su una voce di un preventivo di prova (pozzetto 50×50×50, Lombardia). Serve a
 * guardare la pagina senza chiamare la funzione. In produzione non si usa mai (`provaFinta()` in preventivatore.ts).
 */
export const ESEMPIO_ANALISI = {
  confidence: "alta",
  direct_cost: 72.48,
  equipment_breakdown: [
    { quantity: 0.05, subtotal: 1.1, type: "Assistenza nolo autocarro/piccolo mezzo per movimentazione in cantiere", unit_cost: 22 },
  ],
  equipment_cost: 1.1,
  giro_approfondimento: 0,
  labor_breakdown: [
    { category: "Muratore qualificato (Lombardia)", hourly_rate: 30.5, hours_per_unit: 0.8, subtotal: 24.4 },
    { category: "Operaio comune (Lombardia)", hourly_rate: 27.2, hours_per_unit: 0.6, subtotal: 16.32 },
  ],
  labor_cost: 40.72,
  market_high: 125,
  market_low: 85,
  market_mid: 105,
  materials_breakdown: [
    { name: "Pozzetto prefabbricato 50x50x50 cm in cemento vibrato", quantity: 1, subtotal: 18, unit: "cad", unit_price: 18 },
    { name: "Calcestruzzo C20/25 per rinfianchi e letto (sfrido 8% incl.)", quantity: 0.08, subtotal: 8.64, unit: "mc", unit_price: 108 },
    { name: "Malta cementizia per sigillature e allacci tubi", quantity: 15, subtotal: 2.55, unit: "kg", unit_price: 0.17 },
    { name: "Materiale di rinterro selezionato (sfrido 10% incl.)", quantity: 0.1, subtotal: 1.47, unit: "mc", unit_price: 14.7 },
  ],
  materials_cost: 30.66,
  notes:
    "L'analisi esclude lo scavo (presente come voce separata nel preventivo). Include la formazione del piano di posa in cls, il posizionamento del pozzetto, il rinfianco e il rinterro. La manodopera considera l'allaccio delle tubazioni corrugate preesistenti. Si applica un correttivo per appalto medio (50-150k) del -3% sul totale diretto. Spese generali 15% e Utile 10% applicati come richiesto. Smaltimento macerie escluso (non menzionato).",
  price_basis: "per_unita",
  refinement_questions: [
    { ambito: "voce", id: "q1", label: "Il pozzetto deve essere completo di fondo o è del tipo a sfilare (senza fondo)?", options: ["Con fondo integrato", "Senza fondo (a sfilare)"], type: "choice" },
    { ambito: "cantiere", id: "q2", label: "La movimentazione dei pozzetti dal punto di scarico al punto di posa presenta ostacoli o distanze superiori a 50 metri?", options: ["No, accesso agevole con mezzi", "Sì, trasporto manuale/piccolo dumper necessario"], type: "choice" },
    { ambito: "voce", id: "q3", label: "Il rinterro deve essere eseguito con materiale stabilizzato/ghiaia o è sufficiente terreno vegetale/risulta di scavo?", options: ["Stabilizzato/Ghiaia (maggiore costo materiale)", "Terreno di risulta (minor costo)"], type: "choice" },
  ],
  suggested_price: 91.68,
};
