import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RUOLI } from "@/data/ruoli";

// Resend e Buffer richiedono il runtime Node, non Edge.
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB — sotto il limite body di Vercel (~4.5 MB)
const DEST = "info@cantierihub.com";
const FROM = "Candidature Cantieri Hub <candidature@app-cantierihub.com>";

const RUOLI_VALIDI = new Set<string>(RUOLI);

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const nome = String(form.get("nome") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const telefono = String(form.get("telefono") ?? "").trim();
    const ruolo = String(form.get("ruolo") ?? "").trim();
    const messaggio = String(form.get("messaggio") ?? "").trim();
    const company_url = String(form.get("company_url") ?? "").trim();
    const cv = form.get("cv");

    // honeypot: se compilato è un bot → scarta silenziosamente
    if (company_url) {
      return NextResponse.json({ ok: true });
    }

    // ── Validazione ──
    if (!nome || !email || !telefono || !ruolo) {
      return NextResponse.json({ ok: false, error: "Compila tutti i campi obbligatori." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "L'indirizzo email non sembra valido." }, { status: 400 });
    }
    if (!RUOLI_VALIDI.has(ruolo)) {
      return NextResponse.json({ ok: false, error: "Seleziona un ruolo valido." }, { status: 400 });
    }
    if (!(cv instanceof File) || cv.size === 0) {
      return NextResponse.json({ ok: false, error: "Allega il tuo CV." }, { status: 400 });
    }
    if (cv.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Il CV supera i 4 MB. Comprimilo o invialo a info@cantierihub.com." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(cv.type)) {
      return NextResponse.json({ ok: false, error: "Formato CV non valido: usa PDF, DOC o DOCX." }, { status: 400 });
    }

    // ── Invio email con CV in allegato ──
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[candidatura] RESEND_API_KEY mancante — candidatura non inviata");
      return NextResponse.json(
        { ok: false, fallback: true, error: "Invio momentaneamente non disponibile." },
        { status: 503 },
      );
    }

    const buffer = Buffer.from(await cv.arrayBuffer());
    const safeFilename = (cv.name || "cv").replace(/[^\w.\-]+/g, "_");
    const resend = new Resend(apiKey);

    const text = [
      "Nuova candidatura da cantierihub.com/lavora-con-noi",
      "",
      `Nome:      ${nome}`,
      `Email:     ${email}`,
      `Telefono:  ${telefono}`,
      `Ruolo:     ${ruolo}`,
      "",
      "Messaggio:",
      messaggio || "(nessun messaggio)",
    ].join("\n");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;max-width:560px">
        <h2 style="margin:0 0 4px">Nuova candidatura</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px">da cantierihub.com/lavora-con-noi</p>
        <table style="border-collapse:collapse;font-size:14px;width:100%">
          <tr><td style="padding:6px 0;color:#64748b;width:110px">Nome</td><td style="padding:6px 0;font-weight:600">${esc(nome)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#f97316">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Telefono</td><td style="padding:6px 0">${esc(telefono)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Ruolo</td><td style="padding:6px 0;font-weight:600">${esc(ruolo)}</td></tr>
        </table>
        ${messaggio ? `<p style="margin:18px 0 6px;color:#64748b;font-size:14px">Messaggio</p><p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(messaggio)}</p>` : ""}
        <p style="margin:22px 0 0;color:#94a3b8;font-size:13px">📎 CV in allegato. Rispondi a questa email per scrivere direttamente al candidato.</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: DEST,
      replyTo: email,
      subject: `Nuova candidatura — ${ruolo} — ${nome}`,
      text,
      html,
      attachments: [{ filename: safeFilename, content: buffer }],
    });

    if (error) {
      console.error("[candidatura] Resend error:", JSON.stringify(error));
      return NextResponse.json(
        { ok: false, fallback: true, error: "Invio non riuscito, riprova." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[candidatura] Exception:", err);
    return NextResponse.json(
      { ok: false, fallback: true, error: "Si è verificato un errore inatteso." },
      { status: 500 },
    );
  }
}
