// Prove della provenienza «da una notizia». Si lanciano con: node --test src/lib/funnel.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { articoloValido, messaggioConArticolo } from "./funnel.ts";

test("uno slug vero passa, ripulito", () => {
  assert.equal(articoloValido("prezzi-costruzioni-istat-agosto-2026"), "prezzi-costruzioni-istat-agosto-2026");
  assert.equal(articoloValido("  Prezzi-Costruzioni-ISTAT  "), "prezzi-costruzioni-istat");
});

test("tutto quello che non è uno slug si scarta", () => {
  for (const cattivo of ["", null, undefined, "una", "../../etc/passwd", "a b c", "<script>", "x".repeat(120), "notizia--doppia", "-inizio-trattino"]) {
    assert.equal(articoloValido(cattivo), "", String(cattivo));
  }
});

test("il messaggio prende la riga dell'articolo in fondo", () => {
  assert.equal(
    messaggioConArticolo("Ruolo: Titolare dell'impresa", "prezzi-costruzioni-istat-agosto-2026"),
    "Ruolo: Titolare dell'impresa\n\nArriva dalla notizia: https://cantierihub.com/notizie/prezzi-costruzioni-istat-agosto-2026",
  );
});

test("senza articolo il messaggio resta com'è (il modulo di /contatti non cambia)", () => {
  assert.equal(messaggioConArticolo("Ciao", ""), "Ciao");
});

test("messaggio vuoto e articolo: resta solo la riga", () => {
  assert.equal(messaggioConArticolo("", "abc-def"), "Arriva dalla notizia: https://cantierihub.com/notizie/abc-def");
});

test("il campo della nota non si chiama come nessun campo letto dallo script di Salesflow", async () => {
  const { NOME_CAMPO_NOTA } = await import("./funnel.ts");
  // I nomi che lo script mappa sui campi del CRM (ContattiForm e CampiProvenienza).
  const letti = ["first_name", "last_name", "company_name", "email", "phone", "prodotto", "esigenza",
    "come_ci_ha_conosciuti", "messaggio", "form_utm_source", "form_utm_medium", "form_utm_campaign", "form_inviato_il"];
  assert.equal(letti.includes(NOME_CAMPO_NOTA), false);
});

test("il messaggio della candidatura: ruolo, nota, articolo", async () => {
  const { messaggioCandidatura } = await import("./funnel.ts");
  assert.equal(
    messaggioCandidatura("Titolare dell'impresa", "  10 preventivi al mese ", "abc-def"),
    "Ruolo: Titolare dell'impresa\n\n10 preventivi al mese\n\nArriva dalla notizia: https://cantierihub.com/notizie/abc-def",
  );
  assert.equal(messaggioCandidatura("Altro", "", ""), "Ruolo: Altro");
});
