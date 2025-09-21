'use server';
/**
 * @fileOverview Generates insights about a company including a SWOT analysis and competitor list.
 *
 * - generateCompanyInsights - A function that handles the company insights generation process.
 * - GenerateCompanyInsightsInput - The input type for the generateCompanyInsights function.
 * - GenerateCompanyInsightsOutput - The return type for the generateCompanyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanyInsightsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to analyze.'),
});
export type GenerateCompanyInsightsInput = z.infer<typeof GenerateCompanyInsightsInputSchema>;

const GenerateCompanyInsightsOutputSchema = z.object({
  overview: z.string().describe('A brief overview of the company.'),
  swot: z.object({
    strengths: z.array(z.string()).describe('The strengths of the company.'),
    weaknesses: z.array(z.string()).describe('The weaknesses of the company.'),
    opportunities: z.array(z.string()).describe('The opportunities for the company.'),
    threats: z.array(z.string()).describe('The threats to the company.'),
  }),
  competitors: z.array(z.string()).describe('A list of potential competitors.'),
});
export type GenerateCompanyInsightsOutput = z.infer<typeof GenerateCompanyInsightsOutputSchema>;

export async function generateCompanyInsights(
  input: GenerateCompanyInsightsInput
): Promise<GenerateCompanyInsightsOutput> {
  return generateCompanyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompanyInsightsPrompt',
  input: {schema: GenerateCompanyInsightsInputSchema},
  output: {schema: GenerateCompanyInsightsOutputSchema},
  prompt: `You are an expert market analyst. Provide a detailed analysis for the following company: {{{companyName}}}.

  Your analysis should include:
  1. A brief but comprehensive overview of the company, its mission, and what it does.
  2. A SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). Provide at least 3 points for each category.
  3. A list of at least 3-5 potential competitors.

  Company: {{{companyName}}}

  Use your knowledge to find and present this information accurately. If you cannot find information about the company, state that clearly.`,
});

const generateCompanyInsightsFlow = ai.defineFlow(
  {
    name: 'generateCompanyInsightsFlow',
    inputSchema: GenerateCompanyInsightsInputSchema,
    outputSchema: GenerateCompanyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
