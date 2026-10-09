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
// src/lib/notizie.ts; la copertina e le immagini che il testo usa vanno in public/images/notizie/<slug>/.
// Le domande frequenti e le fonti possono stare nell'intestazione (faq, fonti) oppure come sezioni del testo
// («## Domande frequenti» con «### domanda», «## Fonti» con un elenco di link): qui diventano sempre intestazione.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

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
const problemi = [];

// Una riga dell'elenco «## Fonti» diventa una fonte per link, col testo del link. Si leggono tre forme:
//   «- Ente, [titolo](url), descrizione ([PDF](url))»: un link con la sua descrizione. Il link fra parentesi subito
//     dopo un altro è un'altra copia dello stesso atto e diventa «titolo (PDF)»: prima il PDF del comunicato ISTAT
//     si perdeva (Controllo visivo, CAN-36, 03/10/2026).
//   «- Ente, Codice civile, [art. 1655](url), [art. 1659](url) e [art. 1661](url)»: link alla pari, separati solo
//     da virgole, «e», «;». Una fonte ciascuno; la descrizione in fondo, se c'è, va all'ultimo.
//   «- Ente, [Atto](url): [art. 41](url), [art. 60](url), Allegato I.14…»: l'atto e le sue parti. Quello che segue
//     i due punti descrive l'atto; ogni parte ha la sua fonte, con l'atto accanto all'ente.
// Del testo fra due link alla pari non si sa di chi sia: lì lo strumento si ferma e lo dice. Prima un link in mezzo
// alla descrizione spariva e lasciava il buco («e il suo , modello di dichiarazione», 07/10), e i link alla pari
// diventavano «Art. 1655, e», «Art. 1655 (art. 1659)» (Controllo visivo, CAN-151; CAN-185, 09/10/2026).
const maiuscola = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const pulito = (t) => t.replace(/\*\*/g, "").replace(/\s+/g, " ").replace(/^[\s,—–:·-]+/, "").replace(/[\s,—–:·-]+$/, "").trim();
function fontiDellaRiga(r) {
  const riga = r.replace(/^\s*[-*]\s*/, "");
  // pezzi = testo, link, testo, link, …, testo. Una copia «([PDF](url))» non è un pezzo: va col link prima.
  const pezzi = [""];
  let da = 0;
  for (const m of riga.matchAll(/\[([^\]]+)\]\((https?:[^)]+)\)/g)) {
    const testo = riga.slice(da, m.index);
    da = m.index + m[0].length;
    const chiusa = riga.slice(da).match(/^\s*\)/);
    if (pezzi.length > 1 && chiusa && /\(\s*$/.test(testo)) {
      pezzi[pezzi.length - 1] += testo.replace(/\(\s*$/, "");
      pezzi.at(-2).copie.push({ testo: m[1], url: m[2] });
      da += chiusa[0].length;
    } else {
      pezzi[pezzi.length - 1] += testo;
      pezzi.push({ testo: m[1], url: m[2], copie: [] }, "");
    }
  }
  pezzi[pezzi.length - 1] += riga.slice(da);
  const atti = pezzi.filter((p) => typeof p === "object");
  if (atti.length === 0) return [];
  const dopo = (k) => pezzi[2 * k + 2]; // il testo fra il link k e il successivo
  const prefisso = pulito(pezzi[0]);
  const ente = prefisso || "Fonte ufficiale";
  const conCopie = (ente, atto, descrizione) => [
    { ente, titolo: maiuscola(descrizione ? `${atto.testo}, ${descrizione}` : atto.testo), url: atto.url },
    ...atto.copie.map((c) => ({ ente, titolo: maiuscola(`${atto.testo} (${c.testo})`), url: c.url })),
  ];
  if (atti.length === 1) return conCopie(ente, atti[0], pulito(dopo(0)));
  if (/^\s*:/.test(dopo(0))) {
    const [atto, ...parti] = atti;
    const resto = pezzi.slice(2).map((p) => (typeof p === "string" ? p : p.testo)).join("");
    const enteParti = [prefisso, atto.testo].filter(Boolean).join(", ");
    return [...conCopie(ente, atto, pulito(resto)), ...parti.flatMap((p) => conCopie(enteParti, p, ""))];
  }
  const k = atti.slice(0, -1).findIndex((_, i) => !/^\s*(?:[,;/·]\s*)*(?:(?:e|ed|o)\s+)?$/i.test(dopo(i)));
  if (k >= 0) {
    problemi.push(`fonti: fra «${atti[k].testo}» e «${atti[k + 1].testo}» c'è «${pulito(dopo(k))}», e non si sa di quale dei due link sia. Una fonte per riga («- Ente, [titolo](url), descrizione»), oppure link alla pari separati solo da virgole o «e»`);
    return [];
  }
  return atti.flatMap((a, i) => conCopie(ente, a, i === atti.length - 1 ? pulito(dopo(i)) : ""));
}

for (const s of sezioni) {
  const titolo = s.split("\n")[0].replace(/^##\s+/, "").trim().toLowerCase();
  if (/^(domande frequenti|domande e risposte|le domande)/.test(titolo) && faq.length === 0) {
    for (const blocco of s.split(/^(?=### )/m).slice(1)) {
      const [riga, ...resto] = blocco.split("\n");
      faq.push({ domanda: riga.replace(/^###\s+/, "").trim(), risposta: resto.join(" ").replace(/\s+/g, " ").trim() });
    }
  } else if (/^fonti/.test(titolo)) {
    if (fonti.length === 0) {
      for (const r of s.split("\n").filter((x) => /^\s*[-*]\s/.test(x))) fonti.push(...fontiDellaRiga(r));
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

// Immagini. In public/images/notizie/<slug>/ va solo quello che la pagina usa: la copertina e le immagini che il testo
// richiama. Prima andava tutta la cartella immagini/, e il 07/10 era finito online anche il PNG di lavoro da 2,2 MB,
// senza etichetta AI. La copertina è <slug>-copertina.webp (il nome lo fissa Media sito): è quella con l'etichetta
// «AI GENERATED», l'unico segno dell'AI a vista dal 03/10. Prima si prendeva il primo file con «copertina» nel nome,
// in ordine alfabetico, e il 07/10 è uscito …-copertina-senza-icona.png. Un file «senza-icona» online non va mai.
const cartellaImmagini = path.join(pacchetto, "immagini");
const fileImmagini = fs.existsSync(cartellaImmagini) ? fs.readdirSync(cartellaImmagini).filter((f) => /\.(webp|avif|jpe?g|png)$/i.test(f)) : [];
const immagini = fileImmagini.filter((f) => !/senza-icona/i.test(f));
const copertina = immagini.find((f) => f === `${slug}-copertina.webp`);
const usate = [...new Set([copertina, ...immagini.filter((f) => corpo.includes(f))].filter(Boolean))];
let alt = fm.immagine_alt;
if (copertina && !alt && fs.existsSync(path.join(pacchetto, "06-immagini.md"))) {
  const m = fs.readFileSync(path.join(pacchetto, "06-immagini.md"), "utf8").match(/alternativo[^:\n]*[:|]\s*[«"]?([^»"\n|]+)/i);
  alt = m ? m[1].trim() : undefined;
}

// Controlli: meglio fermarsi qui che pubblicare una pagina sbagliata.
const altreCopertine = fileImmagini.filter((f) => /copertina/i.test(f));
if (!copertina && altreCopertine.length) {
  problemi.push(`in immagini/ c'è «${altreCopertine.join("», «")}» ma non «${slug}-copertina.webp»: online va solo quella, con l'etichetta AI (la prepara Media sito)`);
}
if (/senza-icona/i.test(corpo)) problemi.push("il testo richiama un'immagine «senza-icona»: online va solo quella con l'etichetta AI");
for (const [, f] of corpo.matchAll(new RegExp(`/images/notizie/${slug}/([^)\\s"'>]+)`, "g"))) {
  if (!usate.includes(f)) problemi.push(`il testo richiama /images/notizie/${slug}/${f}, che in immagini/ non c'è`);
}
// L'ultima rete: un'etichetta con un buco («il suo , modello») o con un pezzo di Markdown non va online.
for (const f of fonti) {
  for (const t of [f.ente, f.titolo].map(String)) {
    if (/\s[,.;:)]|\(\s*\)|[[\]]|^[,.;:)]|[,;:(]$/.test(t)) problemi.push(`fonte «${f.titolo}»: c'è un buco o un pezzo di Markdown in «${t}»`);
  }
}
if (!CATEGORIE.includes(fm.categoria)) problemi.push(`categoria «${fm.categoria}» non valida (valide: ${CATEGORIE.join(", ")})`);
if (!fm.titolo) problemi.push("manca il titolo");
if (String(fm.titolo).length > 45) problemi.push(`titolo di ${String(fm.titolo).length} caratteri: con « | Cantieri Hub» supera i 60`);
if (/cantieri\s*hub/i.test(String(fm.titolo))) problemi.push("il titolo contiene «Cantieri Hub»: lo aggiunge il sito");
const lDesc = String(fm.descrizione || "").length;
if (lDesc < 70 || lDesc > 160) problemi.push(`descrizione di ${lDesc} caratteri (70-160)`);
if (!inBreve) problemi.push("manca la risposta d'apertura («in breve»)");
if (fonti.length === 0) problemi.push("nessuna fonte");
if (copertina && !alt) problemi.push("la copertina non ha il testo alternativo (immagine_alt)");
// Lo slug va nell'indirizzo e nel funnel (`?da=<slug>`): se non ha questa forma, la candidatura perde l'articolo in
// silenzio (lib/funnel.ts del sito).
if (!/^[a-z0-9]+(?:-[a-z0-9]+){1,12}$/.test(slug) || slug.length > 100) {
  problemi.push(`slug «${slug}» non valido: minuscole, numeri e trattini, da 2 a 13 parole`);
}
// Il blocco «Pubblicità» in fondo (funnel delle Notizie, 03/10/2026): un prodotto fra quelli del sito, o «nessuno».
// ⚠️ `prodotto: false` YAML lo legge come booleano: senza questo controllo sparirebbe e varrebbe il prodotto della
// sezione, cioè una pubblicità proprio dove la si voleva spegnere.
const PRODOTTI_BLOCCO = ["analisi-prezzi", "preventivatore", "computatore", "cantieri-hub", "nessuno"];
if (fm.prodotto !== undefined && fm.prodotto !== null && !PRODOTTI_BLOCCO.includes(String(fm.prodotto).trim().toLowerCase())) {
  problemi.push(`prodotto «${fm.prodotto}» non valido (validi: ${PRODOTTI_BLOCCO.join(", ")}; per spegnere il blocco: nessuno)`);
}
if (fm.gancio && String(fm.gancio).trim().length > 90) {
  problemi.push(`gancio di ${String(fm.gancio).trim().length} caratteri (massimo 90)`);
}
// Un solo aggancio a un prodotto, ed è il blocco (CONFORMITA §1.6 e checklist n. 8). Si guarda la pagina vera: i link
// come li vede il lettore (anche quelli scritti in chiaro, che marked trasforma in link) e i nomi dei prodotti.
const PERCORSI_COMMERCIALI = /^\/(analisi-prezzi|preventivatore|computatore|edilchat|demo|calcola|come-funziona|contatti)(\/|$|\?|#)/;
for (const [, href] of String(marked.parse(corpo, { async: false })).matchAll(/href="([^"]+)"/g)) {
  let u;
  try { u = new URL(href, "https://cantierihub.com"); } catch { continue; }
  const nostro = /(^|\.)cantierihub\.com$/.test(u.hostname);
  if (u.hostname === "app.cantierihub.com" || (nostro && PERCORSI_COMMERCIALI.test(u.pathname))) {
    problemi.push(`nel testo c'è un link commerciale (${href}): l'aggancio è il blocco in fondo, si sceglie con «prodotto:»`);
  }
}
const nomeProdotto = corpo.match(/\b(Preventivatore|Computatore|EdilChat|Analisi Prezzi AI|Analisi Prezzi di Cantieri Hub)\b/);
if (nomeProdotto) problemi.push(`nel testo c'è il nome di un prodotto («${nomeProdotto[0]}»): lo presenta il blocco in fondo`);
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
  ...(fm.prodotto ? { prodotto: String(fm.prodotto).trim().toLowerCase() } : {}),
  ...(fm.gancio ? { gancio: String(fm.gancio).trim() } : {}),
  ...(fm.nota_ai_in_alto === true ? { nota_ai_in_alto: true } : {}),
  ...(copertina ? { immagine: `/images/notizie/${slug}/${copertina}`, immagine_alt: alt } : {}),
  fonti,
  faq,
};
const testo = matter.stringify(corpo, intestazione);

function scriviIn(radice) {
  fs.mkdirSync(path.join(radice, "content/notizie"), { recursive: true });
  fs.writeFileSync(path.join(radice, "content/notizie", `${slug}.md`), testo);
  // La cartella dell'articolo tiene solo i file che la pagina usa: quello che c'era da prima e non serve più (un'altra
  // copertina, un PNG di lavoro) si toglie.
  const dest = path.join(radice, "public/images/notizie", slug);
  let tolti = 0;
  for (const f of fs.existsSync(dest) ? fs.readdirSync(dest) : []) {
    if (!usate.includes(f) && fs.statSync(path.join(dest, f)).isFile()) { fs.rmSync(path.join(dest, f)); tolti++; }
  }
  if (usate.length) {
    fs.mkdirSync(dest, { recursive: true });
    for (const f of usate) fs.copyFileSync(path.join(cartellaImmagini, f), path.join(dest, f));
  }
  return tolti;
}

if (modo === "--prova") {
  const tolti = scriviIn(REPO);
  console.log(`scritto content/notizie/${slug}.md (${faq.length} domande, ${fonti.length} fonti) — solo in questa copia, niente git`);
  console.log(`copertina: ${copertina ?? "nessuna"} · in public/images/notizie/${slug}/: ${usate.join(", ") || "niente"}${tolti ? ` (${tolti === 1 ? "tolto 1 file" : `tolti ${tolti} file`} di prima)` : ""}`);
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
  const tolti = scriviIn(lavoro);
  sh("git", ["add", "content/notizie", ...(usate.length || tolti ? ["public/images/notizie"] : [])], lavoro);
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
