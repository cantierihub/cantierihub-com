// Il feed RSS delle notizie: cantierihub.com/notizie/feed.xml. Statico come le pagine: si rigenera a ogni deploy.
import { categoriaDa, tutteLeNotizie } from "@/lib/notizie";
import { SITE_URL } from "@/data/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T08:00:00Z`).toUTCString();

export function GET() {
  const notizie = tutteLeNotizie().slice(0, 30);
  const voci = notizie
    .map(
      (n) => `    <item>
      <title>${esc(n.titolo)}</title>
      <link>${SITE_URL}/notizie/${n.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/notizie/${n.slug}</guid>
      <pubDate>${rfc822(n.dataPubblicazione)}</pubDate>
      <category>${esc(categoriaDa(n.categoria)?.nome ?? "")}</category>
      <description>${esc(n.inBreve || n.descrizione)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notizie per le imprese edili · Cantieri Hub</title>
    <link>${SITE_URL}/notizie</link>
    <atom:link href="${SITE_URL}/notizie/feed.xml" rel="self" type="application/rss+xml" />
    <description>Norme, bonus, sicurezza, prezzari e appalti spiegati per chi lavora in cantiere.</description>
    <language>it-IT</language>
${voci}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
