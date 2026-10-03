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
