"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Loader2,
  Pill,
  ShieldCheck,
} from "lucide-react";
import type { AfterVisitCard } from "@/lib/schema";
import { SAMPLE_NOTES } from "@/data/sampleNotes";
import {
  formatHandoutText,
  MAX_NOTE_LENGTH,
  validateClinicalInput,
} from "@/lib/validation";

export default function HomePage() {
  const [clinicalNote, setClinicalNote] = useState("");
  const [language, setLanguage] = useState<"English" | "Taglish">("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AfterVisitCard | null>(null);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    setError(null);
    setResult(null);
    setVerified(false);
    setCopied(false);

    const check = validateClinicalInput(clinicalNote);
    if (!check.valid) {
      setError(check.error ?? "Invalid clinical note.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicalNote, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to translate note.");
        return;
      }

      setResult(data as AfterVisitCard);
    } catch {
      setError("Network error while contacting ClearCare AI.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyHandout() {
    if (!result || !verified) return;
    await navigator.clipboard.writeText(formatHandoutText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-teal-600" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                ClearCare AI
              </h1>
              <p className="text-xs text-slate-500">
                Outpatient Clinic After-Visit &amp; Discharge Translator
              </p>
            </div>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            Clinic Staff Co-Pilot
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-2">
        {/* Left Panel: Clinical Note Input */}
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="clinical-note"
              className="flex items-center gap-2 text-sm font-semibold text-slate-800"
            >
              <FileText className="h-4 w-4 text-teal-600" />
              Anonymized Consultation Note
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Output:</span>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "English" | "Taglish")
                }
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-teal-600 focus:outline-none"
              >
                <option value="English">Plain English</option>
                <option value="Taglish">Taglish (Clinic PH)</option>
              </select>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {SAMPLE_NOTES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setClinicalNote(sample.text);
                  setError(null);
                  setResult(null);
                }}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <textarea
            id="clinical-note"
            rows={12}
            value={clinicalNote}
            onChange={(e) => setClinicalNote(e.target.value)}
            placeholder="Paste anonymized doctor assessment, prescription shorthand (PO BID, PRN), and return precautions here. Do NOT include patient names, phone numbers, or emails."
            className="w-full rounded-lg border border-slate-300 p-3.5 text-sm leading-relaxed text-slate-800 focus:border-teal-600 focus:outline-none"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Privacy guard active: patient identifiers blocked</span>
            <span>
              {clinicalNote.length} / {MAX_NOTE_LENGTH}
            </span>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Translating into Patient Care Card...
              </>
            ) : (
              "Generate Patient Care Card"
            )}
          </button>
        </section>

        {/* Right Panel: Structured Patient Action Card */}
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {!result && !loading && (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center text-slate-400">
              <ClipboardCheck className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                No Care Card Generated Yet
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                Select a sample note or paste an anonymized consultation summary
                on the left to generate structured instructions.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-teal-600" />
              <p className="text-sm font-medium text-slate-700">
                Structuring medication schedule &amp; warning signs...
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Patient After-Visit Card
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.urgencyLevel === "High-Alert Follow-Up"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {result.urgencyLevel}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Visit Summary
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {result.visitSummary}
                </p>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Pill className="h-3.5 w-3.5 text-teal-600" />
                  Medication Schedule
                </h3>
                <div className="space-y-2">
                  {result.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {med.name}
                        </span>
                        <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                          {med.timeSlot}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-700">
                        {med.dosageAndTiming}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Purpose: {med.plainPurpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Home Care &amp; Preparation
                </h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {result.homeCareSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-3.5">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Warning Signs — Return Immediately If You Notice:
                </h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs font-medium text-red-900">
                  {result.warningSigns.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-700">
                <span className="font-semibold">Follow-Up: </span>
                {result.followUpInstruction}
              </div>

              {/* Human-in-the-Loop Verification Gate */}
              <div className="border-t border-slate-200 pt-4">
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                  />
                  <span>
                    <strong>Clinician Verification (Human-in-the-Loop):</strong>{" "}
                    I have reviewed all dosages and warning signs against the
                    physician&apos;s chart before sharing with the patient.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleCopyHandout}
                  disabled={!verified}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Copied Verified Handout!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Formatted Patient Handout
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}