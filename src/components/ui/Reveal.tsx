"use client";

import { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  direction?: "up" | "left" | "right" | "none";
  distance?: number;
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  direction = "up",
  distance = 16,
}: RevealProps) {
  const initial = {
    opacity: 0,
    y: direction === "up" ? distance : 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout={false}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}