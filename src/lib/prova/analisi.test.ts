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
  domandeDa,
  firmaConteggio,
  leggiConteggio,
  leggiQuantita,
  notaPerIlCrm,
  prezzoRicalcolato,
  puoApprofondire,
  rimaste,
  validaRichiesta,
  validaRisposte,
  VOCE_MAX,
  VOCE_TROPPO_LUNGA,
} from "./analisi.ts";
import { ESEMPIO_ANALISI } from "./esempioSviluppo.ts";

const BASE = { voce: "Massetto in sabbia e cemento, spessore 5 cm", regione: "Campania" };

test("una richiesta minima prende i predefiniti del Preventivatore", () => {
  const r = validaRichiesta(BASE);
  assert.ok(r.ok);
  const v = r.valore;
  assert.deepEqual(
    [v.unita, v.quantita, v.tipoLavoro, v.committente, v.dimensione, v.fornitura, v.stagione, v.speseGenerali, v.utile],
    ["m²", 1, "nuovo", "privato", "piccolo", "fornitura_posa", "none", 15, 10],
  );
});

test("come il prodotto: servono descrizione e regione, il resto si controlla", () => {
  assert.equal(validaRichiesta({ ...BASE, voce: "  " }).ok, false, "descrizione vuota");
  assert.equal(validaRichiesta({ ...BASE, regione: "" }).ok, false, "regione vuota");
  assert.equal(validaRichiesta({ ...BASE, regione: "Trentino" }).ok, false, "regione scritta diversa");
  assert.equal(validaRichiesta({ ...BASE, unita: "mq" }).ok, false, "unità non dell'elenco");
  assert.equal(validaRichiesta({ ...BASE, tipoLavoro: "demolizione" }).ok, false);
  assert.equal(validaRichiesta({ ...BASE, piano: "piano_99" }).ok, false, "parametro avanzato inventato");
  assert.equal(validaRichiesta({ ...BASE, speseGenerali: 31 }).ok, false, "oltre il cursore del prodotto");
  assert.equal(validaRichiesta({ ...BASE, utile: -1 }).ok, false);
  assert.equal(validaRichiesta({ ...BASE, quantita: "abc" }).ok, false);
  assert.equal(validaRichiesta(null).ok, false);
});

test("la quantità si legge come la scrive un imprenditore", () => {
  assert.equal(leggiQuantita(""), 1, "vuota vale 1, come nel prodotto");
  assert.equal(leggiQuantita("12,5"), 12.5);
  assert.equal(leggiQuantita("1.250,5"), 1250.5);
  assert.equal(leggiQuantita("12.5"), 12.5, "il punto della tastiera del telefono");
  assert.equal(leggiQuantita("1.250"), 1250, "un punto con tre cifre è delle migliaia");
  assert.equal(leggiQuantita("0"), 0);
  assert.equal(leggiQuantita("-3"), null);
});

test("alla funzione va lo stesso corpo che manda il Preventivatore", () => {
  const r = validaRichiesta({
    ...BASE, unita: "m²", quantita: "40", tipoLavoro: "ristrutturazione_pesante", committente: "impresa", dimensione: "medio",
    fornitura: "solo_posa", stagione: "inverno", vincoliOrari: "none", urgenza: "urgente", accessibilita: "none",
    piano: "piano_3_4", distanza: "20_40km", note: " Cantiere in centro storico ", speseGenerali: 18, utile: 12,
  });
  assert.ok(r.ok);
  assert.deepEqual(corpoAnalisi(r.valore), {
    description: BASE.voce,
    unit: "m²",
    region: "Campania",
    workType: "ristrutturazione_pesante",
    quantity: 40,
    clientType: "impresa",
    projectSize: "medio",
    supplyType: "solo_posa",
    season: "inverno",
    timeConstraints: undefined,
    urgency: "urgente",
    accessibility: undefined,
    floorLevel: "piano_3_4",
    travelDistance: "20_40km",
    userNotes: "Cantiere in centro storico",
    overhead_percent: 18,
    profit_percent: 12,
  });
});

test("l'analisi vera della funzione si legge tutta", () => {
  const a = analisiDaRisposta({ analysis: { ...ESEMPIO_ANALISI, analisi_id: "F80C96E6-D4AE-4B62-9A98-63B50DB410EF" } });
  assert.ok(a);
  assert.equal(a.prezzo, 91.68);
  assert.equal(a.costoDiretto, 72.48);
  assert.deepEqual(a.mercato, { basso: 85, medio: 105, alto: 125 });
  assert.equal(a.id, "f80c96e6-d4ae-4b62-9a98-63b50db410ef");
  assert.equal(a.confidenza, "alta");
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
  const a = analisiDaRisposta({ analysis: { suggested_price: 50, direct_cost: 40, materials_breakdown: "niente", confidence: "boh", refinement_questions: [{ label: "Che spessore?", type: "choice" }] } });
  assert.ok(a);
  assert.deepEqual(a.righe.materiali, []);
  assert.equal(a.mercato, null, "senza i tre prezzi di mercato il range non si disegna");
  assert.equal(a.confidenza, "media", "una confidenza sconosciuta non rompe il badge");
  assert.equal(a.id, null, "senza id l'approfondimento non si offre");
  assert.equal(a.domande[0].tipo, "testo", "una scelta senza opzioni diventa una risposta scritta, come nel prodotto");
});

test("le domande di riserva (forma del prodotto) diventano domande della pagina", () => {
  // Le domande di riserva le dà `domandeDiRiserva` del prodotto (copiato in prodotto/, provato nel Preventivatore):
  // qui si prova solo che la loro forma passa.
  const d = domandeDa([{ id: "distanza_discarica", label: "Distanza dalla discarica?", type: "choice", options: ["<10 km", "10-30 km", ">30 km"] }]);
  assert.deepEqual(d, [{ id: "distanza_discarica", testo: "Distanza dalla discarica?", tipo: "scelta", opzioni: ["<10 km", "10-30 km", ">30 km"] }]);
});

test("il prezzo coi cursori usa la formula del prodotto (composta, non sommata)", () => {
  assert.equal(Math.round(prezzoRicalcolato(100, 15, 10) * 100) / 100, 126.5);
  assert.equal(prezzoRicalcolato(72.48, 0, 0), 72.48);
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
  assert.deepEqual(validaRisposte([{ id: "distanza_discarica", answer: "<10 km" }]), [{ id: "distanza_discarica", answer: "<10 km" }], "gli id delle domande di riserva");
  assert.equal(validaRisposte([]), null);
  assert.equal(validaRisposte([{ id: "<script>", answer: "x" }]), null);
});

test("la nota per il setter racconta il cantiere", () => {
  const r = validaRichiesta({ ...BASE, quantita: "40", urgenza: "urgente", note: "Centro storico" });
  assert.ok(r.ok);
  const a = analisiDaRisposta({ analysis: { suggested_price: 100, direct_cost: 80, market_low: 90, market_mid: 100, market_high: 120 } })!;
  const nota = notaPerIlCrm({ numero: 1, richiesta: r.valore, analisi: a });
  assert.match(nota, /analisi 1 di 2/);
  assert.match(nota, /40 m² · Campania · Nuovo/);
  assert.match(nota, /Parametri avanzati: urgenza urgente/);
  assert.match(nota, /Note di cantiere: Centro storico/);
  assert.match(nota, /Prezzo suggerito: 100,00\s€\/m² \(spese generali 15%, utile 10%\)/);
});

test("una descrizione fino a 2.000 caratteri passa, oltre si chiede una lavorazione alla volta", () => {
  assert.equal(VOCE_MAX, 2000);
  assert.ok(validaRichiesta({ ...BASE, voce: "a".repeat(2000) }).ok);
  const lunga = validaRichiesta({ ...BASE, voce: "a".repeat(2001) });
  assert.ok(!lunga.ok);
  if (!lunga.ok) assert.equal(lunga.errore, VOCE_TROPPO_LUNGA);
  // Gli spazi in fondo non contano: si misura il testo pulito, come fa la pagina.
  assert.ok(validaRichiesta({ ...BASE, voce: "a".repeat(2000) + "   " }).ok);
});
