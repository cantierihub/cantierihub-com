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
    <section style={{ background: "#0f172a", padding: "clamp(64px, 9vw, 120px) 0", marginTop: "clamp(64px, 9vw, 120px)" }}>
      <div className="container-main">
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
                <div className="problem-card" style={{ borderRadius: 14, padding: 28 }}>
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