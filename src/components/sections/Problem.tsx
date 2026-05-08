import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { Clock, AlertTriangle, TrendingDown, FileX } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Ore perse ogni settimana",
    description: "Tre ore per preventivo, dieci a settimana. Tempo che togli a famiglia, cantieri, sopralluoghi.",
  },
  {
    icon: AlertTriangle,
    title: "Errori di trascrizione",
    description: "Una virgola spostata, un prezzo vecchio, e il margine svanisce. Sempre.",
  },
  {
    icon: TrendingDown,
    title: "Margini che si assottigliano",
    description: "Senza analisi prezzi seria, lavori per costare. Non per guadagnare.",
  },
  {
    icon: FileX,
    title: "Documenti non professionali",
    description: "Excel storto, logo sbiadito, voci confuse. Il committente sceglie il preventivo che capisce.",
  },
];

export default function Problem() {
  return (
    <section style={{ background: "#0f172a", padding: "clamp(64px, 9vw, 120px) 0", marginTop: "clamp(64px, 9vw, 120px)", position: "relative", overflow: "hidden" }}>

      {/* Background photo */}
      <Image
        src="/images/problem-stressed.png"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.88)" }} />

      {/* Dot grid — white on dark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Orange glow — center */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900, height: 700, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Corner glow — top right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: -120, right: -80,
          width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Corner glow — bottom left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -100, left: -60,
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 700, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ color: "#fb923c" }}>Il problema</span>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: "clamp(32px, 3.8vw, 50px)", color: "#fff", marginTop: 12, letterSpacing: "-0.02em" }}
            >
              Ogni preventivo ti costa ore.
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.3vw, 19px)", color: "#94a3b8", marginTop: 14, lineHeight: 1.6 }}>
              E quelle ore non te le ridà nessuno. Le perdi la sera, il sabato, in pause che non sono pause.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-4">
          {problems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.09}>
                <div className="problem-card" style={{ borderRadius: 14, padding: "clamp(18px, 4vw, 28px)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(249,115,22,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={20} color="#fb923c" />
                  </div>
                  <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#fff", margin: "0 0 8px" }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <p style={{ textAlign: "center", marginTop: 56, fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 600, color: "#fff" }}>
            Cantieri Hub risolve tutto questo.{" "}
            <em style={{ fontStyle: "normal", color: "#fb923c" }}>In 3 minuti per preventivo.</em>
          </p>
        </Reveal>
      </div>
    </section>
  );
}