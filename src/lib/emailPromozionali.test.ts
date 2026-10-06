// Prove della frase sulle email promozionali. Si lanciano con: node --test src/lib/emailPromozionali.test.ts
//
// Rovesciate il 06/10/2026: prima tenevano la casella non spuntata e le sue due etichette; Raffaele l'ha tolta
// («non voglio che debbano scegliere»). Ora tengono quello che la sostituisce: la frase, uguale nei tre moduli, sopra
// il pulsante, e nessuna scelta da fare.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TESTO_EMAIL_PROMOZIONALI } from "./emailPromozionali.ts";

const MODULI = ["src/app/contatti/ContattiForm.tsx", "src/app/guide/[slug]/GuideForm.tsx"];

test("la frase dice le due cose: che arrivano le email e che si smette quando si vuole", () => {
  assert.match(TESTO_EMAIL_PROMOZIONALI, /ricevi anche le nostre email/);
  assert.match(TESTO_EMAIL_PROMOZIONALI, /Puoi smettere quando vuoi/);
});

test("i moduli mostrano la frase prima del pulsante d'invio", () => {
  // ContattiForm vale per /contatti e per la demo delle Notizie; GuideForm per le guide gratuite.
  for (const file of MODULI) {
    const sorgente = readFileSync(file, "utf8");
    const frase = sorgente.indexOf("{TESTO_EMAIL_PROMOZIONALI}");
    assert.ok(frase > 0, `${file}: la frase non c'è`);
    // Dopo la frase c'è ancora un pulsante d'invio: la frase si legge prima di inviare, non sotto.
    assert.ok(sorgente.indexOf('type="submit"', frase) > frase, `${file}: la frase sta sotto il pulsante`);
  }
});

test("nessun modulo chiede di scegliere: niente casella per le email", () => {
  for (const file of MODULI) {
    assert.equal(/type="checkbox"/.test(readFileSync(file, "utf8")), false, file);
  }
});
