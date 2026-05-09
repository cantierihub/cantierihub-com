import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, slug, title } = await req.json();

    if (!email || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
            Guida: { title: [{ text: { content: title ?? slug } }] },
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