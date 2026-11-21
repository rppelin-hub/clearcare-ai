# Product Requirements Document (PRD) — ClearCare AI

## 1. Problem Validation (Idea Validation Framework)
- **Target User:** Outpatient clinic nurses, triage staff, and medical secretaries who prepare post-consultation discharge instructions in busy clinics.
- **Core Problem:** Physicians write fast, abbreviation-heavy consultation notes (e.g., `PO BID`, `q6h PRN`, `NPO`, `r/o`) under tight time constraints. Clinic staff must manually rewrite these into plain language for patients, leading to bottlenecks, inconsistent explanations, and higher risk of medication errors or missed emergency warning signs.
- **Why Now:** Modern LLMs with strict JSON schema enforcement (Vercel AI SDK + Zod + Gemini) can reliably translate medical shorthand into structured, grade-level-appropriate instructions in Plain English or Taglish within seconds—while lightweight client/server guardrails and a Human-in-the-Loop sign-off keep clinicians in control.

## 2. Product Scope & Core Features
- **Structured After-Visit Action Card:** Converts an anonymized consultation note into a typed JSON summary containing `urgencyLevel`, `visitSummary`, `medications` (with time slots), `homeCareSteps`, `warningSigns`, and `followUpInstruction`.
- **Bilingual Clinic Output:** Supports both **Plain English** (Grade 6 reading level) and **Taglish** (natural English-Filipino mix tailored for Philippine outpatient clinics).
- **Automated Urgency Triage:** Classifies every note as either `Routine` or `High-Alert Follow-Up` when red-flag symptoms or critical monitoring thresholds are present.
- **Privacy & Input Guardrails:** Blocks submissions under 50 characters, over 6,000 characters, or containing patient Personally Identifiable Information (phone numbers or email addresses) before calling any external API.
- **Human-in-the-Loop Verification Gate:** Locks the "Copy Formatted Patient Handout" button until clinic staff explicitly check the clinical review box.

## 3. Non-Goals (Out of Scope)
- Autonomous medical diagnosis or prescribing.
- Calculating or modifying medication dosages not present in the physician's note.
- Storing patient records or Electronic Health Record (EHR) persistence.

## 4. Expected Outcomes & Success Metrics
- **Speed:** Generate a complete, structured After-Visit Action Card in under 10 seconds.
- **Safety & Privacy:** 100% interception of test notes containing phone numbers or emails prior to LLM invocation.
- **Reliability:** 100% schema-compliant JSON responses verified by automated unit tests (`Vitest`) and CI checks (`GitHub Actions`).