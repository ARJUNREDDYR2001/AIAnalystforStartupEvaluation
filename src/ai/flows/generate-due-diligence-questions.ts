'use server';
/**
 * @fileOverview Generates founder-specific due diligence questions based on AI analysis of their bios.
 *
 * - generateDueDiligenceQuestions - A function to generate due diligence questions.
 * - GenerateDueDiligenceQuestionsInput - The input type for the generateDueDiligenceQuestions function.
 * - GenerateDueDiligenceQuestionsOutput - The return type for the generateDueDiligenceQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDueDiligenceQuestionsInputSchema = z.object({
  founderBios: z.string().describe('The bios of the founders to analyze.'),
  integrityScore: z.string().describe('The integrity score (A-F) of the founders.'),
  cohesionScore: z.string().describe('The cohesion score (A-F) of the founders.'),
  topGreenLights: z.string().describe('The top green lights from the founder bios analysis.'),
  topRedFlags: z.string().describe('The top red flags from the founder bios analysis.'),
});
export type GenerateDueDiligenceQuestionsInput = z.infer<
  typeof GenerateDueDiligenceQuestionsInputSchema
>;

const GenerateDueDiligenceQuestionsOutputSchema = z.object({
  dueDiligenceQuestions: z
    .string()
    .describe('The generated due diligence questions for the founders.'),
});
export type GenerateDueDiligenceQuestionsOutput = z.infer<
  typeof GenerateDueDiligenceQuestionsOutputSchema
>;

export async function generateDueDiligenceQuestions(
  input: GenerateDueDiligenceQuestionsInput
): Promise<GenerateDueDiligenceQuestionsOutput> {
  return generateDueDiligenceQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDueDiligenceQuestionsPrompt',
  input: {schema: GenerateDueDiligenceQuestionsInputSchema},
  output: {schema: GenerateDueDiligenceQuestionsOutputSchema},
  prompt: `You are an expert venture capital analyst preparing for a due diligence meeting with startup founders.
  Based on the provided analysis of the founders' bios, generate a list of targeted due diligence questions.
  The questions should aim to uncover potential risks and validate the founders' claims and capabilities.

  Founder Bios: {{{founderBios}}}
  Integrity Score: {{{integrityScore}}}
  Cohesion Score: {{{cohesionScore}}}
  Top Green Lights: {{{topGreenLights}}}
  Top Red Flags: {{{topRedFlags}}}

  Generate a list of specific, insightful, and challenging due diligence questions for the founders. The questions should be very specific, and the output should only be the list of questions, one question per line.
  `,
});

const generateDueDiligenceQuestionsFlow = ai.defineFlow(
  {
    name: 'generateDueDiligenceQuestionsFlow',
    inputSchema: GenerateDueDiligenceQuestionsInputSchema,
    outputSchema: GenerateDueDiligenceQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
