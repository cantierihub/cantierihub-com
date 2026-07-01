import Link from "next/link";
import Image from "next/image";
import { WA_DEMO } from "@/data/site";

const linkGroups = [
  {
    title: "Prodotti",
    links: [
      { label: "Preventivatore AI", href: "/preventivatore" },
      { label: "Computatore AI", href: "/computatore" },
      { label: "Integrazioni", href: "/integrazioni" },
      { label: "Confronto", href: "/confronto" },
      { label: "Prezzo", href: "/prezzo" },
      { label: "Sicurezza", href: "/sicurezza" },
    ],
  },
  {
    title: "Risorse",
    links: [
      { label: "Come funziona", href: "/come-funziona" },
      { label: "Calcola preventivo", href: "/calcola" },
      { label: "Prenota una demo", href: "/demo" },
      { label: "Guide gratuite", href: "/guide" },
      { label: "Risorse", href: "/risorse" },
    ],
  },
  {
    title: "Azienda",
    links: [
      { label: "Chi Siamo", href: "/chi-siamo" },
      { label: "Lavora con noi", href: "/lavora-con-noi" },
      { label: "FAQ", href: "/faq" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookie" },
    ],
  },
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

        {/* Grid: brand + 4 gruppi link + CTA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.7fr 1fr 1fr 1fr 0.9fr 1.3fr",
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
                  sizes="150px"
                  style={{ objectFit: "contain", objectPosition: "left", filter: "brightness(0) invert(1)" }}
                />
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 260 }}>
              Software AI per imprese edili italiane. Dal computo metrico al preventivo professionale, in pochi minuti.
            </p>
          </div>

          {/* Gruppi link */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="eyebrow" style={{ color: "#94a3b8", marginBottom: 16 }}>
                {group.title}
              </h4>
              <ul style={{ display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA col */}
          <div>
            <h4 className="eyebrow" style={{ color: "#94a3b8", marginBottom: 16 }}>
              Inizia adesso
            </h4>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.65, marginBottom: 20 }}>
              30 minuti di demo gratuita. Vedi come funziona con i tuoi file reali.
            </p>
            <a
              href={WA_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary cta-shimmer"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Prenota Demo <span className="arrow">→</span>
            </a>
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
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            © {new Date().getFullYear()} Cantieri Hub. Tutti i diritti riservati.
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
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
          .grid-footer { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .grid-footer { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
