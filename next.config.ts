import type { NextConfig } from "next";

/**
 * Link corti per le bio dei social: cantierihub.com/ig, /fb, /tt, /yt.
 *
 * In bio si legge un indirizzo pulito, gli UTM li applica il redirect. Il dato
 * che arriva alle analytics è identico a quello di un link scritto per esteso.
 *
 * ⚠️ Il motivo vero per cui esistono: cambiando CAMPAGNA_BIO qui sotto si
 * aggiornano tutti e quattro i profili in una volta. Senza, ogni mese bisogna
 * rientrare a mano su Instagram, Facebook, TikTok e YouTube.
 *
 * Convenzione degli UTM: vault, `Social/MD/Linee guida copy — SEO & GEO.md`.
 * Link in uso e stato: vault, `Social/Link UTM.md`.
 */
const MESE_BIO = "ago26";

const BIO_SOCIAL: Record<string, string> = {
  ig: "instagram",
  fb: "facebook",
  tt: "tiktok",
  yt: "youtube",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(BIO_SOCIAL).map(([scorciatoia, social]) => ({
        source: `/${scorciatoia}`,
        // Il canale sta anche dentro il nome della campagna, non solo in utm_source.
        // Verificato il 30/07 su un contatto reale in Salesflow: la campagna arriva,
        // la sorgente resta «Direct traffic». Con la sola campagna, quattro link che
        // differiscono solo per utm_source diventerebbero indistinguibili nel CRM.
        destination: `/?utm_source=${social}&utm_medium=bio&utm_campaign=bio-${scorciatoia}-${MESE_BIO}`,
        // Temporaneo di proposito. Un redirect permanente finisce nella cache
        // del browser e non se ne va più: al cambio di campagna chi ha già
        // cliccato continuerebbe ad arrivare su quella vecchia, in silenzio.
        permanent: false,
      })),
      {
        // I contenuti sul prezzo vivono nelle FAQ dal 28/07/2026.
        // Redirect permanente e non semplice cancellazione: /prezzo era
        // indicizzata, in sitemap e linkata da navbar e footer.
        source: "/prezzo",
        destination: "/faq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
