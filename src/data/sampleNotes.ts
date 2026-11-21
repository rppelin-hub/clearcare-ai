export interface SampleNote {
  id: string;
  label: string;
  text: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: "routine",
    label: "Sample 1: Routine Tonsillitis",
    text: `CHIEF COMPLAINT: Sore throat and low-grade fever x 2 days.
ASSESSMENT: Acute bacterial tonsillopharyngitis, uncomplicated.
PLAN / RX:
1. Co-Amoxiclav 625mg tab - 1 tab PO BID (every 12 hours) after meals x 7 days. Complete full course.
2. Paracetamol 500mg tab - 1 tab PO q6h PRN for temp >= 38.0 C or throat pain.
3. Benzydamine difflam throat spray - 2 puffs to affected area TID PRN.
ADVICE: Increase oral fluid intake (2-3L/day), warm saline gargles TID, soft diet, avoid cold/acidic beverages.
RETURN PRECAUTIONS: Return immediately to ER/clinic if unable to swallow liquids, difficulty breathing, trismus, or persistent fever > 39 C after 48 hours of antibiotics. Follow up in 7 days if symptoms persist.`,
  },
  {
    id: "high-alert",
    label: "Sample 2: High-Alert Hypertension",
    text: `CHIEF COMPLAINT: Occipital headache and elevated home BP reading (165/100 mmHg).
ASSESSMENT: Uncontrolled Stage 2 Hypertension; r/o target organ involvement.
PLAN / RX:
1. Amlodipine 10mg tab - 1 tab OD every morning.
2. Losartan 50mg tab - 1 tab OD every evening.
3. Labs requested: Fasting Blood Sugar (FBS), Lipid Profile, Serum Creatinine, 12-lead ECG prior to next visit.
ADVICE: Strict low-sodium diet (<2g salt/day), avoid processed/canned foods, log AM and PM BP daily in a notebook. NPO for 10-12 hours prior to morning blood extraction.
RETURN PRECAUTIONS: HIGH ALERT - Proceed immediately to nearest Emergency Room if BP >= 180/120 mmHg, or if experiencing chest pain, shortness of breath, sudden severe headache, blurred vision, or unilateral numbness/weakness. Clinic re-evaluation in 3 days with lab results.`,
  },
  {
    id: "pii-test",
    label: "Sample 3: PII Guardrail Test",
    text: `Patient: Juan Dela Cruz, 45/M | Contact: 0917-555-0192 | Email: juan.delacruz@email.com
Diagnosis: Acute Viral Upper Respiratory Tract Infection.
Rx: Cetirizine 10mg tab OD at bedtime x 5 days. Plenty of rest and fluids.`,
  },
];