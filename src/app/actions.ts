"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  analyzeAnimalAbuseImage,
  type AnalyzeAnimalAbuseImageInput,
  type AnalyzeAnimalAbuseImageOutput,
} from "@/ai/flows/analyze-animal-abuse-image";

const AnalyzeInputSchema = z.object({
  photoDataUri: z.string(),
  description: z.string(),
});

export async function handleImageAnalysis(
  input: AnalyzeAnimalAbuseImageInput
): Promise<{ success: boolean; data?: AnalyzeAnimalAbuseImageOutput; error?: string }> {
  const parsedInput = AnalyzeInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Dados de entrada inválidos." };
  }

  try {
    const result = await analyzeAnimalAbuseImage(parsedInput.data);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Image analysis failed:", error);
    return { success: false, error: "Falha ao analisar a imagem. Tente novamente mais tarde." };
  }
}
