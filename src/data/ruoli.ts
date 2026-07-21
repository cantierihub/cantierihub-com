// Fonte unica dei ruoli candidabili.
//
// Prima questa lista era copiata in tre punti (form, validazione server, pagina):
// aggiungerne uno solo in uno dei tre faceva rifiutare la candidatura dal server.
// Da qui la importano sia CandidaturaForm sia /api/candidatura.
//
// Lista ampliata il 21/07/2026 partendo dai ruoli di Adact Studio International.
// Volutamente NON inclusi:
//  - "Esperto di Ecommerce" e "Assistente amministrativo / Hiring": pubblicare quelle
//    ricerche annuncerebbe E-commerce e Hiring Agency, che sono tenuti fuori dalla
//    roadmap pubblica proprio per non anticiparli ai concorrenti.
//  - "Full Stack Marketer": si sovrappone a "Marketing & Contenuti".
export const RUOLI = [
  "Venditore / Closer",
  "Setter / Appuntamentista",
  "Sales Manager",
  "Marketing & Contenuti",
  "Social Media Manager",
  "Media Buyer",
  "Videomaker",
  "Frontman",
  "Funnel Strategist",
  "Project Manager",
  "Developer",
  "AI Expert",
  "Altro",
] as const;

export type Ruolo = (typeof RUOLI)[number];
