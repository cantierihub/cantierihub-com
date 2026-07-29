"use client";

import { useEffect } from "react";
import { catturaProvenienza } from "@/lib/provenienza";

/**
 * Registra la provenienza all'arrivo sul sito. Non disegna niente.
 *
 * Gira una volta sola per caricamento di pagina, ed è quello che serve: il momento
 * utile è l'atterraggio, quando gli UTM sono ancora nell'URL. Le navigazioni successive
 * non devono sovrascrivere niente (vale il first-touch).
 *
 * Di proposito NON usa `useSearchParams`: obbligherebbe a un Suspense attorno e a
 * rendere dinamiche pagine che oggi sono statiche. I parametri li leggiamo da
 * `window.location` dentro l'effetto, che a quel punto gira solo nel browser.
 */
export default function CatturaProvenienza() {
  useEffect(() => {
    catturaProvenienza();
  }, []);

  return null;
}
