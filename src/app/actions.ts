"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { initializeFirebase } from "@/firebase/index";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";

const ReportSchema = z.object({
  description: z.string(),
  location: z.string().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
  photoDataUri: z.string(),
});

type ReportInput = z.infer<typeof ReportSchema>;

async function saveReportToFirestore(report: ReportInput) {
  const { firestore } = initializeFirebase();
  const reportsCollection = collection(firestore, 'incident_reports');

  const reportData = {
    description: report.description,
    location: report.location || '',
    reporterName: report.reporterName || 'Anônimo',
    reporterContact: report.reporterContact || '',
    reportDate: serverTimestamp(),
    mediaUrls: [report.photoDataUri],
  };
  
  // Usando addDoc diretamente para garantir que a operação seja concluída.
  await addDoc(reportsCollection, reportData);
}

export async function handleSaveReport(
  input: ReportInput
): Promise<{ success: boolean; error?: string }> {
  const parsedInput = ReportSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Dados de entrada inválidos." };
  }

  const reportData = parsedInput.data;

  try {
    await saveReportToFirestore(reportData);

    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    console.error("Report saving failed:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message || "Falha ao processar a denúncia." };
    }
    return { success: false, error: "Falha ao processar a denúncia. Tente novamente mais tarde." };
  }
}
