import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const DEST = "info@cantierihub.com";
const FROM = "Sito Cantieri Hub <noreply@app-cantierihub.com>";

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const azienda = String(body.azienda ?? "").trim();
    const email = String(body.email ?? "").trim();
    const telefono = String(body.telefono ?? "").trim();
    const messaggio = String(body.messaggio ?? "").trim();
    const company_url = String(body.company_url ?? "").trim();

    // honeypot: se compilato è un bot → scarta silenziosamente
    if (company_url) {
      return NextResponse.json({ ok: true });
    }

    if (!nome || !email || !messaggio) {
      return NextResponse.json({ ok: false, error: "Compila nome, email e messaggio." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "L'indirizzo email non sembra valido." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contatti] RESEND_API_KEY mancante — messaggio non inviato");
      return NextResponse.json(
        { ok: false, fallback: true, error: "Invio momentaneamente non disponibile." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);

    const text = [
      "Nuovo messaggio dal form Contatti di cantierihub.com",
      "",
      `Nome:      ${nome}`,
      `Azienda:   ${azienda || "-"}`,
      `Email:     ${email}`,
      `Telefono:  ${telefono || "-"}`,
      "",
      "Messaggio:",
      messaggio,
    ].join("\n");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;max-width:560px">
        <h2 style="margin:0 0 4px">Nuovo messaggio dal sito</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px">form Contatti — cantierihub.com</p>
        <table style="border-collapse:collapse;font-size:14px;width:100%">
          <tr><td style="padding:6px 0;color:#64748b;width:110px">Nome</td><td style="padding:6px 0;font-weight:600">${esc(nome)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Azienda</td><td style="padding:6px 0">${esc(azienda) || "-"}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#f97316">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Telefono</td><td style="padding:6px 0">${esc(telefono) || "-"}</td></tr>
        </table>
        <p style="margin:18px 0 6px;color:#64748b;font-size:14px">Messaggio</p>
        <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(messaggio)}</p>
        <p style="margin:22px 0 0;color:#94a3b8;font-size:13px">Rispondi a questa email per scrivere direttamente al contatto.</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: DEST,
      replyTo: email,
      subject: `Nuovo contatto dal sito — ${nome}`,
      text,
      html,
    });

    if (error) {
      console.error("[contatti] Resend error:", JSON.stringify(error));
      return NextResponse.json({ ok: false, fallback: true, error: "Invio non riuscito, riprova." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contatti] Exception:", err);
    return NextResponse.json({ ok: false, fallback: true, error: "Si è verificato un errore inatteso." }, { status: 500 });
  }
}
