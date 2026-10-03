import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import CatturaProvenienza from "@/components/ui/CatturaProvenienza";
import TracciamentoSalesflow from "@/components/ui/TracciamentoSalesflow";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Software con Intelligenza Artificiale per Imprese Edili",
    template: "%s | Cantieri Hub",
  },
  description:
    "Software con intelligenza artificiale per imprese edili italiane: computi metrici, preventivi, analisi prezzi e assistente normativo in pochi minuti.",
  keywords: [
    "intelligenza artificiale edilizia",
    "intelligenza artificiale cantieri",
    "software imprese edili",
    "preventivi edili",
    "computo metrico",
    "analisi prezzi",
    "prezzari regionali",
    "AI edilizia",
  ],
  authors: [{ name: "Cantieri Hub" }],
  creator: "Cantieri Hub",
  metadataBase: new URL("https://cantierihub.com"),
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://cantierihub.com",
    siteName: "Cantieri Hub",
    title: "Software con Intelligenza Artificiale per Imprese Edili",
    description:
      "Computi metrici, preventivi, analisi prezzi e assistente normativo. L'intelligenza artificiale al servizio delle imprese edili italiane.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software con Intelligenza Artificiale per Imprese Edili",
    description:
      "Computi metrici, preventivi e analisi prezzi per imprese edili italiane.",
  },
  // Niente `robots: index, follow` qui: è già il comportamento normale, e dichiararlo nel layout lo faceva comparire
  // anche nella pagina 404 accanto al `noindex` che Next aggiunge da solo (due istruzioni in contraddizione,
  // audit SEO del 01/10/2026). Le pagine che non vanno indicizzate lo dicono da sole.
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy-800 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Organization + WebSite (audit SEO 01/10/2026): per Google e per le AI l'entità «Cantieri Hub» deve
            // essere una sola, con i suoi profili veri (sameAs). Profili verificati il 02/10.
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://cantierihub.com/#organizzazione",
                name: "Cantieri Hub",
                url: "https://cantierihub.com",
                logo: "https://cantierihub.com/images/logo-color.png",
                description:
                  "Software con intelligenza artificiale per imprese edili italiane: computi metrici, preventivi, analisi prezzi e assistente normativo.",
                areaServed: "IT",
                foundingDate: "2025",
                email: "info@cantierihub.com",
                sameAs: ["https://www.youtube.com/@CantieriHub", "https://www.instagram.com/cantierihub/"],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://cantierihub.com/#sito",
                name: "Cantieri Hub",
                url: "https://cantierihub.com",
                inLanguage: "it-IT",
                publisher: { "@id": "https://cantierihub.com/#organizzazione" },
              },
            ]),
          }}
        />
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <CookieBanner />
        <CatturaProvenienza />
        <TracciamentoSalesflow />
        <Analytics />
      </body>
    </html>
  );
}