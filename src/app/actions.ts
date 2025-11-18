"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  analyzeAnimalAbuseImage,
  type AnalyzeAnimalAbuseImageInput,
  type AnalyzeAnimalAbuseImageOutput,
} from "@/ai/flows/analyze-animal-abuse-image";
import { initializeFirebase } from "@/firebase/index";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

  try {
    await addDoc(reportsCollection, {
      description: report.description,
      location: report.location || '',
      reporterName: report.reporterName || 'Anônimo',
      reporterContact: report.reporterContact || '',
      reportDate: serverTimestamp(),
      // For now, we won't store the image URL. This can be implemented later with Firebase Storage.
      mediaUrls: [], 
      aiAnalysis: {
        abuseEstimate: analysis.abuseEstimate,
        resources: analysis.resources,
      }
    });
  } catch (error) {
    console.error("Error saving report to Firestore:", error);
    // We don't throw here to not block the user feedback, but we log the error.
  }
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

    revalidatePath("/");
    return { success: true, data: analysisResult };
  } catch (error) {
    console.error("Image analysis or report saving failed:", error);
    return { success: false, error: "Falha ao processar a denúncia. Tente novamente mais tarde." };
  }
}
