import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { fetchAllGuides } from "@/lib/guide";

// Solo pagine pubbliche indicizzabili.
// Escluse di proposito le riservate noindex: /grazie.
// /prezzo non esiste piu': fa redirect 301 su /faq (vedi next.config.ts).
const routes = [
  "",
  "/preventivatore",
  "/computatore",
  "/edilchat",
  "/analisi-prezzi",
  "/come-funziona",
  "/calcola",
  "/demo",
  "/integrazioni",
  "/confronto",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statiche: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : // I 4 prodotti Live + le pagine di conversione stanno tutti sullo stesso piano.
          path.match(/preventivatore|computatore|edilchat|analisi-prezzi|demo|calcola/)
          ? 0.8
          : 0.6,
  }));

  // Le singole guide sono rotte dinamiche (/guide/[slug]) alimentate da un altro
  // repo: senza questo blocco Google le raggiunge solo dal link interno su /guide.
  // Se GitHub non risponde, fetchAllGuides torna [] e la sitemap resta quella statica.
  const guide: MetadataRoute.Sitemap = (await fetchAllGuides()).map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: g.created_at ? new Date(g.created_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...statiche, ...guide];
}
