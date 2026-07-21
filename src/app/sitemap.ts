import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Solo pagine pubbliche indicizzabili.
// Escluse di proposito le riservate noindex: /analisi-prezzi, /grazie.
const routes = [
  "",
  "/preventivatore",
  "/computatore",
  "/edilchat",
  "/come-funziona",
  "/calcola",
  "/demo",
  "/integrazioni",
  "/confronto",
  "/prezzo",
  "/sicurezza",
  "/risorse",
  "/guide",
  "/chi-siamo",
  "/lavora-con-noi",
  "/faq",
  "/contatti",
  "/privacy",
  "/cookie",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.match(/preventivatore|computatore|demo|calcola/) ? 0.8 : 0.6,
  }));
}
