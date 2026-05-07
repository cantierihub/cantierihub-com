import Link from "next/link";

const prodotti = [
  { label: "Preventivatore AI", href: "/preventivatore" },
  { label: "Computatore AI", href: "/computatore" },
];

const azienda = [
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contatti", href: "/contatti" },
];

const legale = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookie" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0f172a", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Gradient top border */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.4) 30%, rgba(249,115,22,0.6) 50%, rgba(249,115,22,0.4) 70%, transparent 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: -120, right: -80,
          width: 500, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-main" style={{ paddingTop: 80, paddingBottom: 52, position: "relative" }}>

        {/* Grid: 5 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1.4fr",
            gap: "48px 32px",
            marginBottom: 56,
          }}
          className="grid-footer"
        >
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#1e293b" />
                <path d="M6 16h4M22 16h4M16 6v4M16 22v4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="4" fill="#f97316" />
                <path d="M10 10l3 3M19 19l3 3M10 22l3-3M19 13l3-3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                className="font-display font-bold"
                style={{ fontSize: 18, color: "#fff" }}
              >
                Cantieri<span style={{ color: "#f97316" }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 260 }}>
              Software AI per imprese edili italiane. Dal computo metrico al preventivo professionale, in pochi minuti.
            </p>
            <p style={{ marginTop: 20, fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
              Adact Studio International LLC<br />
              13057 Park Blvd, Seminole FL 33776, USA
            </p>
          </div>

          {/* Prodotti */}
          <div>
            <h4
              className="eyebrow"
              style={{ color: "#475569", marginBottom: 16 }}
            >
              Prodotti
            </h4>
            <ul style={{ display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
              {prodotti.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{ fontSize: 14, color: "#94a3b8", transition: "color 120ms" }}
                    className="footer-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h4 className="eyebrow" style={{ color: "#475569", marginBottom: 16 }}>
              Azienda
            </h4>
            <ul style={{ display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
              {azienda.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{ fontSize: 14, color: "#94a3b8", transition: "color 120ms" }}
                    className="footer-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legale */}
          <div>
            <h4 className="eyebrow" style={{ color: "#475569", marginBottom: 16 }}>
              Legale
            </h4>
            <ul style={{ display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
              {legale.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{ fontSize: 14, color: "#94a3b8", transition: "color 120ms" }}
                    className="footer-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA col */}
          <div>
            <h4 className="eyebrow" style={{ color: "#475569", marginBottom: 16 }}>
              Inizia adesso
            </h4>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 20 }}>
              30 minuti di demo gratuita. Vedi come funziona con i tuoi file reali.
            </p>
            <Link
              href="/contatti"
              className="btn-primary cta-shimmer"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Prenota Demo <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "#334155" }}>
            © {new Date().getFullYear()} Cantieri Hub — Adact Studio International LLC.
          </p>
          <p style={{ fontSize: 12, color: "#334155" }}>
            Fatto con cura in Italia 🇮🇹
          </p>
        </div>
      </div>

      {/* Responsive style for footer grid */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-footer { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .grid-footer { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}