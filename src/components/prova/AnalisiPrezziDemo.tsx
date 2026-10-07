"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  Download,
  FilePlus,
  FileSpreadsheet,
  Loader2,
  Lock,
  Package,
  RefreshCw,
  Settings2,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import {
  ACCESSIBILITA,
  COMMITTENTI,
  DIMENSIONI,
  DISTANZE,
  FORNITURE,
  MAX_ANALISI,
  NOTE_MAX,
  PIANI,
  REGIONI,
  SPESE_GENERALI,
  SPESE_GENERALI_MAX,
  STAGIONI,
  TIPI_LAVORO,
  UNITA,
  URGENZE,
  UTILE,
  UTILE_MAX,
  VINCOLI_ORARI,
  VOCE_MAX,
  euro,
  leggiQuantita,
  prezzoRicalcolato,
  type AnalisiMostrata,
} from "@/lib/prova/analisi";
import { Badge, Bottone, Card, CardContent, CardHeader, CardTitle, Cursore, Etichetta, GruppoRadio, Suggerimento, Tendina, Testo } from "./ui";

/**
 * L'Analisi Prezzi del Preventivatore, da provare sul sito (07/10/2026).
 *
 * È la replica di `PriceAnalysisInline.tsx` del prodotto (origin/main 4eefacec): stesso modulo (descrizione, unità,
 * quantità, regione, tipo di lavoro, committente, dimensione appalto, fornitura, parametri avanzati, note di
 * cantiere), stesso risultato (scomposizione apribile, «Raffina la stima», spese generali e utile coi cursori, prezzo
 * suggerito, range di mercato, confidenza e note) e la stessa funzione dietro: il server del sito chiama
 * `analyze-price` del Preventivatore (/api/prova/analisi). Cosa cambia rispetto al prodotto, e perché:
 * - 2 analisi gratuite e un giro di approfondimento per analisi (il conto lo tiene il server);
 * - «Salva in prezzario interno», «Scarica PDF», «Scarica Excel» e «Usa in preventivo» col lucchetto;
 * - niente «Componi dai miei costi»: lavora sui costi dell'impresa, che qui non ci sono (nel prodotto lo vede solo
 *   chi ha attivato «I miei costi»);
 * - gli avvisi (toast nel prodotto) sono scritti sotto il pulsante.
 */

const confidenza = {
  alta: { etichetta: "Alta", colore: "border-green-200 bg-green-500/10 text-green-700" },
  media: { etichetta: "Media", colore: "border-yellow-200 bg-yellow-500/10 text-yellow-700" },
  bassa: { etichetta: "Bassa", colore: "border-red-200 bg-red-500/10 text-red-700" },
} as const;

/** Il contatto del CRM dal link di WhatsApp (`?c=`). Sul server non c'è. */
function useContatto(): string | null {
  return useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("c"),
    () => null,
  );
}

export default function AnalisiPrezziDemo({ whatsapp }: { whatsapp: string }) {
  const contatto = useContatto();

  // ── Il modulo, coi predefiniti del prodotto ──
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("m²");
  const [quantity, setQuantity] = useState("1");
  const [region, setRegion] = useState("");
  const [workType, setWorkType] = useState("nuovo");
  const [clientType, setClientType] = useState("privato");
  const [projectSize, setProjectSize] = useState("piccolo");
  const [supplyType, setSupplyType] = useState("fornitura_posa");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [season, setSeason] = useState("none");
  const [timeConstraints, setTimeConstraints] = useState("none");
  const [urgency, setUrgency] = useState("none");
  const [accessibility, setAccessibility] = useState("none");
  const [floorLevel, setFloorLevel] = useState("none");
  const [travelDistance, setTravelDistance] = useState("none");
  const [userNotes, setUserNotes] = useState("");
  const [overheadPercent, setOverheadPercent] = useState(SPESE_GENERALI);
  const [profitPercent, setProfitPercent] = useState(UTILE);

  // ── Il risultato ──
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalisiMostrata | null>(null);
  const [primaStima, setPrimaStima] = useState<number | null>(null);
  const [refinementRound, setRefinementRound] = useState(0);
  const [approfondibile, setApprofondibile] = useState(false);
  const [refinementAnswers, setRefinementAnswers] = useState<Record<string, string>>({});
  const [refining, setRefining] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [laborOpen, setLaborOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [erroreRaffina, setErroreRaffina] = useState<string | null>(null);
  const [raffinata, setRaffinata] = useState(false);

  // ── La prova ──
  const [rimaste, setRimaste] = useState(MAX_ANALISI);
  const [disponibile, setDisponibile] = useState(true);
  const risultati = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/prova/analisi${contatto ? `?c=${encodeURIComponent(contatto)}` : ""}`)
      .then((r) => r.json())
      .then((d: { rimaste?: number; disponibile?: boolean }) => {
        if (typeof d.rimaste === "number") setRimaste(d.rimaste);
        if (d.disponibile === false) setDisponibile(false);
      })
      .catch(() => {});
  }, [contatto]);

  const quantita = leggiQuantita(quantity) ?? 1;
  const recalculatedPrice = useMemo(
    () => (analysis ? prezzoRicalcolato(analysis.costoDiretto, overheadPercent, profitPercent) : 0),
    [analysis, overheadPercent, profitPercent],
  );
  const marketPosition =
    analysis?.mercato && analysis.mercato.alto - analysis.mercato.basso > 0
      ? ((recalculatedPrice - analysis.mercato.basso) / (analysis.mercato.alto - analysis.mercato.basso)) * 100
      : 50;

  const richiesta = () => ({
    voce: description.trim(),
    unita: unit,
    quantita: quantity,
    regione: region,
    tipoLavoro: workType,
    committente: clientType,
    dimensione: projectSize,
    fornitura: supplyType,
    stagione: season,
    vincoliOrari: timeConstraints,
    urgenza: urgency,
    accessibilita: accessibility,
    piano: floorLevel,
    distanza: travelDistance,
    note: userNotes.trim(),
    speseGenerali: overheadPercent,
    utile: profitPercent,
  });

  async function handleAnalyze() {
    if (!description.trim() || !region) return setErrore("Compila descrizione e regione");
    if (leggiQuantita(quantity) === null) return setErrore("La quantità non sembra un numero: scrivila come 12 o 12,5");
    setErrore(null);
    setLoading(true);
    setAnalysis(null);
    setPrimaStima(null);
    setRefinementRound(0);
    setRefinementAnswers({});
    setRaffinata(false);
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 1023px)").matches) risultati.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    try {
      const r = await fetch("/api/prova/analisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fase: "analisi", contatto, richiesta: richiesta() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        if (typeof d.rimaste === "number") setRimaste(d.rimaste);
        if (d.motivo === "non-configurata" || d.motivo === "esaurita") setDisponibile(false);
        setErrore(d.messaggio ?? "L'analisi non è arrivata. Riprova: questa non è stata contata.");
        return;
      }
      setAnalysis(d.analisi);
      setPrimaStima(d.analisi.prezzo);
      setApprofondibile(!!d.approfondibile);
      setRimaste(d.rimaste);
      // Come il prodotto: dopo un'analisi nuova i cursori tornano ai predefiniti e i dettagli si chiudono.
      setOverheadPercent(SPESE_GENERALI);
      setProfitPercent(UTILE);
      setMaterialsOpen(false);
      setLaborOpen(false);
      setEquipmentOpen(false);
    } catch {
      setErrore("Connessione assente o lenta. Riprova: questa analisi non è stata contata.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine() {
    if (!analysis) return;
    const answers = Object.entries(refinementAnswers)
      .filter(([, v]) => v.trim())
      .map(([id, answer]) => ({ id, answer }));
    if (answers.length === 0) return setErroreRaffina("Rispondi ad almeno una domanda");
    setErroreRaffina(null);
    setRefining(true);
    try {
      const a = analysis;
      const r = await fetch("/api/prova/analisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fase: "approfondimento",
          contatto,
          richiesta: richiesta(),
          analisi: { id: a.id, prezzo: a.prezzo, costoDiretto: a.costoDiretto, materiali: a.materiali, manodopera: a.manodopera, noli: a.noli },
          risposte: answers,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) return setErroreRaffina(d.messaggio ?? "Il ricalcolo non è arrivato. Riprova.");
      setAnalysis(d.analisi);
      setRefinementRound(1);
      setRefinementAnswers({});
      setApprofondibile(false);
      setRaffinata(true);
    } catch {
      setErroreRaffina("Connessione assente o lenta. Riprova.");
    } finally {
      setRefining(false);
    }
  }

  const finite = rimaste <= 0;
  const pronto = !!description.trim() && !!region;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* SINISTRA: il modulo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[16px]">
              <Calculator className="h-4 w-4 text-orange-500" aria-hidden="true" />
              Parametri di analisi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Testo
              etichetta="Descrizione lavorazione"
              valore={description}
              onCambia={setDescription}
              segnaposto="Es: Posa pavimento in gres porcellanato 60x60 su massetto"
              max={VOCE_MAX}
              altezza="min-h-[100px]"
            />

            <div className="grid grid-cols-2 gap-3">
              <Tendina etichetta="Unità di misura" valore={unit} onCambia={setUnit} opzioni={UNITA.map((u) => ({ valore: u, etichetta: u }))} />
              <div>
                <Etichetta htmlFor="prova-quantita">Quantità</Etichetta>
                <input
                  id="prova-quantita"
                  inputMode="decimal"
                  autoComplete="off"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-md border border-navy-200 bg-white px-3 text-[16px] tabular-nums text-navy focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:min-h-10 md:text-sm"
                />
              </div>
            </div>

            <Tendina
              etichetta="Regione"
              valore={region}
              onCambia={setRegion}
              segnaposto="Seleziona regione"
              opzioni={REGIONI.map((r) => ({ valore: r, etichetta: r }))}
            />

            <GruppoRadio etichetta="Tipo di lavoro" nome="work" valore={workType} onCambia={setWorkType} opzioni={TIPI_LAVORO} />
            <GruppoRadio etichetta="Tipo committente" nome="client" valore={clientType} onCambia={setClientType} opzioni={COMMITTENTI} />
            <Tendina etichetta="Dimensione appalto" valore={projectSize} onCambia={setProjectSize} opzioni={DIMENSIONI} />
            <GruppoRadio etichetta="Fornitura e posa" nome="supply" valore={supplyType} onCambia={setSupplyType} opzioni={FORNITURE} />

            {/* Parametri avanzati */}
            <div>
              <Bottone
                variante="ghost"
                misura="sm"
                className="w-full justify-between"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((o) => !o)}
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" aria-hidden="true" />
                  Parametri avanzati
                </span>
                {advancedOpen ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
              </Bottone>
              {advancedOpen && (
                <div className="space-y-3 pt-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Tendina piccola etichetta="Stagione" valore={season} onCambia={setSeason} opzioni={STAGIONI} />
                    <Tendina piccola etichetta="Vincoli orari" valore={timeConstraints} onCambia={setTimeConstraints} opzioni={VINCOLI_ORARI} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Tendina piccola etichetta="Urgenza" valore={urgency} onCambia={setUrgency} opzioni={URGENZE} />
                    <Tendina piccola etichetta="Accessibilità cantiere" valore={accessibility} onCambia={setAccessibility} opzioni={ACCESSIBILITA} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Tendina piccola etichetta="Piano di lavoro" valore={floorLevel} onCambia={setFloorLevel} opzioni={PIANI} />
                    <Tendina piccola etichetta="Distanza cantiere" valore={travelDistance} onCambia={setTravelDistance} opzioni={DISTANZE} />
                  </div>
                </div>
              )}
            </div>

            {/* Note di cantiere */}
            <Testo
              piccola
              etichetta="Note di cantiere (opzionale)"
              valore={userNotes}
              onCambia={setUserNotes}
              segnaposto="Es: Cantiere in zona montana, materiali di pregio, lavorazione notturna, presenza amianto..."
              righe={2}
              max={NOTE_MAX}
              altezza="min-h-[60px]"
            />

            {!disponibile ? (
              <Avviso titolo="La prova è ferma in questo momento" whatsapp={whatsapp}>
                Scrivici su WhatsApp: l&apos;analisi te la facciamo vedere noi, su una voce tua.
              </Avviso>
            ) : finite ? (
              <Avviso titolo="Le 2 analisi gratuite sono state usate" whatsapp={whatsapp}>
                Le altre voci le vediamo insieme in chiamata, sul tuo computo.
              </Avviso>
            ) : (
              <div className="space-y-2">
                <Bottone variante="accent" misura="lg" className="w-full font-semibold" disabled={loading || !pronto} onClick={handleAnalyze}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Calculator className="h-4 w-4" aria-hidden="true" />}
                  {loading ? "Analisi in corso..." : "Analizza Prezzo"}
                </Bottone>
                {errore && (
                  <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {errore}
                  </p>
                )}
                <p className="text-center text-sm text-navy-600" aria-live="polite">
                  Analisi gratuite: <span className="tabular-nums">{rimaste}</span> su {MAX_ANALISI}
                </p>
              </div>
            )}
            <p className="text-sm leading-relaxed text-navy-600">
              La descrizione va al nostro sistema di analisi con l&apos;intelligenza artificiale: non scrivere nomi di clienti o indirizzi.
              {contatto && " Le analisi che fai qui le vede anche chi ti chiamerà da Cantieri Hub."}
            </p>
          </CardContent>
        </Card>

        {/* DESTRA: i risultati */}
        <div ref={risultati} className="scroll-mt-24 space-y-4">
          {!analysis && !loading && (
            <Card className="border-dashed">
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <Calculator className="h-6 w-6 text-orange-500" aria-hidden="true" />
                </div>
                <p className="text-sm text-navy-600">
                  Compila il form e clicca &quot;Analizza Prezzo&quot; per vedere la scomposizione dei costi e il range di mercato.
                </p>
              </div>
            </Card>
          )}

          {loading && (
            <Card>
              <div className="flex items-center justify-center gap-3 px-6 py-16 text-navy-600">
                <Loader2 className="h-5 w-5 animate-spin text-orange-500" aria-hidden="true" />
                <span role="status">Analisi AI in corso...</span>
              </div>
            </Card>
          )}

          {analysis && (
            <>
              {/* La stima aggiornata dopo l'approfondimento, rispetto alla prima */}
              {refinementRound >= 1 && primaStima !== null && primaStima > 0 && (() => {
                const delta = Math.round(((analysis.prezzo - primaStima) / primaStima) * 1000) / 10;
                const positivo = delta >= 0;
                return (
                  <Card className={positivo ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                      <span className="text-sm font-medium">Stima aggiornata</span>
                      <Badge className={positivo ? "border-transparent bg-green-500/10 text-green-700" : "border-transparent bg-red-500/10 text-red-700"}>
                        {positivo ? "+" : ""}
                        {delta.toLocaleString("it-IT")}% rispetto alla prima stima
                      </Badge>
                    </div>
                  </Card>
                );
              })()}

              {/* Scomposizione del costo diretto */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Scomposizione Costo Diretto
                    <Suggerimento testo={`Costo per singola unità di misura (${unit}). Clicca per espandere il dettaglio.`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Componente
                    icona={<Package className="h-4 w-4 text-blue-500" aria-hidden="true" />}
                    nome="Materiali"
                    valore={analysis.materiali}
                    aperto={materialsOpen}
                    onApri={() => setMaterialsOpen((o) => !o)}
                    colonne={["Materiale", "Qtà", "P.U.", "Subtotale"]}
                    righe={analysis.righe.materiali.map((m) => [m.nome, `${num(m.quantita)} ${m.unita}`, euro(m.prezzo), euro(m.subtotale)])}
                  />
                  <Componente
                    icona={<Users className="h-4 w-4 text-green-500" aria-hidden="true" />}
                    nome="Manodopera"
                    valore={analysis.manodopera}
                    aperto={laborOpen}
                    onApri={() => setLaborOpen((o) => !o)}
                    colonne={["Categoria", "Ore/UM", "€/h", "Subtotale"]}
                    righe={analysis.righe.manodopera.map((l) => [l.categoria, num(l.ore), euro(l.costoOrario), euro(l.subtotale)])}
                  />
                  <Componente
                    icona={<Wrench className="h-4 w-4 text-orange-500" aria-hidden="true" />}
                    nome="Noli/Attr."
                    valore={analysis.noli}
                    aperto={equipmentOpen}
                    onApri={() => setEquipmentOpen((o) => !o)}
                    colonne={["Attrezzatura", "Qtà", "C.U.", "Subtotale"]}
                    righe={analysis.righe.noli.map((e) => [e.tipo, num(e.quantita), euro(e.costo), euro(e.subtotale)])}
                  />
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-sm text-navy-600">Costo diretto unitario:</span>
                    <span className="text-sm font-bold tabular-nums">
                      {euro(analysis.costoDiretto)}/{unit}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Le domande per raffinare la stima */}
              {analysis.domande.length > 0 && (
                <Card className="border-orange-500/30">
                  <CardHeader>
                    <CardTitle>
                      <RefreshCw className="h-4 w-4 text-orange-500" aria-hidden="true" />
                      {refinementRound === 0 ? "Raffina la stima" : "Vuoi approfondire ancora?"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {refinementRound === 0 && approfondibile ? (
                      <>
                        <p className="text-sm text-navy-600">Rispondi a queste domande per ottenere una stima più precisa (gratuito):</p>
                        {analysis.domande.map((q) => (
                          <fieldset key={q.id} className="space-y-1.5">
                            <legend className="text-sm text-navy">{q.testo}</legend>
                            {q.tipo === "scelta" ? (
                              <div className="flex flex-wrap gap-2">
                                {q.opzioni.map((opt) => (
                                  <Bottone
                                    key={opt}
                                    variante={refinementAnswers[q.id] === opt ? "default" : "outline"}
                                    misura="sm"
                                    aria-pressed={refinementAnswers[q.id] === opt}
                                    className="h-auto whitespace-normal py-1.5 text-left"
                                    onClick={() => setRefinementAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  >
                                    {opt}
                                  </Bottone>
                                ))}
                              </div>
                            ) : (
                              <input
                                placeholder="Scrivi la tua risposta..."
                                value={refinementAnswers[q.id] || ""}
                                onChange={(e) => setRefinementAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                aria-label={q.testo}
                                className="min-h-11 w-full rounded-md border border-navy-200 bg-white px-3 text-[16px] text-navy placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:min-h-10 md:text-sm"
                              />
                            )}
                          </fieldset>
                        ))}
                        <Bottone
                          variante="outline"
                          className="w-full"
                          disabled={refining || Object.keys(refinementAnswers).length === 0}
                          onClick={handleRefine}
                        >
                          {refining ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                          {refining ? "Ricalcolo in corso..." : "Ricalcola"}
                        </Bottone>
                        {erroreRaffina && (
                          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                            {erroreRaffina}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <ul className="space-y-1.5 text-sm text-navy-600">
                          {analysis.domande.map((q) => (
                            <li key={q.id} className="flex gap-2">
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                              {q.testo}
                            </li>
                          ))}
                        </ul>
                        <p className="flex gap-2 rounded-md bg-navy-50 px-3 py-2 text-sm leading-relaxed text-navy-700">
                          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          Nella prova l&apos;approfondimento è uno per analisi. Nel Preventivatore rispondi anche a queste e la stima si affina ancora.
                        </p>
                      </>
                    )}
                    {raffinata && <p className="text-sm font-medium text-green-700" role="status">Stima raffinata con successo</p>}
                  </CardContent>
                </Card>
              )}

              {/* Spese generali e utile, prezzo suggerito */}
              <Card>
                <CardHeader>
                  <CardTitle>Spese Generali e Utile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Cursore nome="Spese generali" valore={overheadPercent} max={SPESE_GENERALI_MAX} onCambia={setOverheadPercent} />
                  <Cursore nome="Utile d'impresa" valore={profitPercent} max={UTILE_MAX} onCambia={setProfitPercent} />
                  <Card className="border-orange-500/30 bg-orange-500/5 shadow-none">
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">Prezzo suggerito</span>
                        <span className="text-lg font-bold tabular-nums text-orange-700">
                          {euro(recalculatedPrice)}/{unit}
                        </span>
                      </div>
                      {quantita > 1 && (
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="text-sm text-navy-600">
                            Totale per {num(quantita)} {unit}
                          </span>
                          <span className="text-sm font-semibold tabular-nums">{euro(recalculatedPrice * quantita)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </CardContent>
              </Card>

              {/* Range di mercato */}
              {analysis.mercato && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <TrendingUp className="h-4 w-4" aria-hidden="true" />
                      Range di Mercato — {region}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div
                      className="relative h-8 overflow-hidden rounded-full bg-gradient-to-r from-green-100 via-yellow-100 to-red-100"
                      role="img"
                      aria-label={`Prezzo suggerito ${euro(recalculatedPrice)}: mercato da ${euro(analysis.mercato.basso)} a ${euro(analysis.mercato.alto)}, medio ${euro(analysis.mercato.medio)}`}
                    >
                      <div className="absolute top-0 h-full w-1 rounded bg-orange-500" style={{ left: `${Math.min(Math.max(marketPosition, 2), 98)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm tabular-nums text-navy-600">
                      <span>{euro(analysis.mercato.basso)}</span>
                      <span className="font-medium">{euro(analysis.mercato.medio)}</span>
                      <span>{euro(analysis.mercato.alto)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-navy-600">
                      <span>Basso</span>
                      <span>Medio</span>
                      <span>Alto</span>
                    </div>
                    <p className="text-sm text-navy-600">Stima dell&apos;AI per {region}, non un prezzario</p>
                  </CardContent>
                </Card>
              )}

              {/* Confidenza, note e azioni */}
              <Card>
                <CardContent className="space-y-3 pt-4 md:pt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-navy-600">Confidenza:</span>
                    <Badge className={confidenza[analysis.confidenza].colore}>{confidenza[analysis.confidenza].etichetta}</Badge>
                  </div>
                  {analysis.note && (
                    <div className="flex gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" aria-hidden="true" />
                      <p className="text-sm leading-relaxed text-navy-600">{analysis.note}</p>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-navy-600">
                    Stima generata con l&apos;intelligenza artificiale: va controllata prima di usarla.{" "}
                    <a href="/ai-trasparenza" className="font-medium text-navy underline underline-offset-2">
                      Come usiamo l&apos;AI
                    </a>
                  </p>
                  <hr className="border-navy-200" />
                  <AzioniChiuse />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const num = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 3 });

function Componente({
  icona,
  nome,
  valore,
  aperto,
  onApri,
  colonne,
  righe,
}: {
  icona: ReactNode;
  nome: string;
  valore: number;
  aperto: boolean;
  onApri: () => void;
  colonne: string[];
  righe: string[][];
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onApri}
        aria-expanded={aperto}
        className={`flex w-full items-center justify-between rounded-lg border border-navy-200 bg-white p-3 text-left shadow-sm transition-colors hover:border-navy/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${aperto ? "rounded-b-none" : ""}`}
      >
        <span className="flex items-center gap-2">
          {icona}
          <span>
            <span className="block text-sm text-navy-600">{nome}</span>
            <span className="block text-sm font-bold tabular-nums">{euro(valore)}</span>
          </span>
        </span>
        {aperto ? <ChevronUp className="h-4 w-4 text-navy-500" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 text-navy-500" aria-hidden="true" />}
      </button>
      {aperto &&
        (righe.length > 0 ? (
          <div className="rounded-b-md border border-t-0 border-navy-200">
            {/* Sul telefono: una riga per voce, nome e subtotale sopra, le altre colonne sotto (la tabella uscirebbe di lato). */}
            <ul className="divide-y divide-navy-100 md:hidden">
              {righe.map((r, i) => (
                <li key={i} className="px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-navy">{r[0]}</span>
                    <span className="shrink-0 font-medium tabular-nums">{r[r.length - 1]}</span>
                  </div>
                  <p className="mt-0.5 tabular-nums text-navy-600">
                    {r.slice(1, -1).map((cella, j) => `${colonne[j + 1]} ${cella}`).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-navy-200">
                  {colonne.map((c, i) => (
                    <th key={c} className={`px-2 py-1.5 font-medium text-navy-600 ${i === 0 ? "text-left" : "text-right"}`}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {righe.map((r, i) => (
                  <tr key={i} className="border-b border-navy-100 last:border-0">
                    {r.map((cella, j) => (
                      <td key={j} className={`px-2 py-1 align-top ${j === 0 ? "text-left" : "whitespace-nowrap text-right tabular-nums"} ${j === r.length - 1 ? "font-medium" : ""}`}>
                        {cella}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-2 text-sm text-navy-600">Nessun dettaglio disponibile</p>
        ))}
    </div>
  );
}

function Avviso({ titolo, children, whatsapp }: { titolo: string; children: ReactNode; whatsapp: string }) {
  return (
    <div className="rounded-lg border border-navy-200 bg-navy-50 p-4">
      <p className="font-semibold text-navy">{titolo}</p>
      <p className="mt-1 text-sm leading-relaxed text-navy-700">{children}</p>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-funnel mt-3 w-full sm:w-auto">
        Scrivici su WhatsApp <ArrowRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

/** I pulsanti del prodotto sotto il risultato, col lucchetto: nella prova non salvano e non scaricano. */
function AzioniChiuse() {
  const [detto, setDetto] = useState(false);
  const chiuso = (icona: ReactNode, testo: string, extra = "") => (
    <Bottone variante="outline" className={`border-dashed text-navy-600 hover:bg-navy-50 hover:text-navy ${extra}`} aria-disabled="true" onClick={() => setDetto(true)}>
      {icona}
      {testo}
      <Lock className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
    </Bottone>
  );
  return (
    <div className="space-y-2">
      {chiuso(<BookOpen className="h-4 w-4" aria-hidden="true" />, "Salva in prezzario interno", "w-full")}
      <div className="flex flex-col gap-2 sm:flex-row">
        {chiuso(<Download className="h-4 w-4" aria-hidden="true" />, "Scarica PDF", "flex-1")}
        {chiuso(<FileSpreadsheet className="h-4 w-4" aria-hidden="true" />, "Scarica Excel", "flex-1")}
      </div>
      {chiuso(<FilePlus className="h-4 w-4" aria-hidden="true" />, "Usa in preventivo", "w-full")}
      <p className="text-sm leading-relaxed text-navy-700" aria-live="polite">
        {detto
          ? "Si sbloccano col Preventivatore: te li facciamo vedere in chiamata, sul tuo computo."
          : "Nel Preventivatore, da qui, l'analisi va nel tuo prezzario, in PDF, in Excel e nel preventivo."}
      </p>
    </div>
  );
}
