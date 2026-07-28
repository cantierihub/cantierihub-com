// Renderizza le grafiche di prodotto in public/images/.
// Uso: node grafiche/render.mjs   (serve playwright, vedi README qui accanto)
//
// I sorgenti HTML restano nel repo: se una grafica va corretta si modifica
// l'HTML e si rilancia, non si rifà da zero.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const qui = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(qui, "..", "public", "images");

const grafiche = [
  "edilchat-anatomia-risposta",
  "analisi-prezzi-scomposizione",
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1400, height: 1000 },
  deviceScaleFactor: 2, // 2800x2000: nitido anche su schermi retina
});

for (const nome of grafiche) {
  await page.goto("file://" + path.join(qui, `${nome}.html`));
  await page.waitForTimeout(1200); // attesa caricamento Poppins da Google Fonts
  const file = path.join(out, `${nome}.png`);
  await page.screenshot({ path: file });
  console.log("✓", file);
}

await browser.close();
