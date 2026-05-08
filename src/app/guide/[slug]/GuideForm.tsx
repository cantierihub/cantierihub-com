"use client";

import { useState } from "react";
import { ArrowRight, Download, CheckCircle } from "lucide-react";

interface GuideFormProps {
  slug: string;
  title: string;
  htmlUrl: string;
}

export default function GuideForm({ slug, title, htmlUrl }: GuideFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      await fetch("/api/guide-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug, title }),
      });
      setDone(true);
    } catch {
      setError("Qualcosa è andato storto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(16,185,129,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <CheckCircle size={26} color="#10b981" />
        </div>
        <p className="font-display font-bold" style={{ fontSize: 18, color: "#0f172a", margin: "0 0 8px" }}>
          Guida sbloccata!
        </p>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
          Clicca il pulsante per aprire la guida completa.
        </p>
        <a
          href={htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary cta-shimmer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <Download size={17} />
          Apri la guida gratuita
        </a>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
          Si apre in una nuova scheda · Gratuita · Nessun impegno
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-display font-bold" style={{ fontSize: 18, color: "#0f172a", margin: "0 0 6px" }}>
        Scarica la guida gratuita
      </p>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.5 }}>
        Inserisci la tua email e accedi subito alla guida completa.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tua@email.com"
          style={{
            width: "100%", padding: "12px 16px",
            border: "1.5px solid #e2e8f0", borderRadius: 9,
            fontSize: 15, color: "#0f172a",
            outline: "none", boxSizing: "border-box",
            transition: "border-color 120ms",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#f97316")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        {error && <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary cta-shimmer"
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Accesso in corso…" : (
            <>Accedi alla guida <ArrowRight size={16} className="arrow" /></>
          )}
        </button>
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
        Gratuita. Zero spam. Leggi la nostra{" "}
        <a href="/privacy" style={{ color: "#f97316", textDecoration: "none" }}>Privacy Policy</a>.
      </p>
    </form>
  );
}