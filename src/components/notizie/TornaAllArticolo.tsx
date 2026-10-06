"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+){1,12}$/;

/** Lo slug dell'articolo da `?da=` nell'indirizzo, se è uno slug vero. Sul server non c'è: stringa vuota. */
export function useArticoloDiProvenienza(): string {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const da = new URLSearchParams(window.location.search).get("da") ?? "";
      return SLUG.test(da) ? da : "";
    },
    () => "",
  );
}

/**
 * «Torna all'articolo»: compare solo se nell'indirizzo c'è `?da=<slug>`, cioè se chi legge arriva dal blocco in fondo
 * a una notizia. Si legge nel browser, così le pagine restano statiche.
 */
export default function TornaAllArticolo({ className = "" }: { className?: string }) {
  const articolo = useArticoloDiProvenienza();
  if (!articolo) return null;
  return (
    <Link href={`/notizie/${articolo}`} className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy hover:text-orange-700 ${className}`}>
      <ArrowLeft size={16} aria-hidden="true" /> Torna all&apos;articolo
    </Link>
  );
}
