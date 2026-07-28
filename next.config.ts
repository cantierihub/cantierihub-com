import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
