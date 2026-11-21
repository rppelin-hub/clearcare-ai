# ClearCare AI — Outpatient After-Visit & Discharge Translator

ClearCare AI is a clinical communication assistant built for outpatient nurses and medical secretaries to translate anonymized physician consultation notes into structured, patient-friendly **After-Visit Action Cards** in **Plain English** or **Taglish**.

- **Live App:** `https://clearcare-ai.vercel.app/`
- **Demo Walkthrough:** `https://drive.google.com/file/d/1jcAgYGybYHZxtkGSK7XYPlA5jNXd0Lpo/view?usp=sharing`

---

## Key Features & Safety Guardrails
- **Structured AI Generation:** Uses Next.js 14 (App Router), TypeScript, Vercel AI SDK (`@ai-sdk/google` with `gemini-3.8-flash`), and Zod (`src/lib/schema.ts`) to expand clinical abbreviations (`PO BID`, `PRN`, `NPO`) into validated JSON care cards without inventing dosages.
- **Urgency Classification:** Highlights critical return precautions with a `High-Alert Follow-Up` badge vs. `Routine`.
- **Client & Server PII Guardrail (`src/lib/validation.ts`):** Intercepts phone numbers, email addresses, and out-of-bounds inputs (`< 50` or `> 6,000` characters) before external API calls occur.
- **Human-in-the-Loop Verification Gate:** Disables handout copying until clinic staff check the verification box confirming dosages and warning signs against the physician's chart.

---

## Project Architecture
```text
clearcare-ai/
├── .github/workflows/ci.yml   # GitHub Actions CI (ESLint + Vitest)
├── src/
│   ├── app/
│   │   ├── api/translate/     # POST endpoint with validation + Gemini structured output
│   │   └── page.tsx           # Split-screen UI (Idle, Loading, Error, Results, HITL Gate)
│   ├── data/sampleNotes.ts    # Routine, High-Alert, and PII Guardrail test presets
│   └── lib/
│       ├── schema.ts          # Shared Zod schema for AfterVisitCard
│       └── validation.ts      # Pure input bounds, PII regex, and handout formatter
├── tests/validation.test.ts   # Automated Vitest unit test suite
├── PRD.md                     # Product Requirements Document & Problem Validation
├── spec.md                    # Technical Specification, API Contract & Acceptance Criteria
├── CLAUDE.md                  # AI coding standards & security rules
└── .cursorrules               # Editor AI assistant rules