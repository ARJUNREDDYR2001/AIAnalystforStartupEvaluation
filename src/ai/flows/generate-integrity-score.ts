'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing founder bios and generating an integrity and cohesion score.
 *
 * It includes:
 * - generateIntegrityScore:  A function that takes founder bios as input and returns an integrity score, green lights, and red flags.
 * - GenerateIntegrityScoreInput: The input type for the generateIntegrityScore function.
 * - GenerateIntegrityScoreOutput: The output type for the generateIntegrityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIntegrityScoreInputSchema = z.object({
  founderBios: z
    .string()
    .describe('The bios of the founders to be analyzed.'),
});
export type GenerateIntegrityScoreInput = z.infer<typeof GenerateIntegrityScoreInputSchema>;

const GenerateIntegrityScoreOutputSchema = z.object({
  integrityScore: z
    .string()
    .describe('The overall integrity and cohesion score (A-F).'),
  greenLights: z.string().describe('Top positive aspects of the founders.'),
  redFlags: z.string().describe('Potential concerns or weaknesses of the founders.'),
});
export type GenerateIntegrityScoreOutput = z.infer<typeof GenerateIntegrityScoreOutputSchema>;

export async function generateIntegrityScore(
  input: GenerateIntegrityScoreInput
): Promise<GenerateIntegrityScoreOutput> {
  return generateIntegrityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIntegrityScorePrompt',
  input: {schema: GenerateIntegrityScoreInputSchema},
  output: {schema: GenerateIntegrityScoreOutputSchema},
  prompt: `You are an AI assistant specializing in assessing the integrity and cohesion of startup founders based on their biographies.

  Analyze the following founder bios and provide:

  1.  An overall integrity and cohesion score (A-F).
  2.  Top 3 green lights (positive aspects).
  3.  Top 3 red flags (potential concerns).

  Founder Bios: {{{founderBios}}}

  Ensure the output is well-structured and easy to understand.
  `,
});

const generateIntegrityScoreFlow = ai.defineFlow(
  {
    name: 'generateIntegrityScoreFlow',
    inputSchema: GenerateIntegrityScoreInputSchema,
    outputSchema: GenerateIntegrityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
