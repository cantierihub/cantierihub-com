import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    // Honeypot: campo nascosto agli umani. Se valorizzato, è quasi certamente un bot.
    const honeypot = typeof body.company === "string" ? body.company.trim() : "";

    // Rispondiamo ok senza salvare nulla, per non rivelare il meccanismo al bot.
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    // Validazione input.
    if (!email || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (slug.length > 200 || title.length > 300) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (!token) console.error("[guide-lead] NOTION_TOKEN mancante");
    if (!dbId)  console.error("[guide-lead] NOTION_LEADS_DB_ID mancante");

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
            Guida: { title: [{ text: { content: title || slug } }] },
            Slug:  { rich_text: [{ text: { content: slug } }] },
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
