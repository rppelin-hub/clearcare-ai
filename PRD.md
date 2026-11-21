# Product Requirements Document (PRD) — ClearCare AI

## 1. Problem & Opportunity (7-Step Idea Validation Framework)
1. **Problem Statement:** Outpatient physicians write fast, abbreviation-heavy consultation notes (`PO BID`, `q6h PRN`, `NPO`, `r/o`) during short 5–10 minute consults. Nurses and medical secretaries must manually translate these notes into plain-language patient discharge instructions, causing discharge bottlenecks and high risk of medication dosing errors or missed emergency return precautions.
2. **Target User (Specific Persona):** Outpatient clinic triage nurses, staff nurses, and medical secretaries in high-volume primary care and specialty clinics in the Philippines who counsel patients before discharge.
3. **Real-World Evidence & Pain Points:**
   - World Health Organization (WHO) *Medication Without Harm* data identifies care transitions and unclear discharge instructions as leading drivers of preventable outpatient medication errors.
   - In Philippine outpatient clinics, patients frequently ask staff at the reception desk to re-explain English medical jargon (`BID`, `PRN`, `fasting labs`) in everyday Taglish, adding 5–10 minutes of manual explanation per patient.
4. **Existing Alternatives & Gaps:**
   - *Manual verbal/handwritten instructions:* Slow, inconsistent across staff shifts, and easily forgotten by patients once they leave the clinic.
   - *Generic consumer AI chatbots (ChatGPT web):* Unstructured walls of text, risk of guessing unstated dosages, no built-in PII blocking before cloud submission, and no clinician sign-off gate.
5. **Why Now:** Modern LLMs with strict JSON schema enforcement (Vercel AI SDK + Zod + Gemini 3.8/3.5) can reliably parse medical shorthand into structured, grade-level-appropriate action cards in under 5 seconds—while lightweight browser/server PII guardrails and Human-in-the-Loop verification make clinical adoption safe today.
6. **Value Proposition:** Converts an anonymized consultation note into a verified, structured **After-Visit Action Card** (in Plain English or Taglish) in one click, cutting discharge preparation time while safeguarding patient privacy and dosage accuracy.
7. **Riskiest Assumptions & Validation Tests:**
   - *Assumption 1 (Accuracy):* The model translates abbreviations accurately without inventing dosages $\rightarrow$ Tested via strict Zod schema + system prompt constraints across Routine and High-Alert clinical presets.
   - *Assumption 2 (Privacy):* Clinic staff will not accidentally transmit patient phone numbers or emails $\rightarrow$ Validated via dual client/server regex PII guardrails (`tests/validation.test.ts` and Sample 3 preset).

---

## 2. Target Users & Personas
- **Primary User — Outpatient Clinic Nurse / Medical Secretary:** Needs a fast, zero-training tool to turn doctor notes into clear take-home instructions and verify accuracy before handing them to the patient.
- **Secondary Beneficiary — Outpatient Patient / Caregiver:** Needs a scannable medication schedule (Morning / Afternoon / Evening / As Needed), home care checklist, and clear red-flag warning signs in Plain English or Taglish.

---

## 3. Core User Flows & User Stories
- **US-1 (Plain-Language Translation):** *As a clinic nurse*, I want to paste an anonymized doctor's note and select Plain English or Taglish so that I can generate a structured patient care card in seconds.
- **US-2 (Urgency Triage):** *As a triage nurse*, I want high-risk notes (e.g., hypertensive urgency) automatically flagged as `High-Alert Follow-Up` so patients immediately recognize emergency red flags.
- **US-3 (Privacy Protection):** *As a clinic administrator*, I want notes containing patient phone numbers or email addresses blocked automatically before reaching the AI API so patient privacy is protected.
- **US-4 (Human-in-the-Loop Sign-Off):** *As a licensed clinician*, I want the copy/export button locked until I confirm I have reviewed the dosages and warning signs so unverified AI text is never handed to a patient.

---

## 4. Functional Requirements & Testable Acceptance Criteria

| Feature ID | Feature Description | Testable Acceptance Criteria |
| :--- | :--- | :--- |
| **FR-1** | **Structured Care Card Generation** (`POST /api/translate`) | Given a valid anonymized note (50–6,000 chars), the API returns HTTP `200` with valid JSON matching `afterVisitCardSchema` (`urgencyLevel`, `visitSummary`, `medications`, `homeCareSteps`, `warningSigns`, `followUpInstruction`). |
| **FR-2** | **Bilingual Output Toggle** | Selecting `Plain English` generates Grade-6 English instructions; selecting `Taglish` generates natural English-Filipino explanations while keeping exact medication names and strengths intact. |
| **FR-3** | **Input Bounds & PII Guardrail** | Notes `< 50` chars, `> 6,000` chars, or containing phone numbers (`0917-555-0192`) or emails (`name@domain.com`) are rejected with HTTP `400` and an inline red alert without invoking Gemini. |
| **FR-4** | **Clinician Verification Gate (HITL)** | The **Copy Formatted Patient Handout** button remains `disabled` until the user checks the Clinician Verification checkbox; once checked, clicking copies the formatted plain-text summary to the clipboard. |
| **FR-5** | **Resilient Model Failover** | If the primary Gemini model experiences high traffic or times out, the API automatically fails over to `gemini-3.5-flash-lite` within the 30s serverless window. |

---

## 5. Non-Goals (Out of Scope)
- Autonomous medical diagnosis, clinical decision support, or prescribing.
- Inferring or calculating medication dosages omitted from the physician's note.
- Database storage of patient records or Electronic Health Record (EHR) integration.

---

## 6. Success Metrics & Operational Risks
- **Latency:** 95% of valid translation requests complete in under 10 seconds on Vercel.
- **Privacy Compliance:** 100% of test cases containing phone numbers or email addresses blocked prior to external API calls (verified in `tests/validation.test.ts`).
- **Build & Test Reliability:** 100% pass rate on `npm run lint` and `npm test` in GitHub Actions CI on every push to `main`.