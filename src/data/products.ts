import type { ElementType } from "react";
import { FileText, Calculator } from "lucide-react";

export interface Product {
  icon: ElementType;
  badge: string;
  name: string;
  nameAccent: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  variant: "orange" | "navy";
}

// I due prodotti mostrati nella sezione Products della home.
export const products: Product[] = [
  {
    icon: FileText,
    badge: "Prodotto principale",
    name: "Preventivatore",
    nameAccent: "AI",
    tagline: "Dal computo metrico al preventivo in 3 minuti.",
    description:
      "Carica il file del committente. L'AI estrae ogni voce, la abbina ai prezzari regionali e genera un preventivo PDF professionale con il tuo logo.",
    features: [
      "Estrazione AI da PDF, Excel e XML",
      "Matching su prezzari regionali + interno aziendale",
      "Analisi Prezzi AI per voci fuori prezzario",
      "PDF e Excel brandizzati col tuo logo",
      "Archivio storico ricercabile",
    ],
    href: "/preventivatore",
    variant: "orange",
  },
  {
    icon: Calculator,
    badge: "Nuovo prodotto",
    name: "Computatore",
    nameAccent: "AI",
    tagline: "Genera il computo metrico prima ancora di aprire Excel.",
    description:
      "Descrivi il lavoro, carica le foto del sopralluogo. L'AI costruisce l'intero computo. La chat autocorrettiva controlla che non manchi nulla.",
    features: [
      "Da zero con descrizione + foto di sopralluogo",
      "Estrazione da capitolati PDF/Excel",
      "Stima quantità dalle piantine architettoniche",
      "Chat AI autocorrettiva integrata",
      "Export diretto al Preventivatore AI",
    ],
    href: "/computatore",
    variant: "navy",
  },
];
