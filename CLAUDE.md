# CLAUDE.md — Engineering Rules for ClearCare AI

## Project Context
ClearCare AI translates anonymized outpatient clinical notes into structured patient after-visit care cards using Next.js 14 (App Router), TypeScript, Tailwind CSS, Vercel AI SDK, Google Gemini, and Zod.

## Mandatory Coding Standards
1. **TypeScript Strictness:** Never use `any`. Share Zod schemas (`src/lib/schema.ts`) between the API route and React UI.
2. **Security & Privacy:** Never hardcode API keys. Always read `GOOGLE_GENERATIVE_AI_API_KEY` from `process.env`. Always run `validateClinicalInput()` before calling the LLM to block PII and out-of-bounds text.
3. **Pure Helper Isolation:** Keep validation, PII detection, and text formatting inside `src/lib/validation.ts` as pure functions so Vitest unit tests can verify them deterministically without network calls.
4. **Human-in-the-Loop Safety:** Never present AI output as autonomous medical advice. Preserve the clinician review checkbox and disclaimer banner.