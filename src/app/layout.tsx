import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import CookieBanner from "@/components/ui/CookieBanner";

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
    default: "Cantieri Hub — Software AI per Preventivi Edili",
    template: "%s | Cantieri Hub",
  },
  description:
    "Il software AI per imprese edili italiane. Dal computo metrico al preventivo professionale in 3 minuti. Prezzari regionali, PDF brandizzati, Analisi Prezzi AI.",
  keywords: [
    "preventivi edili",
    "software preventivi",
    "computo metrico",
    "AI edilizia",
    "prezzari regionali",
    "preventivatore edile",
    "software imprese edili",
  ],
  authors: [{ name: "Cantieri Hub" }],
  creator: "Cantieri Hub",
  metadataBase: new URL("https://cantierihub.com"),
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://cantierihub.com",
    siteName: "Cantieri Hub",
    title: "Cantieri Hub — Software AI per Preventivi Edili",
    description:
      "Dal computo metrico al preventivo in 3 minuti. Il software AI per imprese edili italiane.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cantieri Hub — Software AI per Preventivi Edili",
    description: "Dal computo metrico al preventivo in 3 minuti.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy-800 font-sans">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}