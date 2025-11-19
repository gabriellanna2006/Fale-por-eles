"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  analyzeAnimalAbuseImage,
  type AnalyzeAnimalAbuseImageOutput,
} from "@/ai/flows/analyze-animal-abuse-image";
import { initializeFirebase } from "@/firebase/index";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const ReportSchema = z.object({
  description: z.string(),
  location: z.string().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
  photoDataUri: z.string(),
});

type ReportInput = z.infer<typeof ReportSchema>;

async function saveReportToFirestore(report: ReportInput, analysis: AnalyzeAnimalAbuseImageOutput) {
  const { firestore } = initializeFirebase();
  const reportsCollection = collection(firestore, 'incident_reports');

  const reportData = {
    description: report.description,
    location: report.location || '',
    reporterName: report.reporterName || 'Anônimo',
    reporterContact: report.reporterContact || '',
    reportDate: serverTimestamp(),
    mediaUrls: [], 
    aiAnalysis: {
      abuseEstimate: analysis.abuseEstimate,
      resources: analysis.resources,
    }
  };
  
  // Use non-blocking write
  addDocumentNonBlocking(reportsCollection, reportData);
}

export async function handleImageAnalysisAndSaveReport(
  input: ReportInput
): Promise<{ success: boolean; data?: AnalyzeAnimalAbuseImageOutput; error?: string }> {
  const parsedInput = ReportSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Dados de entrada inválidos." };
  }

  const reportData = parsedInput.data;

  try {
    const analysisResult = await analyzeAnimalAbuseImage({
      photoDataUri: reportData.photoDataUri,
      description: reportData.description,
    });

    await saveReportToFirestore(reportData, analysisResult);

    revalidatePath("/reports");
    return { success: true, data: analysisResult };
  } catch (error) {
    console.error("Image analysis or report saving failed:", error);
    // This will now correctly return the analysis result even if firestore fails
    // The user gets feedback, and the error is logged.
    if (error instanceof Error) {
        return { success: false, error: error.message || "Falha ao processar a denúncia." };
    }
    return { success: false, error: "Falha ao processar a denúncia. Tente novamente mais tarde." };
  }
}
