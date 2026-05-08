import Link from "next/link";
import Image from "next/image";

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
            <div style={{ marginBottom: 16 }}>
              <div style={{ position: "relative", width: "clamp(120px, 22vw, 150px)", height: 38 }}>
                <Image
                  src="/images/logo.png"
                  alt="Cantieri Hub"
                  fill
                  style={{ objectFit: "contain", objectPosition: "left", filter: "brightness(0) invert(1)" }}
                />
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 260 }}>
              Software AI per imprese edili italiane. Dal computo metrico al preventivo professionale, in pochi minuti.
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
            © {new Date().getFullYear()} Cantieri Hub. Tutti i diritti riservati.
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