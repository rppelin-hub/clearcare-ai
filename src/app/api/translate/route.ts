import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { afterVisitCardSchema } from "@/lib/schema";
import { validateClinicalInput } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clinicalNote = typeof body?.clinicalNote === "string" ? body.clinicalNote : "";
    const language = body?.language === "Taglish" ? "Taglish" : "English";

    const validation = validateClinicalInput(clinicalNote);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: GOOGLE_GENERATIVE_AI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const languageInstruction =
      language === "Taglish"
        ? "Write patient-facing explanations in warm, natural Taglish (clear English medical terms explained in everyday Filipino) suitable for Philippine outpatient clinics."
        : "Write patient-facing explanations in clear, jargon-free Plain English (Grade 6 reading level).";

    const result = await generateText({
      model: google("gemini-3.8-flash"),
      output: Output.object({ schema: afterVisitCardSchema }),
      instructions: [
        "You are ClearCare AI, a clinical communication assistant helping outpatient nurses convert physician consultation notes into structured patient after-visit instructions.",
        languageInstruction,
        "STRICT SAFETY RULES:",
        "1. Never invent or guess medication dosages not stated in the note. If a dose is unclear, write 'Verify dose with physician'.",
        "2. Translate medical abbreviations (e.g., PO BID = by mouth twice a day, PRN = as needed, NPO = no food or drink).",
        "3. Preserve every red-flag warning sign accurately.",
      ].join("\n"),
      prompt: `Translate the following anonymized consultation note into a structured After-Visit Action Card:\n\n${clinicalNote.trim()}`,
    });

    return NextResponse.json(result.output);
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Unable to generate after-visit instructions right now. Please try again." },
      { status: 500 }
    );
  }
}