"use client";

import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "50+", label: "Imprese Attive" },
  { value: "3 Min", label: "per Preventivo" },
  { value: "€500K+", label: "Risparmiati in Tempi" },
  { value: "60%", label: "Uso Quotidiano" },
];

export default function Stats() {
  return (
    <section className="bg-navy py-14">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="text-center">
                <p className="font-display font-extrabold text-white text-4xl md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 eyebrow text-gray-400">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
