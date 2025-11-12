'use server';
/**
 * @fileOverview Analyzes an image for potential animal abuse and provides an estimate of harm.
 *
 * - analyzeAnimalAbuseImage - A function that handles the analysis of the image and provides tailored resources.
 * - AnalyzeAnimalAbuseImageInput - The input type for the analyzeAnimalAbuseImage function.
 * - AnalyzeAnimalAbuseImageOutput - The return type for the analyzeAnimalAbuseImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAnimalAbuseImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of an animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  description: z.string().describe('The description of the situation.'),
});
export type AnalyzeAnimalAbuseImageInput = z.infer<typeof AnalyzeAnimalAbuseImageInputSchema>;

const AnalyzeAnimalAbuseImageOutputSchema = z.object({
  abuseEstimate: z.string().describe('An estimate of the degree of harm, abuse, or neglect.'),
  resources: z.string().describe('Tailored resources based on the analysis.'),
});
export type AnalyzeAnimalAbuseImageOutput = z.infer<typeof AnalyzeAnimalAbuseImageOutputSchema>;

export async function analyzeAnimalAbuseImage(input: AnalyzeAnimalAbuseImageInput): Promise<AnalyzeAnimalAbuseImageOutput> {
  return analyzeAnimalAbuseImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAnimalAbuseImagePrompt',
  input: {schema: AnalyzeAnimalAbuseImageInputSchema},
  output: {schema: AnalyzeAnimalAbuseImageOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing images for potential animal abuse.

You will receive an image and a description of the situation.

Analyze the image and description to estimate the degree of harm, abuse, or neglect the animal may be experiencing. Provide a detailed explanation of your reasoning.

Based on your analysis, suggest tailored resources that can help the animal, such as local animal shelters, veterinary services, or animal welfare organizations.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Ensure the output includes:
- A clear and concise estimate of the degree of abuse (e.g., "low", "moderate", "high").
- Specific recommendations for resources based on the analysis.
`,
});

const analyzeAnimalAbuseImageFlow = ai.defineFlow(
  {
    name: 'analyzeAnimalAbuseImageFlow',
    inputSchema: AnalyzeAnimalAbuseImageInputSchema,
    outputSchema: AnalyzeAnimalAbuseImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
