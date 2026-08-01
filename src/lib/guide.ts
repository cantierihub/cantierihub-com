// Le guide vivono nel repo cantierihub/cantierihub-guide, non qui:
// l'elenco si legge a runtime dalle API di GitHub.
// Usato sia da /guide (la pagina indice) sia dalla sitemap.

export interface GuideMeta {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  cover_image?: string;
  created_at: string;
  published: boolean;
}

export async function fetchAllGuides(): Promise<GuideMeta[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(
      "https://api.github.com/repos/cantierihub/cantierihub-guide/contents/public/guide",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];
    const files: Array<{ name: string; download_url: string }> = await res.json();
    const jsonFiles = files.filter((f) => f.name.endsWith(".json"));

    const guides = await Promise.all(
      jsonFiles.map(async (f) => {
        try {
          const r = await fetch(f.download_url, { next: { revalidate: 1800 } });
          return r.ok ? (r.json() as Promise<GuideMeta>) : null;
        } catch {
          return null;
        }
      })
    );

    const pubblicate = guides
      .filter((g): g is GuideMeta => g !== null && g.published)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Piu' file JSON possono dichiarare lo stesso slug: puntano alla stessa
    // pagina, quindi si tiene solo la piu' recente. Senza questo l'indice
    // mostrava la guida due volte e la sitemap conteneva un URL duplicato.
    const visti = new Set<string>();
    return pubblicate.filter((g) => {
      if (visti.has(g.slug)) return false;
      visti.add(g.slug);
      return true;
    });
  } catch {
    return [];
  }
}
