import type { AfterVisitCard } from "./schema";

export const MIN_NOTE_LENGTH = 50;
export const MAX_NOTE_LENGTH = 6000;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3,4}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

export function detectPII(text: string): boolean {
  return EMAIL_REGEX.test(text) || PHONE_REGEX.test(text);
}

export function validateClinicalInput(text: string): ValidationResult {
  const trimmed = text.trim();

  if (trimmed.length < MIN_NOTE_LENGTH) {
    return {
      valid: false,
      error: `Clinical note is too short (${trimmed.length}/${MIN_NOTE_LENGTH} characters minimum).`,
    };
  }

  if (trimmed.length > MAX_NOTE_LENGTH) {
    return {
      valid: false,
      error: `Clinical note exceeds maximum limit (${trimmed.length}/${MAX_NOTE_LENGTH} characters).`,
    };
  }

  if (detectPII(trimmed)) {
    return {
      valid: false,
      error:
        "Personal identifiable information (phone number or email) detected. Remove patient identifiers before translating.",
    };
  }

  return { valid: true };
}

export function formatHandoutText(card: AfterVisitCard): string {
  const meds =
    card.medications.length > 0
      ? card.medications
          .map((m) => `- [${m.timeSlot}] ${m.name}: ${m.dosageAndTiming} (${m.plainPurpose})`)
          .join("\n")
      : "- No medications prescribed.";

  const care = card.homeCareSteps.map((s) => `- ${s}`).join("\n");
  const warnings = card.warningSigns.map((w) => `! ${w}`).join("\n");

  return [
    `CLINIC AFTER-VISIT CARE SUMMARY (${card.urgencyLevel.toUpperCase()})`,
    `--------------------------------------------------`,
    `VISIT SUMMARY:\n${card.visitSummary}`,
    `\nMEDICATION SCHEDULE:\n${meds}`,
    `\nHOME CARE & PREPARATION:\n${care}`,
    `\nWARNING SIGNS (SEEK IMMEDIATE CARE IF THESE OCCUR):\n${warnings}`,
    `\nFOLLOW-UP:\n${card.followUpInstruction}`,
    `\n[Verified by Clinic Staff — For patient education only]`,
  ].join("\n");
}