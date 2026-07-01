"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, UploadCloud, FileText, X } from "lucide-react";

const RUOLI = [
  "Venditore / Closer",
  "Setter / Appuntamentista",
  "Sales Manager",
  "Marketing & Contenuti",
  "Developer",
];

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ACCEPT = ".pdf,.doc,.docx";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors bg-white";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function CandidaturaForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", telefono: "", ruolo: "", messaggio: "" });
  const [hp, setHp] = useState(""); // honeypot anti-spam
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function selectFile(f: File | null) {
    setError("");
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError("Il CV supera i 4 MB. Comprimilo o invialo a info@cantierihub.com.");
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Allega il tuo CV per candidarti.");
      return;
    }
    setStatus("loading");
    setError("");
    setFallback(false);

    const data = new FormData();
    data.append("nome", form.nome);
    data.append("email", form.email);
    data.append("telefono", form.telefono);
    data.append("ruolo", form.ruolo);
    data.append("messaggio", form.messaggio);
    data.append("company_url", hp);
    data.append("cv", file);

    try {
      const res = await fetch("/api/candidatura", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        router.push("/grazie");
      } else {
        setStatus("error");
        setFallback(Boolean(json.fallback));
        setError(json.error || "Qualcosa è andato storto. Riprova.");
      }
    } catch {
      setStatus("error");
      setFallback(true);
      setError("Non siamo riusciti a inviare la candidatura.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* honeypot: invisibile agli umani, compilato dai bot */}
      <input
        type="text"
        name="company_url"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-navy mb-1.5">
            Nome e Cognome <span className="text-orange-500">*</span>
          </label>
          <input id="nome" type="text" required placeholder="Mario Rossi" value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
            Email <span className="text-orange-500">*</span>
          </label>
          <input id="email" type="email" required placeholder="tua@email.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-navy mb-1.5">
            Telefono <span className="text-orange-500">*</span>
          </label>
          <input id="telefono" type="tel" required placeholder="+39 333 000 0000" value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="ruolo" className="block text-sm font-medium text-navy mb-1.5">
            Per quale ruolo? <span className="text-orange-500">*</span>
          </label>
          <select
            id="ruolo"
            required
            value={form.ruolo}
            onChange={(e) => setForm((f) => ({ ...f, ruolo: e.target.value }))}
            className={`${inputClass} ${form.ruolo ? "text-navy" : "text-gray-400"}`}
          >
            <option value="" disabled>
              Seleziona un ruolo…
            </option>
            {RUOLI.map((r) => (
              <option key={r} value={r} className="text-navy">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-navy mb-1.5">
          Raccontaci di te <span className="text-gray-400 font-normal">(facoltativo)</span>
        </label>
        <textarea
          id="messaggio"
          rows={4}
          placeholder="Due righe su di te: cosa sai fare, cosa cerchi, perché Cantieri Hub."
          value={form.messaggio}
          onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Upload CV */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">
          Il tuo CV <span className="text-orange-500">*</span>
        </label>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="flex items-center gap-3 p-3.5 rounded-lg border border-orange-200 bg-orange-50">
            <FileText size={20} className="text-orange-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-navy truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-navy hover:bg-white transition-colors"
              aria-label="Rimuovi il file"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              selectFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`w-full flex flex-col items-center justify-center gap-2 py-7 px-4 rounded-lg border-2 border-dashed transition-colors ${
              dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
            }`}
          >
            <UploadCloud size={26} className="text-orange-500" />
            <span className="text-sm font-medium text-navy">Trascina qui il CV o clicca per scegliere</span>
            <span className="text-xs text-gray-400">PDF, DOC o DOCX · max 4 MB</span>
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
          {fallback && (
            <>
              {" "}
              Scrivici a{" "}
              <a href="mailto:info@cantierihub.com" className="text-orange-500 hover:underline font-medium">
                info@cantierihub.com
              </a>{" "}
              allegando il CV.
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="cta-shimmer w-full py-3.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === "loading" ? (
          "Invio in corso…"
        ) : (
          <>
            Invia la candidatura <ArrowRight size={16} className="arrow" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Candidandoti accetti la nostra{" "}
        <a href="/privacy" className="text-orange-500 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
