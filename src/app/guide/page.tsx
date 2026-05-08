import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide Gratuite per Imprese Edili — Cantieri Hub",
  description: "Scarica le guide pratiche di Cantieri Hub: preventivi, computo metrico, gestione cantieri e molto altro. Gratis.",
};

interface GuideMeta {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  cover_image?: string;
  created_at: string;
  published: boolean;
}

async function fetchAllGuides(): Promise<GuideMeta[]> {
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

    return guides
      .filter((g): g is GuideMeta => g !== null && g.published)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch {
    return [];
  }
}

export default async function GuidePage() {
  const guides = await fetchAllGuides();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 bg-white overflow-hidden">
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.065) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: -80, right: -60, width: 480, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)", filter: "blur(48px)", pointerEvents: "none" }} />
        <div className="container-main relative z-10">
          <div className="max-w-2xl">
            <span className="pill">
              <span className="pill__dot" />
              Risorse gratuite
            </span>
            <h1 className="mt-5 font-display font-extrabold text-navy leading-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>
              Guide pratiche per{" "}
              <em className="not-italic text-orange-500">imprenditori edili.</em>
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Ogni guida nasce da una domanda reale dei nostri clienti. Scaricale gratis — niente abbonamenti, niente spam.
            </p>
          </div>
        </div>
      </section>

      {/* Guide grid */}
      <section style={{ background: "#f8fafc", padding: "clamp(48px, 7vw, 80px) 0" }}>
        <div className="container-main">
          {guides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <BookOpen size={40} color="#cbd5e1" style={{ margin: "0 auto 16px", display: "block" }} />
              <p style={{ color: "#94a3b8", fontSize: 16 }}>
                Le prime guide sono in arrivo. Torna presto!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  style={{ textDecoration: "none" }}
                  className="group"
                >
                  <div style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "border-color 150ms, box-shadow 150ms",
                    boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
                  }}
                    className="guide-card"
                  >
                    {/* Cover */}
                    <div style={{
                      height: 160,
                      background: g.cover_image
                        ? `url(${g.cover_image}) center/cover`
                        : "linear-gradient(135deg, #0f172a 0%, #1e2d45 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {!g.cover_image && (
                        <BookOpen size={32} color="rgba(249,115,22,0.7)" />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                        color: "#f97316", textTransform: "uppercase", marginBottom: 8,
                      }}>
                        {g.topic ?? "Guida"}
                      </span>
                      <h2 className="font-display font-bold" style={{
                        fontSize: 17, color: "#0f172a", margin: "0 0 8px",
                        lineHeight: 1.3, letterSpacing: "-0.01em",
                      }}>
                        {g.title}
                      </h2>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55, flex: 1, margin: 0 }}>
                        {g.subtitle}
                      </p>
                      <div style={{
                        marginTop: 16, display: "flex", alignItems: "center",
                        gap: 6, fontSize: 13, fontWeight: 600, color: "#f97316",
                      }}>
                        Scarica gratis <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <style>{`
        .guide-card:hover {
          border-color: rgba(249,115,22,0.4) !important;
          box-shadow: 0 8px 24px rgba(249,115,22,0.10) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}