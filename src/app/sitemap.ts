import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { CATEGORIE, notizieDellaCategoria, tutteLeNotizie } from "@/lib/notizie";

// Solo pagine pubbliche indicizzabili.
// Escluse di proposito le riservate noindex: /grazie.
// /prezzo non esiste piu': fa redirect 301 su /faq (vedi next.config.ts).
const pagine = [
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
  "/notizie",
  "/chi-siamo",
  "/lavora-con-noi",
  "/faq",
  "/contatti",
  "/privacy",
  "/cookie",
  "/ai-trasparenza",
];

// La data di modifica si dichiara solo quando è vera (01/10/2026, audit SEO). Prima ogni pagina aveva `new Date()`,
// cioè la data dell'ultimo deploy uguale per tutte: Google la riconosce come falsa e smette di fidarsene, anche per
// le pagine dove sarebbe utile. Le pagine fisse quindi non la dichiarano; gli articoli dichiarano il loro ultimo
// aggiornamento, le categorie quello dell'articolo più recente.

interface Guida {
  slug: string;
  created_at: string;
  published: boolean;
}

// Le guide vivono nel repo cantierihub-guide e nascono da sole: un elenco scritto a mano le perdeva tutte.
async function guidePubblicate(): Promise<Guida[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch("https://api.github.com/repos/cantierihub/cantierihub-guide/contents/public/guide", {
      headers: { Accept: "application/vnd.github.v3+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const file: Array<{ name: string; download_url: string }> = await res.json();
    const guide = await Promise.all(
      file
        .filter((f) => f.name.endsWith(".json"))
        .map(async (f) => {
          try {
            const r = await fetch(f.download_url, { next: { revalidate: 3600 } });
            return r.ok ? ((await r.json()) as Guida) : null;
          } catch {
            return null;
          }
        }),
    );
    return guide.filter((g): g is Guida => !!g && g.published);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notizie = tutteLeNotizie();
  const guide = await guidePubblicate();

  const fisse: MetadataRoute.Sitemap = pagine.map((path) => ({
    url: `${SITE_URL}${path}`,
    ...(path === "/notizie" && notizie[0] ? { lastModified: notizie[0].dataAggiornamento } : {}),
  }));
  const categorie: MetadataRoute.Sitemap = CATEGORIE.map((c) => {
    const ultima = notizieDellaCategoria(c.slug)[0];
    return { url: `${SITE_URL}/notizie/${c.slug}`, ...(ultima ? { lastModified: ultima.dataAggiornamento } : {}) };
  });
  const articoli: MetadataRoute.Sitemap = notizie.map((n) => ({
    url: `${SITE_URL}/notizie/${n.slug}`,
    lastModified: n.dataAggiornamento,
  }));
  const pagineGuide: MetadataRoute.Sitemap = guide.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: g.created_at.slice(0, 10),
  }));

  return [...fisse, ...categorie, ...articoli, ...pagineGuide];
}
