# ClearCare AI — Technical Specification & Architecture Notes

## 1. System Overview & AI Capability
ClearCare AI is a post-consultation communication assistant for outpatient clinic nurses and medical secretaries.
- **Core AI Capability:** Structured Generation & Urgency Classification using Vercel AI SDK (`generateText` + `Output.object` with a Zod schema) and Google Gemini (`gemini-3.8-flash`).
- **Non-Goals:** Clinical diagnosis, prescription dosing calculation, or storage of patient Personally Identifiable Information (PII).

## 2. System Architecture & Data Flow
1. **UI Layer (`src/app/page.tsx`):** Split-screen Next.js 14 + Tailwind interface accepting anonymized clinical notes (`50–6,000` chars) and an output language (`Plain English` or `Taglish`).
2. **Validation Layer (`src/lib/validation.ts`):** Enforces character bounds and blocks obvious PII (emails, phone numbers) client- and server-side before external API calls.
3. **API & AI Layer (`src/app/api/translate/route.ts`):** Reads `GOOGLE_GENERATIVE_AI_API_KEY` from server environment variables, sends the sanitized note to Gemini with a strict Zod schema, and returns typed JSON.
4. **Human-in-the-Loop Gate:** Disables handout copying until clinic staff explicitly check the clinical verification box.

## 3. API Contract (`POST /api/translate`)
- **Request JSON:** `{ "clinicalNote": string, "language": "English" | "Taglish" }`
- **Success Response (`200 OK`):**
  ```json
  {
    "urgencyLevel": "Routine" | "High-Alert Follow-Up",
    "visitSummary": "string",
    "medications": [
      {
        "name": "string",
        "dosageAndTiming": "string",
        "timeSlot": "Morning" | "Afternoon" | "Evening" | "As Needed",
        "plainPurpose": "string"
      }
    ],
    "homeCareSteps": ["string"],
    "warningSigns": ["string"],
    "followUpInstruction": "string"
  }

  - **Error Responses:** `400 Bad Request` (validation/PII failure), `500 Internal Server Error` (missing API key or LLM generation failure).

## 4. UI States & Edge-Case Handling
- **Idle:** Displays sample note presets and empty output placeholder.
- **Loading:** Disables submit button and renders loading state during API call.
- **Validation Error:** Displays inline red alert when input is `< 50` chars, `> 6,000` chars, or contains PII.
- **Results:** Renders urgency badge, medication table, warning callout, and Human-in-the-Loop sign-off gate.

## 5. Testable Acceptance Criteria
- **AC-1 (Input Bounds):** Inputs `< 50` or `> 6,000` characters return a `400` validation error without invoking the LLM.
- **AC-2 (PII Guardrail):** Inputs containing phone numbers (`09xx...` / `+63...`) or email addresses are blocked with an explicit privacy warning.
- **AC-3 (Structured Output):** Valid notes return a schema-compliant JSON Action Card within `10 seconds`.
- **AC-4 (Human-in-the-Loop Gate):** The "Copy Formatted Handout" button stays disabled until the clinician verification checkbox is checked.