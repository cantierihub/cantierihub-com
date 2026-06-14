export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
  color: string;
}

// Testimonianze clienti mostrate nella sezione Testimonials della home.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Prima mi ci voleva mezza giornata per fare un preventivo da un computo metrico. Adesso lo faccio in 10 minuti, PDF incluso. Non tornerei indietro.",
    author: "Marco R.",
    role: "Titolare, impresa edile",
    location: "Milano",
    initials: "MR",
    color: "#0f172a",
  },
  {
    quote:
      "Il WOW moment vero è stato quando ha letto il mio computo da 200 voci e me lo ha abbinato al prezzario in 2 minuti. Roba che prima facevo a mano in 3 ore.",
    author: "Giuseppe L.",
    role: "Geometra",
    location: "Napoli",
    initials: "GL",
    color: "#1e3a5f",
  },
  {
    quote:
      "Finalmente un software edile che capisce come lavoriamo. Semplice, in italiano, e supporto su WhatsApp. Nessun altro lo fa.",
    author: "Antonio M.",
    role: "Titolare, impresa ristrutturazioni",
    location: "Roma",
    initials: "AM",
    color: "#1a2e1a",
  },
];
