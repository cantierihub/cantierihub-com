// Prove del consenso alle email promozionali. Si lanciano con: node --test src/lib/emailPromozionali.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  consensoEmailDato, etichettaConsensoEmail, NOME_CAMPO_CONSENSO_EMAIL,
  ETICHETTA_CONSENSO_EMAIL, ETICHETTA_SENZA_CONSENSO_EMAIL,
} from "./emailPromozionali.ts";

test("solo un true vero è un consenso", () => {
  assert.equal(consensoEmailDato(true), true);
  for (const no of [false, "true", "on", "si", 1, null, undefined, {}, []]) {
    assert.equal(consensoEmailDato(no), false, JSON.stringify(no));
  }
});

test("chi spunta la casella prende «consenso-email», chi no «senza-consenso-email»", () => {
  assert.equal(etichettaConsensoEmail(true), "consenso-email");
  assert.equal(etichettaConsensoEmail(false), "senza-consenso-email");
  // Il CRM le cerca con questi nomi esatti: cambiarli qui senza cambiare il flusso riapre il benvenuto a tutti.
  assert.equal(ETICHETTA_CONSENSO_EMAIL, "consenso-email");
  assert.equal(ETICHETTA_SENZA_CONSENSO_EMAIL, "senza-consenso-email");
});

test("la casella non si chiama come nessun campo letto dallo script di Salesflow", () => {
  // Gli stessi nomi della prova sul campo della nota (funnel.test.ts).
  const letti = ["first_name", "last_name", "company_name", "email", "phone", "prodotto", "esigenza",
    "come_ci_ha_conosciuti", "messaggio", "form_utm_source", "form_utm_medium", "form_utm_campaign", "form_inviato_il"];
  assert.equal(letti.includes(NOME_CAMPO_CONSENSO_EMAIL), false);
});
