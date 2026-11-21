import { describe, expect, it } from "vitest";
import {
  detectPII,
  formatHandoutText,
  MAX_NOTE_LENGTH,
  validateClinicalInput,
} from "../src/lib/validation";
import { afterVisitCardSchema } from "../src/lib/schema";

describe("ClearCare AI Validation & Formatting", () => {
  it("rejects clinical notes shorter than 50 characters or exceeding max length", () => {
    const shortResult = validateClinicalInput("Take paracetamol.");
    expect(shortResult.valid).toBe(false);
    expect(shortResult.error).toContain("too short");

    const longResult = validateClinicalInput("A".repeat(MAX_NOTE_LENGTH + 1));
    expect(longResult.valid).toBe(false);
    expect(longResult.error).toContain("exceeds maximum limit");
  });

  it("blocks clinical notes containing phone numbers or email addresses", () => {
    const noteWithPhone =
      "Diagnosis: Acute viral URI. Contact patient at 0917-555-0192 for follow-up instructions.";
    expect(detectPII(noteWithPhone)).toBe(true);
    expect(validateClinicalInput(noteWithPhone).valid).toBe(false);

    const noteWithEmail =
      "Diagnosis: Acute gastritis. Send lab request copy to patient.test@email.com before Friday.";
    expect(detectPII(noteWithEmail)).toBe(true);
    expect(validateClinicalInput(noteWithEmail).valid).toBe(false);
  });

  it("accepts clean anonymized clinical notes", () => {
    const cleanNote =
      "Assessment: Uncomplicated acute pharyngitis. Rx: Paracetamol 500mg 1 tab every 6 hours as needed for fever. Increase fluids.";
    const result = validateClinicalInput(cleanNote);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("validates structured card schema and formats printable handout text", () => {
    const parsed = afterVisitCardSchema.parse({
      urgencyLevel: "High-Alert Follow-Up",
      visitSummary: "Your blood pressure is elevated and needs daily monitoring.",
      medications: [
        {
          name: "Amlodipine 10mg",
          dosageAndTiming: "Take 1 tablet every morning",
          timeSlot: "Morning",
          plainPurpose: "Lowers blood pressure",
        },
      ],
      homeCareSteps: ["Reduce salty foods", "Fast 10 hours before blood test"],
      warningSigns: ["Chest pain", "Severe sudden headache"],
      followUpInstruction: "Return in 3 days with lab results.",
    });

    const handout = formatHandoutText(parsed);
    expect(handout).toContain("HIGH-ALERT FOLLOW-UP");
    expect(handout).toContain("Amlodipine 10mg");
    expect(handout).toContain("Chest pain");
  });
});