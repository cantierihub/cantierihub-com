import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, slug, title } = await req.json();

    if (!email || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (token && dbId) {
      await fetch("https://api.notion.com/v1/pages", {
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
            Guida: {
              title: [{ text: { content: title ?? slug } }],
            },
            Slug: {
              rich_text: [{ text: { content: slug } }],
            },
            Data: {
              date: { start: new Date().toISOString() },
            },
          },
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Sempre restituisce successo — il download non deve bloccarsi per errori di storage
    return NextResponse.json({ ok: true });
  }
}