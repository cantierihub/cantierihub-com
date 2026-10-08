// Prove del limite delle 2 analisi tenuto dal server (nessuna chiamata vera: l'archivio è in memoria). Si lanciano con:
//   node --test src/lib/prova/limiti.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FINESTRA_IP_MS,
  GIORNO_MS,
  archivioInMemoria,
  bloccoIp,
  giornoDi,
  impronta,
  ipDaIntestazioni,
  percorsoAnalisi,
  prenota,
  prenotaGiro,
  restituisci,
  restituisciGiro,
  salvaAnalisi,
  tettoGiorno,
  usate,
  type Archivio,
  type SchedaAnalisi,
} from "./limiti.ts";

const ORA = Date.UTC(2026, 9, 8, 10, 0, 0);
const SCHEDA = "prova/ip/prova.json";
const intestazioni = (h: Record<string, string>) => ({ get: (n: string) => h[n] ?? null });

test("l'IPv4 si conta intero, l'IPv6 per blocco /64", () => {
  assert.equal(bloccoIp("93.45.12.7"), "93.45.12.7");
  // Lo stesso telefono cambia da solo la seconda metà dell'indirizzo: resta la stessa connessione.
  assert.equal(bloccoIp("2a01:e11:5:31a0:a1b2:c3d4:e5f6:789"), bloccoIp("2a01:e11:5:31a0::1"));
  assert.equal(bloccoIp("2A01:0E11:0005:31A0:0000:0000:0000:0001"), "2a01:e11:5:31a0::/64");
  assert.notEqual(bloccoIp("2a01:e11:5:31a0::1"), bloccoIp("2a01:e11:5:31a1::1"));
  assert.equal(bloccoIp("[2a01:e11:5:31a0::1]"), "2a01:e11:5:31a0::/64");
  assert.equal(bloccoIp("fe80::1%en0"), "fe80:0:0:0::/64");
  assert.equal(bloccoIp("::ffff:93.45.12.7"), "93.45.12.7");
  assert.equal(bloccoIp("64:ff9b::93.45.12.7"), "64:ff9b:0:0::/64");
});

test("un indirizzo storto o assente non apre una scheda tutta sua", () => {
  assert.equal(bloccoIp(null), "sconosciuto");
  for (const storto of ["999.1.1.1", "ciao", "1:2:3", "1::2::3", "1:2:3:4:5:6:7:8:9", "12345::"]) assert.equal(bloccoIp(storto), "non-valido", storto);
});

test("l'indirizzo è quello scritto da Vercel, non da chi chiama", () => {
  assert.equal(ipDaIntestazioni(intestazioni({ "x-real-ip": "93.45.12.7", "x-forwarded-for": "1.1.1.1" })), "93.45.12.7");
  assert.equal(ipDaIntestazioni(intestazioni({ "x-forwarded-for": "93.45.12.7, 10.0.0.1" })), "93.45.12.7");
  assert.equal(ipDaIntestazioni(intestazioni({})), null);
});

test("nell'archivio c'è l'impronta, non l'indirizzo", async () => {
  const a = await impronta("ip|93.45.12.7", "segreto-uno");
  assert.match(a, /^[0-9a-f]{32}$/);
  assert.equal(a, await impronta("ip|93.45.12.7", "segreto-uno"));
  assert.notEqual(a, await impronta("ip|93.45.12.7", "segreto-due"));
  assert.ok(!a.includes("93"));
});

test("dieci richieste insieme dalla stessa connessione: ne passano 2", async () => {
  const a = archivioInMemoria();
  const esiti = await Promise.all(Array.from({ length: 10 }, (_, i) => prenota(a, SCHEDA, `posto-${i}`, 2, ORA, FINESTRA_IP_MS)));
  assert.equal(esiti.filter((e) => e.esito === "presa").length, 2);
  assert.equal(esiti.filter((e) => e.esito === "piena").length, 8);
  assert.equal(await usate(a, SCHEDA, ORA, FINESTRA_IP_MS), 2);
});

test("un errore dell'AI rende il posto, e la prova si può rifare", async () => {
  const a = archivioInMemoria();
  await prenota(a, SCHEDA, "prima", 2, ORA, FINESTRA_IP_MS);
  await prenota(a, SCHEDA, "seconda", 2, ORA, FINESTRA_IP_MS);
  assert.equal((await prenota(a, SCHEDA, "terza", 2, ORA, FINESTRA_IP_MS)).esito, "piena");
  await restituisci(a, SCHEDA, "seconda");
  assert.equal((await prenota(a, SCHEDA, "terza", 2, ORA, FINESTRA_IP_MS)).esito, "presa");
  // Rendere un posto che non c'è non tocca gli altri.
  await restituisci(a, SCHEDA, "mai-preso");
  assert.equal(await usate(a, SCHEDA, ORA, FINESTRA_IP_MS), 2);
});

test("la stessa prenotazione ripetuta (risposta persa) non prende due posti", async () => {
  const a = archivioInMemoria();
  assert.deepEqual(await prenota(a, SCHEDA, "uno", 2, ORA, FINESTRA_IP_MS), { esito: "presa", dopo: 1 });
  assert.deepEqual(await prenota(a, SCHEDA, "uno", 2, ORA, FINESTRA_IP_MS), { esito: "presa", dopo: 1 });
  assert.equal(await usate(a, SCHEDA, ORA, FINESTRA_IP_MS), 1);
});

test("dopo 30 giorni la connessione riparte, prima no", async () => {
  const a = archivioInMemoria();
  await prenota(a, SCHEDA, "uno", 2, ORA, FINESTRA_IP_MS);
  await prenota(a, SCHEDA, "due", 2, ORA + GIORNO_MS, FINESTRA_IP_MS);
  assert.equal((await prenota(a, SCHEDA, "tre", 2, ORA + 29 * GIORNO_MS, FINESTRA_IP_MS)).esito, "piena");
  assert.equal((await prenota(a, SCHEDA, "tre", 2, ORA + 31 * GIORNO_MS, FINESTRA_IP_MS)).esito, "presa");
  // Alla scrittura la voce scaduta se ne va: nella scheda restano «due» e «tre».
  const dati = (await a.leggi(SCHEDA))!.dati as { v: { id: string }[] };
  assert.deepEqual(dati.v.map((x) => x.id), ["due", "tre"]);
});

test("una scheda sempre contesa non fa passare la prova", async () => {
  const conteso: Archivio = { leggi: async () => null, crea: async () => false, sostituisci: async () => false };
  assert.deepEqual(await prenota(conteso, SCHEDA, "uno", 2, ORA, FINESTRA_IP_MS), { esito: "contesa" });
});

const ID = "3f2c9a1e-7b4d-4c8e-9f10-2a3b4c5d6e7f";
const analisiSalvata = (): SchedaAnalisi => ({
  t: ORA,
  richiesta: { voce: "Intonaco civile per interni", regione: "Campania" } as SchedaAnalisi["richiesta"],
  base: { id: ID, prezzo: 31.5, costoDiretto: 25.1, materiali: 9.2, manodopera: 14.4, noli: 1.5 },
  giri: 0,
});

test("l'approfondimento è uno per analisi, anche con cinque richieste insieme", async () => {
  const a = archivioInMemoria();
  await salvaAnalisi(a, analisiSalvata());
  const giri = await Promise.all(Array.from({ length: 5 }, () => prenotaGiro(a, ID)));
  assert.equal(giri.filter((g) => g.esito === "preso").length, 1);
  assert.equal(giri.filter((g) => g.esito === "fatto").length, 4);
  assert.equal((await prenotaGiro(a, ID)).esito, "fatto");
});

test("l'approfondimento parte dalla voce salvata, non da quella del browser", async () => {
  const a = archivioInMemoria();
  await salvaAnalisi(a, analisiSalvata());
  const giro = await prenotaGiro(a, ID);
  assert.equal(giro.esito, "preso");
  if (giro.esito === "preso") {
    assert.equal(giro.scheda.richiesta.voce, "Intonaco civile per interni");
    assert.equal(giro.scheda.base.prezzo, 31.5);
  }
});

test("un'analisi che la prova non ha fatto non si approfondisce", async () => {
  const a = archivioInMemoria();
  assert.equal((await prenotaGiro(a, ID)).esito, "sconosciuta");
  await a.crea(percorsoAnalisi(ID), { qualcosa: "di storto" });
  assert.equal((await prenotaGiro(a, ID)).esito, "sconosciuta");
});

test("un approfondimento fallito si rende", async () => {
  const a = archivioInMemoria();
  await salvaAnalisi(a, analisiSalvata());
  assert.equal((await prenotaGiro(a, ID)).esito, "preso");
  await restituisciGiro(a, ID);
  assert.equal((await prenotaGiro(a, ID)).esito, "preso");
});

test("il giorno del tetto è quello di Roma, e il tetto storto vale 80", () => {
  assert.equal(giornoDi(Date.UTC(2026, 9, 7, 22, 30)), "2026-10-08");
  assert.equal(giornoDi(Date.UTC(2026, 9, 7, 21, 30)), "2026-10-07");
  assert.equal(tettoGiorno("25"), 25);
  for (const storto of [undefined, "", "0", "-3", "2.5", "tanti"]) assert.equal(tettoGiorno(storto), 80);
});
