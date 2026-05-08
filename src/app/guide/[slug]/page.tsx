import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GuideForm from "./GuideForm";
import { ArrowLeft, BookOpen, Clock, Star } from "lucide-react";

interface GuideMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  topic: string;
  cover_image?: string;
  created_at: string;
  published: boolean;
}

async function fetchGuide(slug: string): Promise<GuideMeta | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(
      `https://api.github.com/repos/cantierihub/cantierihub-guide/contents/public/guide/${slug}.json`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data: GuideMeta = await res.json();
    if (!data.published) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const guide = await fetchGuide(slug);
  if (!guide) return { title: "Guida non trovata — Cantieri Hub" };
  return {
    title: `${guide.title} — Guida Gratuita | Cantieri Hub`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.cover_image ? [guide.cover_image] : [],
    },
  };
}

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const guide = await fetchGuide(slug);
  if (!guide) notFound();

  const baseUrl = process.env.GUIDE_HTML_BASE_URL ?? "https://cantierihub-guide.vercel.app";
  const htmlUrl = `${baseUrl}/guide/${slug}.html`;

  const date = new Date(guide.created_at).toLocaleDateString("it-IT", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      {/* Hero */}
      <section style={{
        background: "#0f172a",
        padding: "clamp(80px, 10vw, 140px) 0 clamp(64px, 8vw, 100px)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Orange glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: -80, right: -60, width: 520, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: -60, left: -40, width: 380, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
          {/* Back link */}
          <Link href="/guide" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "#64748b", textDecoration: "none",
            marginBottom: 32, transition: "color 120ms",
          }}>
            <ArrowLeft size={14} /> Tutte le guide
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 999, padding: "4px 12px", marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fb923c", letterSpacing: "0.04em" }}>
                  GUIDA GRATUITA
                </span>
              </div>

              <h1 className="font-display font-extrabold" style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "#fff", lineHeight: 1.1,
                letterSpacing: "-0.02em", margin: "0 0 16px",
              }}>
                {guide.title}
              </h1>

              <p style={{ fontSize: "clamp(16px, 1.3vw, 18px)", color: "#94a3b8", lineHeight: 1.65, marginBottom: 28 }}>
                {guide.subtitle}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 13, color: "#64748b" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BookOpen size={14} color="#f97316" /> Guida completa
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={14} color="#f97316" /> 5 minuti di lettura
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Star size={14} color="#f97316" /> Gratuita
                </span>
              </div>
            </div>

            {/* Right: form card */}
            <div style={{
              background: "#fff",
              borderRadius: 20,
              padding: "clamp(24px, 4vw, 36px)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)",
            }}>
              <GuideForm slug={slug} title={guide.title} htmlUrl={htmlUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.055) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div className="container-main" style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: "#0f172a", marginBottom: 16 }}>
            Cosa troverai in questa guida
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75 }}>
            {guide.description}
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 32 }}>
            Pubblicata il {date} · Cantieri Hub Network
          </p>
        </div>
      </section>
    </>
  );
}