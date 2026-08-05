import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Problem from "@/components/sections/Problem";
import Network from "@/components/sections/Network";
import Products from "@/components/sections/Products";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Problem />
      <Network />
      <Products />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      {/* Come il pulsante dell'Hero: passa dalla pagina contatti invece di andare dritto
          a WhatsApp, così chi compila entra nel CRM con prodotto, esigenza e canale.
          Il valore è esplicito qui e non nel componente: le altre pagine che usano
          CTASection continuano ad andare su WhatsApp, e cambiarle è una decisione a parte. */}
      <CTASection primaryHref="/contatti" />
    </>
  );
}