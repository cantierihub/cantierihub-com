import { NextRequest, NextResponse } from "next/server";
import { archivioBlobConfigurato, pulisciArchivio } from "@/lib/prova/archivioBlob";

// La pulizia dell'archivio della prova (08/10/2026): la chiama ogni notte il cron di Vercel (vercel.json), che manda
// `Authorization: Bearer <CRON_SECRET>`. Toglie le schede scadute, così la privacy dice il vero: connessione 30 giorni,
// contatto un anno, analisi salvate 30 giorni. Senza CRON_SECRET non risponde a nessuno.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const segreto = process.env.CRON_SECRET;
  if (!segreto || req.headers.get("authorization") !== `Bearer ${segreto}`) return NextResponse.json({ ok: false }, { status: 401 });
  if (!archivioBlobConfigurato()) return NextResponse.json({ ok: false, motivo: "archivio assente" }, { status: 503 });
  const esito = await pulisciArchivio(Date.now());
  console.log("[prova] pulizia:", esito);
  return NextResponse.json({ ok: true, ...esito });
}
