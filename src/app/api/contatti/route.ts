import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { portaNelCrm } from "@/lib/salesflow";
import { articoloValido, ETICHETTA_NOTIZIE, messaggioConArticolo } from "@/lib/funnel";
import { consensoEmailDato, etichettaConsensoEmail } from "@/lib/emailPromozionali";

export const runtime = "nodejs";

const DEST = "info@cantierihub.com";
const FROM = "Sito Cantieri Hub <noreply@app-cantierihub.com>";

/** L'orario ISO scritto dal modulo in `form_inviato_il`, vedi `CampiProvenienza`. */
const ORARIO_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const cognome = String(body.cognome ?? "").trim();
    const azienda = String(body.azienda ?? "").trim();
    const email = String(body.email ?? "").trim();
    const telefono = String(body.telefono ?? "").trim();
    // Funnel delle Notizie (03/10/2026): lo slug dell'articolo da cui arriva, se c'è. Vedi `lib/funnel.ts`.
    const articolo = articoloValido(body.articolo);
    const messaggio = messaggioConArticolo(String(body.messaggio ?? "").trim(), articolo);
    // La casella delle email promozionali (06/10/2026). Vedi `lib/emailPromozionali.ts`.
    const consensoEmail = consensoEmailDato(body.consenso_email);
    const prodotto = String(body.prodotto ?? "").trim().slice(0, 80);
    const motivazione = String(body.motivazione ?? "").trim().slice(0, 120);
    const canale = String(body.canale ?? "").trim().slice(0, 60);
    const company_url = String(body.company_url ?? "").trim();
    // Arriva dal browser, quindi si tronca: nessuno ci infila dentro un romanzo.
    const provenienza = String(body.provenienza ?? "").trim().slice(0, 300);
    // ⚠️ Attenzione ai nomi: `canale` qui sopra e' «come ci ha conosciuti», cioe' il canale
    // DICHIARATO dalla persona. Quello che segue e' il canale MISURATO dagli UTM. Sono due
    // cose diverse e possono non coincidere, quindi non si sovrappongono.
    // Se `utm` manca (versione vecchia del modulo in cache) resta solo la prosa, come prima.
    const utm = body.utm ?? {};
    const utmSource = String(utm.source ?? "").trim().slice(0, 80);
    const utmMedium = String(utm.medium ?? "").trim().slice(0, 80);
    const utmCampagna = String(utm.campagna ?? "").trim().slice(0, 80);
    const canaleTracciato = utmSource
      ? `${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}${utmCampagna ? ` · ${utmCampagna}` : ""}`
      : "";
    // Se manca, per esempio con una versione vecchia del modulo in cache, vale l'ora del server.
    const inviatoIlGrezzo = String(body.inviato_il ?? "").trim();
    const inviatoIl = ORARIO_ISO.test(inviatoIlGrezzo) ? inviatoIlGrezzo : new Date().toISOString();

    // honeypot: se compilato è un bot → scarta silenziosamente
    if (company_url) {
      return NextResponse.json({ ok: true });
    }

    const nomeCompleto = [nome, cognome].filter(Boolean).join(" ");

    if (!nome || !cognome || !email || !telefono || !prodotto || !messaggio) {
      return NextResponse.json({ ok: false, error: "Compila tutti i campi obbligatori." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "L'indirizzo email non sembra valido." }, { status: 400 });
    }

    // ── 1 · il CRM ──
    // Prima di tutto e a prescindere dai cookie: è nel CRM che il lead deve esistere.
    // Se il CRM non risponde si va avanti lo stesso, e l'email a info@ lo segnala.
    const crm = await portaNelCrm({
      nome, cognome, azienda, email, telefono, prodotto, motivazione, canale, messaggio,
      utmSource, utmMedium, utmCampagna, inviatoIl,
      etichetteExtra: [...(articolo ? [ETICHETTA_NOTIZIE] : []), etichettaConsensoEmail(consensoEmail)],
    });
    if (!crm.ok) console.error("[contatti] CRM:", crm.errore);
    // Nell'email a info@ anche il consenso: se il CRM non risponde e il contatto lo crea lo script di Salesflow (o lo
    // inserisce qualcuno a mano), l'etichetta del consenso non c'è, e chi lo sistema deve sapere quale mettere.
    const rigaConsenso = consensoEmail
      ? "sì, ha spuntato la casella (consenso-email)"
      : "no, non ha spuntato la casella (senza-consenso-email)";
    const rigaCrm = crm.ok
      ? "Importato nel CRM (Salesflow)."
      : "ATTENZIONE: non importato nel CRM, va inserito a mano in Salesflow.";

    // ── 2 · l'email a info@ ──
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contatti] RESEND_API_KEY mancante · email non inviata");
      // Se il lead è nel CRM è al sicuro: chi compila non deve vedere un errore.
      if (crm.ok) return NextResponse.json({ ok: true });
      return NextResponse.json(
        { ok: false, fallback: true, error: "Invio momentaneamente non disponibile." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);

    const text = [
      "Nuovo messaggio dal form Contatti di cantierihub.com",
      "",
      `Nome:      ${nomeCompleto}`,
      `Azienda:   ${azienda || "-"}`,
      `Email:     ${email}`,
      `Telefono:  ${telefono || "-"}`,
      `Servizio:  ${prodotto || "-"}`,
      `Esigenza:  ${motivazione || "-"}`,
      `Ci ha conosciuti da: ${canale || "-"}`,
      `Email promozionali: ${rigaConsenso}`,
      "",
      "Messaggio:",
      messaggio,
      "",
      `Canale tracciato: ${canaleTracciato || "non rilevato"}`,
      `Provenienza: ${provenienza || "non rilevata"}`,
      "",
      `CRM: ${rigaCrm}`,
    ].join("\n");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;max-width:560px">
        <h2 style="margin:0 0 4px">Nuovo messaggio dal sito</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px">form Contatti · cantierihub.com</p>
        <table style="border-collapse:collapse;font-size:14px;width:100%">
          <tr><td style="padding:6px 0;color:#64748b;width:110px">Nome</td><td style="padding:6px 0;font-weight:600">${esc(nomeCompleto)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Azienda</td><td style="padding:6px 0">${esc(azienda) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#f97316">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Telefono</td><td style="padding:6px 0">${esc(telefono) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Servizio</td><td style="padding:6px 0;font-weight:600">${esc(prodotto) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Esigenza</td><td style="padding:6px 0">${esc(motivazione) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Ci ha conosciuti da</td><td style="padding:6px 0;font-weight:600">${esc(canale) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email promozionali</td><td style="padding:6px 0">${esc(rigaConsenso)}</td></tr>
        </table>
        <p style="margin:18px 0 6px;color:#64748b;font-size:14px">Messaggio</p>
        <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(messaggio)}</p>
        <p style="margin:22px 0 4px;color:#64748b;font-size:13px">Provenienza</p>
        <p style="margin:0;font-size:13px;color:${provenienza ? "#0f172a" : "#94a3b8"}">${provenienza ? esc(provenienza) : "non rilevata"}</p>
        <p style="margin:22px 0 0;font-size:13px;font-weight:600;color:${crm.ok ? "#16a34a" : "#dc2626"}">${esc(rigaCrm)}</p>
        <p style="margin:22px 0 0;color:#94a3b8;font-size:13px">Rispondi a questa email per scrivere direttamente al contatto.</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: DEST,
      replyTo: email,
      subject: `Nuovo contatto dal sito${articolo ? " (dalle Notizie)" : ""} · ${prodotto || "servizio non indicato"} · ${nomeCompleto}`,
      text,
      html,
    });

    if (error) {
      console.error("[contatti] Resend error:", JSON.stringify(error));
      if (crm.ok) return NextResponse.json({ ok: true });
      return NextResponse.json({ ok: false, fallback: true, error: "Invio non riuscito, riprova." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contatti] Exception:", err);
    return NextResponse.json({ ok: false, fallback: true, error: "Si è verificato un errore inatteso." }, { status: 500 });
  }
}
