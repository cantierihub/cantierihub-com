// Prove di `portaNelCrm` con un Salesflow finto (nessuna chiamata vera). Si lanciano con:
//   node --test src/lib/salesflow.test.ts
// Verificano le etichette, cioè quello che smista il lead e fa partire (o no) i flussi del CRM.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { portaNelCrm, type LeadSito } from "./salesflow.ts";

type Chiamata = { metodo: string; percorso: string; corpo: unknown };
let chiamate: Chiamata[] = [];
let esistente: { id: string } | null = null;
let doppioPerTelefono = false;

beforeEach(() => {
  chiamate = [];
  esistente = null;
  doppioPerTelefono = false;
  process.env.SALESFLOW_PIT = "finto";
  process.env.SALESFLOW_LOCATION_ID = "loc-finta";
  globalThis.fetch = (async (url: string, opz: RequestInit) => {
    const percorso = String(url).replace("https://services.leadconnectorhq.com/", "");
    const corpo = opz.body ? JSON.parse(String(opz.body)) : undefined;
    chiamate.push({ metodo: String(opz.method), percorso, corpo });
    let risposta: unknown = {};
    if (percorso.startsWith("contacts/search/duplicate")) risposta = { contact: esistente };
    else if (percorso === "contacts/" && doppioPerTelefono) {
      return new Response(JSON.stringify({ message: "This location does not allow duplicated contacts." }), { status: 400 });
    } else if (percorso === "contacts/") risposta = { contact: { id: "nuovo-1" } };
    else if (percorso === "contacts/upsert") risposta = { contact: { id: "unito-5" }, new: false };
    return new Response(JSON.stringify(risposta), { status: 200 });
  }) as typeof fetch;
});

const lead = (extra: Partial<LeadSito> = {}): LeadSito => ({
  nome: "Prova", cognome: "Funnel", azienda: "", email: "prova@example.com", telefono: "+393330000000",
  prodotto: "Analisi Prezzi", motivazione: "I costi si sono mossi e devo rifare i prezzi", canale: "Ricerca su Google",
  messaggio: "Ruolo: Titolare", utmSource: "google", utmMedium: "organic", utmCampagna: "", inviatoIl: "2026-10-03T18:00:00.000Z",
  ...extra,
});

test("contatto nuovo dalle Notizie: creato con l'etichetta del prodotto e «notizie»", async () => {
  const esito = await portaNelCrm(lead({ etichetteExtra: ["notizie"] }));
  assert.equal(esito.ok, true);
  const crea = chiamate.find((c) => c.metodo === "POST" && c.percorso === "contacts/");
  assert.deepEqual((crea?.corpo as { tags: string[] }).tags, ["analisi-prezzi", "notizie"]);
});

test("contatto che c'era già: niente etichette nell'aggiornamento, si aggiungono a parte", async () => {
  esistente = { id: "vecchio-9" };
  const esito = await portaNelCrm(lead({ etichetteExtra: ["notizie"] }));
  assert.equal(esito.ok, true);
  const put = chiamate.find((c) => c.metodo === "PUT");
  assert.equal((put?.corpo as Record<string, unknown>).tags, undefined, "tags nel PUT cancellerebbe quelle del CRM");
  const tags = chiamate.find((c) => c.percorso === "contacts/vecchio-9/tags");
  assert.deepEqual((tags?.corpo as { tags: string[] }).tags, ["analisi-prezzi", "notizie"]);
});

test("dal modulo di /contatti (senza articolo) cambia niente: solo l'etichetta del prodotto", async () => {
  await portaNelCrm(lead({ prodotto: "Preventivatore" }));
  const crea = chiamate.find((c) => c.metodo === "POST" && c.percorso === "contacts/");
  assert.deepEqual((crea?.corpo as { tags: string[] }).tags, ["preventivatore"]);
});

test("un prodotto senza etichetta e senza articolo: nessuna etichetta, nessuna chiamata a /tags", async () => {
  esistente = { id: "vecchio-2" };
  await portaNelCrm(lead({ prodotto: "Marketing" }));
  assert.equal(chiamate.some((c) => c.percorso.endsWith("/tags")), false);
});

test("stessa persona con un'altra email ma lo stesso telefono: upsert, poi le etichette a parte", async () => {
  doppioPerTelefono = true;
  const esito = await portaNelCrm(lead({ etichetteExtra: ["notizie"] }));
  assert.equal(esito.ok, true);
  const upsert = chiamate.find((c) => c.percorso === "contacts/upsert");
  assert.equal((upsert?.corpo as Record<string, unknown>).tags, undefined, "l'upsert non deve sostituire le etichette");
  const tags = chiamate.find((c) => c.percorso === "contacts/unito-5/tags");
  assert.deepEqual((tags?.corpo as { tags: string[] }).tags, ["analisi-prezzi", "notizie"]);
});
