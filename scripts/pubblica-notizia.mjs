#!/usr/bin/env node
// Porta un articolo della redazione (pacchetto nel vault) dentro il sito, sezione «Notizie».
//
//   node scripts/pubblica-notizia.mjs <cartella-pacchetto> --prova       solo i file, in questa copia del repo (per guardarlo in locale)
//   node scripts/pubblica-notizia.mjs <cartella-pacchetto> --anteprima   ramo notizie/<slug> da origin/main, commit, push, pull request in bozza
//                                                                        → Vercel fa l'anteprima; stampa i link
//   node scripts/pubblica-notizia.mjs <slug> --unisci                    dopo l'ok di Raffaele: la pull request esce dalla bozza e si unisce → online
//
// Il pacchetto lo scrivono gli agenti del reparto «Sito» in Paperclip (vault: Business/cantieri-hub/sistemi/sito-seo/
// redazione/<data>-<slug>/). Qui si legge 02-articolo.md e si scrive content/notizie/<slug>.md nel formato di
// src/lib/notizie.ts; le immagini del pacchetto vanno in public/images/notizie/<slug>/.
// Le domande frequenti e le fonti possono stare nell'intestazione (faq, fonti) oppure come sezioni del testo
// («## Domande frequenti» con «### domanda», «## Fonti» con un elenco di link): qui diventano sempre intestazione.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

// fileURLToPath e non .pathname: la cartella si chiama «CANTIERI HUB», e .pathname dava «CANTIERI%20HUB» (02/10:
// lo strumento aveva creato una cartella nuova con quel nome).
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATEGORIE = ["normative-e-bonus", "sicurezza-e-lavoro", "prezzari-e-costi", "appalti-e-incentivi", "guide-pratiche"];
const [, , arg, modo] = process.argv;
const sh = (cmd, args, cwd = REPO) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const oggi = () => new Date().toISOString().slice(0, 10);
// gray-matter legge le date YAML come Date: String(Date) darebbe «Fri Oct 02…».
const giorno = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v).slice(0, 10) : "");
const fuori = (msg) => { console.error(`⛔ ${msg}`); process.exit(1); };

if (!arg || !["--prova", "--anteprima", "--unisci"].includes(modo)) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 9).join("\n"));
  process.exit(1);
}

// ── --unisci: dopo l'ok ────────────────────────────────────────────────────
if (modo === "--unisci") {
  const ramo = `notizie/${arg}`;
  sh("gh", ["pr", "ready", ramo]);
  sh("gh", ["pr", "merge", ramo, "--squash", "--delete-branch"]);
  console.log(`unita: ${ramo} → produzione (Vercel la pubblica da solo in 1-2 minuti)`);
  console.log(`indirizzo: https://cantierihub.com/notizie/${arg}`);
  process.exit(0);
}

// ── conversione del pacchetto ──────────────────────────────────────────────
const pacchetto = path.resolve(arg);
const fileArticolo = path.join(pacchetto, "02-articolo.md");
if (!fs.existsSync(fileArticolo)) fuori(`manca ${fileArticolo}`);
const { data: fm, content } = matter(fs.readFileSync(fileArticolo, "utf8"));
const slug = fm.slug || path.basename(pacchetto).replace(/^\d{4}-\d{2}-\d{2}-/, "");

let corpo = content.replace(/^\s*#\s+.*\n/, ""); // il titolo lo mette la pagina
const sezioni = corpo.split(/^(?=## )/m);
let apertura = sezioni[0].startsWith("## ") ? "" : sezioni.shift();
const faq = Array.isArray(fm.faq) ? fm.faq : [];
let fonti = Array.isArray(fm.fonti) && typeof fm.fonti[0] === "object" ? fm.fonti : [];
const restanti = [];

for (const s of sezioni) {
  const titolo = s.split("\n")[0].replace(/^##\s+/, "").trim().toLowerCase();
  if (/^(domande frequenti|domande e risposte|le domande)/.test(titolo) && faq.length === 0) {
    for (const blocco of s.split(/^(?=### )/m).slice(1)) {
      const [riga, ...resto] = blocco.split("\n");
      faq.push({ domanda: riga.replace(/^###\s+/, "").trim(), risposta: resto.join(" ").replace(/\s+/g, " ").trim() });
    }
  } else if (/^fonti/.test(titolo)) {
    if (fonti.length === 0) {
      for (const r of s.split("\n").filter((x) => /^\s*[-*]\s/.test(x))) {
        // Forma tipica: «- ENTE, [titolo](url), descrizione ([PDF](url))». L'ente è quello che sta prima del primo
        // link; il titolo è il testo del link più la descrizione in chiaro. Ogni altro link della riga diventa una
        // fonte sua: prima diventava testo e il link al PDF del comunicato ISTAT si perdeva, lasciando un «(PDF)» che
        // apriva la pagina web (Controllo visivo, CAN-36, 03/10/2026).
        const link = [...r.matchAll(/\[([^\]]+)\]\((https?:[^)]+)\)/g)];
        if (link.length === 0) continue;
        const [primo, ...altri] = link;
        const riga = r.replace(/^\s*[-*]\s*/, "");
        const i = riga.indexOf(primo[0]);
        const prima = riga.slice(0, i).replace(/\*\*/g, "").replace(/[\s,—–:·-]+$/, "").trim();
        let dopo = riga.slice(i + primo[0].length);
        for (const l of altri) dopo = dopo.split(l[0]).join("");
        dopo = dopo.replace(/\(\s*\)/g, "").replace(/\*\*/g, "").replace(/^[\s,—–:·-]+/, "").replace(/[\s,—–:·-]+$/, "").trim();
        const maiuscola = (t) => t.charAt(0).toUpperCase() + t.slice(1);
        const ente = prima || "Fonte ufficiale";
        fonti.push({ ente, titolo: maiuscola(dopo ? `${primo[1]}, ${dopo}` : primo[1]), url: primo[2] });
        for (const l of altri) fonti.push({ ente, titolo: maiuscola(`${primo[1]} (${l[1]})`), url: l[2] });
      }
    }
  } else {
    restanti.push(s);
  }
}
if (fonti.length === 0 && Array.isArray(fm.fonti)) fonti = fm.fonti.map((u) => ({ titolo: u, ente: "Fonte ufficiale", url: u }));

// «In breve»: dall'intestazione, oppure il primo paragrafo prima dei sottotitoli.
let inBreve = fm.in_breve;
if (!inBreve) {
  const paragrafi = apertura.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#") && !p.startsWith(">") && !/^\*?aggiornato/i.test(p));
  inBreve = paragrafi.shift() || "";
  apertura = paragrafi.join("\n\n");
}
inBreve = inBreve.replace(/^\*\*In breve:?\*\*\s*/i, "").replace(/\*\*/g, "").trim();
corpo = [apertura.trim(), ...restanti].filter(Boolean).join("\n\n").trim() + "\n";

// Immagini: tutto quello che c'è in immagini/ va in public/images/notizie/<slug>/.
const cartellaImmagini = path.join(pacchetto, "immagini");
const immagini = fs.existsSync(cartellaImmagini) ? fs.readdirSync(cartellaImmagini).filter((f) => /\.(webp|avif|jpe?g|png)$/i.test(f)) : [];
const copertina = immagini.find((f) => f.includes("copertina"));
let alt = fm.immagine_alt;
if (copertina && !alt && fs.existsSync(path.join(pacchetto, "06-immagini.md"))) {
  const m = fs.readFileSync(path.join(pacchetto, "06-immagini.md"), "utf8").match(/alternativo[^:\n]*[:|]\s*[«"]?([^»"\n|]+)/i);
  alt = m ? m[1].trim() : undefined;
}

// Controlli: meglio fermarsi qui che pubblicare una pagina sbagliata.
const problemi = [];
if (!CATEGORIE.includes(fm.categoria)) problemi.push(`categoria «${fm.categoria}» non valida (valide: ${CATEGORIE.join(", ")})`);
if (!fm.titolo) problemi.push("manca il titolo");
if (String(fm.titolo).length > 45) problemi.push(`titolo di ${String(fm.titolo).length} caratteri: con « | Cantieri Hub» supera i 60`);
if (/cantieri\s*hub/i.test(String(fm.titolo))) problemi.push("il titolo contiene «Cantieri Hub»: lo aggiunge il sito");
const lDesc = String(fm.descrizione || "").length;
if (lDesc < 70 || lDesc > 160) problemi.push(`descrizione di ${lDesc} caratteri (70-160)`);
if (!inBreve) problemi.push("manca la risposta d'apertura («in breve»)");
if (fonti.length === 0) problemi.push("nessuna fonte");
if (copertina && !alt) problemi.push("la copertina non ha il testo alternativo (immagine_alt)");
if (problemi.length) fuori(`il pacchetto non è pronto:\n  - ${problemi.join("\n  - ")}`);

const intestazione = {
  titolo: fm.titolo,
  descrizione: fm.descrizione,
  tipo: fm.tipo === "guida" ? "guida" : "notizia",
  categoria: fm.categoria,
  ...(fm.parola_chiave ? { parola_chiave: fm.parola_chiave } : {}),
  autore: "Redazione Cantieri Hub",
  data_pubblicazione: giorno(fm.data_pubblicazione) || oggi(),
  data_aggiornamento: giorno(fm.data_aggiornamento) || giorno(fm.data_pubblicazione) || oggi(),
  ...(fm.nota_aggiornamento ? { nota_aggiornamento: fm.nota_aggiornamento } : {}),
  in_breve: inBreve,
  ...(copertina ? { immagine: `/images/notizie/${slug}/${copertina}`, immagine_alt: alt } : {}),
  fonti,
  faq,
};
const testo = matter.stringify(corpo, intestazione);

function scriviIn(radice) {
  fs.mkdirSync(path.join(radice, "content/notizie"), { recursive: true });
  fs.writeFileSync(path.join(radice, "content/notizie", `${slug}.md`), testo);
  if (immagini.length) {
    const dest = path.join(radice, "public/images/notizie", slug);
    fs.mkdirSync(dest, { recursive: true });
    for (const f of immagini) fs.copyFileSync(path.join(cartellaImmagini, f), path.join(dest, f));
  }
}

if (modo === "--prova") {
  scriviIn(REPO);
  console.log(`scritto content/notizie/${slug}.md (${faq.length} domande, ${fonti.length} fonti, ${immagini.length} immagini) — solo in questa copia, niente git`);
  process.exit(0);
}

// ── --anteprima: ramo, commit, push, pull request in bozza ─────────────────
const ramo = `notizie/${slug}`;
const lavoro = fs.mkdtempSync(path.join(os.tmpdir(), "notizia-"));
sh("git", ["fetch", "-q", "origin"]);
// Finché la sezione Notizie non è su main (pull request «redazione/sezione-notizie» da approvare), l'articolo parte
// dal ramo della sezione: da main la sua anteprima sarebbe un 404.
let base = "main";
try { sh("git", ["cat-file", "-e", "origin/main:src/lib/notizie.ts"]); } catch { base = "redazione/sezione-notizie"; }
sh("git", ["worktree", "add", "-q", "-B", ramo, lavoro, `origin/${base}`]);
try {
  scriviIn(lavoro);
  sh("git", ["add", "content/notizie", ...(immagini.length ? ["public/images/notizie"] : [])], lavoro);
  sh("git", ["commit", "-q", "-m", `Notizia: ${fm.titolo}\n\nDalla redazione di agenti (pacchetto ${path.basename(pacchetto)}). Anteprima per l'ok di Raffaele.`], lavoro);
  sh("git", ["push", "-q", "-f", "-u", "origin", ramo], lavoro);
  let pr;
  try {
    pr = sh("gh", ["pr", "view", ramo, "--json", "url", "-q", ".url"]);
  } catch {
    pr = sh("gh", ["pr", "create", "--draft", "--base", base, "--head", ramo, "--title", `Notizia: ${fm.titolo}`,
      "--body", `Articolo della redazione di agenti, da approvare.\n\n- Categoria: ${fm.categoria}\n- Fonti: ${fonti.length}\n- Pacchetto: \`${path.basename(pacchetto)}\`\n\nL'anteprima la fa Vercel su questa pull request. Si unisce solo dopo l'ok di Raffaele (\`pubblica-notizia.mjs ${slug} --unisci\`).`]);
  }
  console.log(`pull request: ${pr}`);
  console.log(`anteprima: il link lo scrive Vercel nella pull request fra 1-2 minuti (gh pr checks ${ramo})`);
  console.log(`pagina: /notizie/${slug}`);
} finally {
  sh("git", ["worktree", "remove", "--force", lavoro]);
}
