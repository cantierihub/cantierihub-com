import { NextRequest, NextResponse } from "next/server";
import { eUsaEGetta } from "@/lib/emailUsaEGetta";

export async function POST(req: NextRequest) {
  try {
    const { email, nome, cognome, slug, title, company_url, provenienza, utm } = await req.json();

    // honeypot: se compilato è un bot → scarta silenziosamente
    if (typeof company_url === "string" && company_url.trim()) {
      return NextResponse.json({ ok: true });
    }

    if (!email || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Il controllo c'e' anche nel modulo, ma quello si aggira: la richiesta arriva
    // dal browser e chiunque puo' rifarla a mano. La porta vera e' questa.
    if (eUsaEGetta(email)) {
      return NextResponse.json({ error: "Disposable email" }, { status: 400 });
    }

    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (!token) console.error("[guide-lead] NOTION_TOKEN mancante");
    if (!dbId)  console.error("[guide-lead] NOTION_LEADS_DB_ID mancante");

    // Il canale, in forma strutturata. `utm` e' la fonte buona: la stringa `provenienza`
    // e' prosa per un occhio umano, e a chi deve smistare i lead serve il valore secco.
    // Se `utm` manca (versione vecchia del modulo in cache) si ripiega sulla prosa.
    const canale = String(utm?.source ?? "").trim().slice(0, 80);
    const mezzo = String(utm?.medium ?? "").trim().slice(0, 80);
    const campagna = String(utm?.campagna ?? "").trim().slice(0, 80);
    const prosa = String(provenienza ?? "").trim().slice(0, 300);
    // Nome e cognome vanno a Salesflow attraverso i campi del modulo, che e' dove
    // servono (intitolano il cartellino). Su Notion il database non ha una colonna
    // per il nome, quindi si accodano qui invece di inventare una proprieta' nuova:
    // scrivere su una proprieta' che non esiste farebbe fallire l'intera riga.
    const chi = [String(nome ?? "").trim(), String(cognome ?? "").trim()]
      .filter(Boolean).join(" ").slice(0, 80);
    const descrizione = (canale
      ? `canale: ${canale}${mezzo ? ` (${mezzo})` : ""}${campagna ? ` · campagna: ${campagna}` : ""}`
      : prosa) || "non rilevata";
    const descrizioneCompleta = chi ? `${chi} · ${descrizione}` : descrizione;

    if (token && dbId) {
      const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: dbId },
          properties: {
            Email: { email },
            Guida: { title: [{ text: { content: title ?? slug } }] },
            Slug:  { rich_text: [{ text: { content: slug } }] },
            // Arriva dal browser, quindi si tronca: nessuno ci infila dentro un romanzo.
            Provenienza: { rich_text: [{ text: { content: descrizioneCompleta } }] },
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("[guide-lead] Notion error:", JSON.stringify(err));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[guide-lead] Exception:", err);
    return NextResponse.json({ ok: true });
  }
}