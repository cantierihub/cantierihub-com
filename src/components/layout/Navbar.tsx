"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Preventivatore AI", href: "/preventivatore" },
  { label: "Computatore AI", href: "/computatore" },
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contatti", href: "/contatti" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
        transition: "border-color 180ms, background 180ms",
      }}
    >
      <div className="container-main" style={{ display: "flex", alignItems: "center", gap: 32, height: 72 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#0f172a" />
            <path d="M6 16h4M22 16h4M16 6v4M16 22v4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="16" r="4" fill="#f97316" />
            <path d="M10 10l3 3M19 19l3 3M10 22l3-3M19 13l3-3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-display font-bold" style={{ fontSize: 18, color: "#0f172a" }}>
            Cantieri<span style={{ color: "#f97316" }}>Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" style={{ marginLeft: "auto" }}>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative", padding: "8px 14px", fontSize: 14,
                  fontWeight: 500, borderRadius: 8, textDecoration: "none",
                  color: active ? "#f97316" : "#475569",
                  transition: "color 120ms, background 120ms",
                }}
              >
                {link.label}
                {active && (
                  <span style={{ position: "absolute", bottom: 4, left: 14, right: 14, height: 2, borderRadius: 9999, background: "#f97316" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2" style={{ marginLeft: 8 }}>
          <Link href="/contatti" className="btn-ghost btn-sm">
            WhatsApp
          </Link>
          <Link href="/contatti" className="btn-primary btn-sm cta-shimmer">
            Prenota Demo
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden"
          style={{ marginLeft: "auto", padding: 8, color: "#475569" }}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", overflow: "hidden" }}
          >
            <div className="container-main" style={{ paddingTop: 16, paddingBottom: 24, display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                    textDecoration: "none",
                    color: pathname === link.href ? "#f97316" : "#475569",
                    background: pathname === link.href ? "#fff7ed" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/contatti" className="btn-ghost" style={{ justifyContent: "center" }}>WhatsApp</Link>
                <Link href="/contatti" className="btn-primary cta-shimmer" style={{ justifyContent: "center" }}>Prenota Demo</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}