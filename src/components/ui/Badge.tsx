import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "orange" | "navy" | "gray";
  dot?: boolean;
}

const variants = {
  orange: "bg-orange-50 text-orange-600 border border-orange-200",
  navy: "bg-navy/5 text-navy border border-navy/10",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function Badge({ children, variant = "orange", dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      )}
      {children}
    </span>
  );
}