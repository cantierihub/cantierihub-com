export interface Stat {
  value: string;
  label: string;
  accent?: boolean;
}

// Statistiche mostrate nella barra sotto l'hero della home.
export const stats: Stat[] = [
  { value: "50+", label: "Imprese nel network" },
  { value: "~3 min", label: "Per ogni preventivo", accent: true },
  { value: "+15%", label: "Margine medio per cantiere", accent: true },
  { value: "2025", label: "Anno di fondazione" },
];
