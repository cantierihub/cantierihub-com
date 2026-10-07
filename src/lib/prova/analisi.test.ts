// Prove delle regole della prova dell'Analisi Prezzi (nessuna chiamata vera). Si lanciano con:
//   node --test src/lib/prova/analisi.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_ANALISI,
  analisiDaRisposta,
  analisiDalBrowser,
  conAnalisi,
  conApprofondimento,
  corpoAnalisi,
  corpoApprofondimento,
  firmaConteggio,
  leggiConteggio,
  leggiPrezzo,
  notaPerIlCrm,
  puoApprofondire,
  rimaste,
  scartoPercento,
  validaRichiesta,
  validaRisposte,
  type RichiestaProva,
} from "./analisi.ts";
import { ESEMPIO_ANALISI } from "./esempioSviluppo.ts";

const BASE = { voce: "Massetto in sabbia e cemento, spessore 5 cm", unita: "m²", regione: "Campania" };

test("una richiesta minima passa coi predefiniti del prodotto", () => {
  const r = validaRichiesta(BASE);
  assert.ok(r.ok);
  assert.deepEqual(
    { tipo: r.valore.tipoLavoro, fornitura: r.valore.fornitura, committente: r.valore.committente, tuo: r.valore.prezzoTuo },
    { tipo: "ristrutturazione_leggera", fornitura: "fornitura_posa", committente: "privato", tuo: null },
  );
});

test("si rifiuta quello che il Preventivatore non conosce", () => {
  assert.equal(validaRichiesta({ ...BASE, voce: "muro" }).ok, false, "voce troppo corta");
  assert.equal(validaRichiesta({ ...BASE, voce: "x".repeat(601) }).ok, false, "voce troppo lunga");
  assert.equal(validaRichiesta({ ...BASE, unita: "mq" }).ok, false, "unità non dell'elenco");
  assert.equal(validaRichiesta({ ...BASE, regione: "Trentino" }).ok, false, "regione scritta diversa");
  assert.equal(validaRichiesta({ ...BASE, tipoLavoro: "demolizione" }).ok, false);
  assert.equal(validaRichiesta(null).ok, false);
});

test("il prezzo suo si legge come lo scrive un imprenditore", () => {
  assert.equal(leggiPrezzo("45"), 45);
  assert.equal(leggiPrezzo("45,50"), 45.5);
  assert.equal(leggiPrezzo("€ 1.250,00"), 1250);
  assert.equal(leggiPrezzo("45.50"), 45.5, "il punto della tastiera del telefono");
  assert.equal(leggiPrezzo("1.250"), 1250, "un punto con tre cifre è delle migliaia");
  assert.equal(leggiPrezzo(""), null);
  assert.equal(leggiPrezzo("0"), null);
  assert.equal(leggiPrezzo("abc"), null);
});

test("alla funzione vanno i nomi del prodotto, il prezzo suo no", () => {
  const r = validaRichiesta({ ...BASE, prezzoTuo: "30" });
  assert.ok(r.ok);
  const corpo = corpoAnalisi(r.valore);
  assert.deepEqual(Object.keys(corpo).sort(), ["clientType", "description", "overhead_percent", "profit_percent", "projectSize", "region", "supplyType", "unit", "workType"]);
  assert.ok(!JSON.stringify(corpo).includes("30"), "il prezzo suo non arriva all'AI");
});

test("l'analisi vera della funzione si legge tutta", () => {
  const a = analisiDaRisposta({ analysis: { ...ESEMPIO_ANALISI, analisi_id: "F80C96E6-D4AE-4B62-9A98-63B50DB410EF" } });
  assert.ok(a);
  assert.equal(a.prezzo, 91.68);
  assert.equal(a.costoDiretto, 72.48);
  assert.deepEqual(a.mercato, { basso: 85, medio: 105, alto: 125 });
  assert.equal(a.id, "f80c96e6-d4ae-4b62-9a98-63b50db410ef");
  assert.equal(a.righe.materiali.length, 4);
  assert.equal(a.righe.manodopera[0].costoOrario, 30.5);
  assert.equal(a.domande.length, 3);
  assert.equal(a.domande[0].tipo, "scelta");
  assert.ok(!("ambito" in a.domande[0]), "al browser vanno solo i campi che la pagina mostra");
});

test("una risposta rotta non fa cadere la pagina", () => {
  assert.equal(analisiDaRisposta(null), null);
  assert.equal(analisiDaRisposta({ analysis: { suggested_price: "abc", direct_cost: 10 } }), null);
  assert.equal(analisiDaRisposta({ analysis: { suggested_price: 0, direct_cost: 10 } }), null);
  const a = analisiDaRisposta({ analysis: { suggested_price: 50, direct_cost: 40, materials_breakdown: "niente", refinement_questions: [{ label: "Che spessore?", type: "choice", options: ["uno"] }] } });
  assert.ok(a);
  assert.deepEqual(a.righe.materiali, []);
  assert.equal(a.mercato, null, "senza i tre prezzi di mercato la riga non si disegna");
  assert.equal(a.id, null, "senza id l'approfondimento non si offre");
  assert.equal(a.domande[0].tipo, "testo", "una scelta con una sola opzione diventa una risposta scritta");
});

test("un mercato al contrario non si disegna", () => {
  const a = analisiDaRisposta({ analysis: { suggested_price: 50, direct_cost: 40, market_low: 80, market_mid: 60, market_high: 70 } });
  assert.equal(a?.mercato, null);
});

test("il cookie firmato si rilegge, quello toccato vale zero", async () => {
  const c = conAnalisi({ a: [], r: [] }, "f80c96e6-d4ae-4b62-9a98-63b50db410ef");
  const v = await firmaConteggio(c, "segreto");
  assert.deepEqual(await leggiConteggio(v, "segreto"), c);
  assert.deepEqual(await leggiConteggio(v, "altro"), { a: [], r: [] }, "firma con un altro segreto");
  const [corpo, firma] = v.split(".");
  const falso = Buffer.from(JSON.stringify({ a: [], r: [] })).toString("base64url");
  assert.deepEqual(await leggiConteggio(`${falso}.${firma}`, "segreto"), { a: [], r: [] }, "corpo azzerato a mano");
  assert.equal((await leggiConteggio(`${corpo}.${firma}`, "segreto")).a.length, 1);
  assert.deepEqual(await leggiConteggio("spazzatura", "segreto"), { a: [], r: [] });
});

test("due analisi, un approfondimento ciascuna", () => {
  const id1 = "11111111-1111-4111-8111-111111111111";
  let c = conAnalisi({ a: [], r: [] }, id1);
  assert.equal(rimaste(c.a.length), 1);
  assert.equal(puoApprofondire(c, id1), true);
  c = conApprofondimento(c, id1);
  assert.equal(puoApprofondire(c, id1), false, "il secondo giro non c'è");
  assert.equal(puoApprofondire(c, "22222222-2222-4222-8222-222222222222"), false, "un'analisi fatta altrove non si approfondisce");
  c = conAnalisi(c, null);
  assert.equal(c.a.length, MAX_ANALISI);
  assert.equal(rimaste(c.a.length), 0);
  assert.equal(puoApprofondire(c, null), false);
});

test("l'approfondimento rimanda id e totali, e le risposte si puliscono", () => {
  const r = validaRichiesta(BASE);
  assert.ok(r.ok);
  const prima = analisiDalBrowser({ id: "f80c96e6-d4ae-4b62-9a98-63b50db410ef", prezzo: 91.68, costoDiretto: 72.48, materiali: 30.66, manodopera: 40.72, noli: 1.1 });
  assert.ok(prima);
  const corpo = corpoApprofondimento(r.valore, prima, [{ id: "q1", answer: "Con fondo integrato" }]) as { phase: string; original_analysis: Record<string, unknown> };
  assert.equal(corpo.phase, "refine");
  assert.equal(corpo.original_analysis.analisi_id, "f80c96e6-d4ae-4b62-9a98-63b50db410ef");
  assert.equal(corpo.original_analysis.suggested_price, 91.68);
  assert.equal(analisiDalBrowser({ id: "inventato", prezzo: 1, costoDiretto: 1 }), null);
  assert.deepEqual(validaRisposte([{ id: "q1", answer: "  Sì  " }, { id: "q2", answer: "" }]), [{ id: "q1", answer: "Sì" }]);
  assert.equal(validaRisposte([]), null);
  assert.equal(validaRisposte([{ id: "<script>", answer: "x" }]), null);
});

test("lo scarto e la nota per il setter", () => {
  assert.equal(scartoPercento(80, 100), -20);
  assert.equal(scartoPercento(null, 100), null);
  const r = validaRichiesta({ ...BASE, prezzoTuo: "80" });
  assert.ok(r.ok);
  const a = analisiDaRisposta({ analysis: { suggested_price: 100, direct_cost: 80, market_low: 90, market_mid: 100, market_high: 120 } })!;
  const nota = notaPerIlCrm({ angolo: "margine", numero: 1, richiesta: r.valore as RichiestaProva, analisi: a });
  assert.match(nota, /analisi 1 di 2 \(pagina «margine»\)/);
  assert.match(nota, /Campania/);
  assert.match(nota, /Il suo prezzo: 80,00\s€\/m² \(-20% sul prezzo suggerito\)/);
});
