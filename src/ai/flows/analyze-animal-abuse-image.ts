'use server';
/**
 * @fileOverview This file is no longer in use.
 */

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
  // This flow is no longer active.
  return Promise.resolve({
      abuseEstimate: '',
      resources: ''
  });
}
