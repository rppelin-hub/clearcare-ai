import { z } from "zod";

export const afterVisitCardSchema = z.object({
  urgencyLevel: z
    .enum(["Routine", "High-Alert Follow-Up"])
    .describe("High-Alert Follow-Up if urgent red flags or critical monitoring are present; otherwise Routine."),
  visitSummary: z
    .string()
    .describe("2-3 sentence plain-language explanation of the diagnosis and visit purpose."),
  medications: z.array(
    z.object({
      name: z.string().describe("Medication name and strength."),
      dosageAndTiming: z.string().describe("Exact amount and frequency translated into plain words."),
      timeSlot: z.enum(["Morning", "Afternoon", "Evening", "As Needed"]),
      plainPurpose: z.string().describe("Short plain-language reason for taking this medication."),
    })
  ),
  homeCareSteps: z
    .array(z.string())
    .describe("Actionable diet, rest, hydration, or lab preparation instructions."),
  warningSigns: z
    .array(z.string())
    .describe("Specific symptoms requiring immediate return to the clinic or emergency room."),
  followUpInstruction: z
    .string()
    .describe("When to return for follow-up or what lab results to bring."),
});

export type AfterVisitCard = z.infer<typeof afterVisitCardSchema>;