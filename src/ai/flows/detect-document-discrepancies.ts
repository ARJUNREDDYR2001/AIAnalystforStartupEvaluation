'use server';
/**
 * @fileOverview Detects discrepancies in key numbers and claims within uploaded documents.
 *
 * - detectDocumentDiscrepancies - A function that handles the document discrepancy detection process.
 * - DetectDocumentDiscrepanciesInput - The input type for the detectDocumentDiscrepancies function.
 * - DetectDocumentDiscrepanciesOutput - The return type for the detectDocumentDiscrepancies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDocumentDiscrepanciesInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to analyze.'),
  documentType: z.enum(['pdf', 'ppt', 'text']).describe('The type of the document.'),
});
export type DetectDocumentDiscrepanciesInput = z.infer<typeof DetectDocumentDiscrepanciesInputSchema>;

const DiscrepancySchema = z.object({
  description: z.string().describe('A description of the discrepancy found.'),
  pageNumber: z.number().optional().describe('The page number where the discrepancy was found (if applicable).'),
  sourceText1: z.string().describe('The first piece of text containing the discrepancy.'),
  sourceText2: z.string().describe('The second piece of text containing the discrepancy.'),
});

const DetectDocumentDiscrepanciesOutputSchema = z.object({
  discrepancies: z.array(DiscrepancySchema).describe('An array of discrepancies found in the document.'),
});
export type DetectDocumentDiscrepanciesOutput = z.infer<typeof DetectDocumentDiscrepanciesOutputSchema>;

export async function detectDocumentDiscrepancies(input: DetectDocumentDiscrepanciesInput): Promise<DetectDocumentDiscrepanciesOutput> {
  return detectDocumentDiscrepanciesFlow(input);
}

const detectDocumentDiscrepanciesPrompt = ai.definePrompt({
  name: 'detectDocumentDiscrepanciesPrompt',
  input: {schema: DetectDocumentDiscrepanciesInputSchema},
  output: {schema: DetectDocumentDiscrepanciesOutputSchema},
  prompt: `You are an expert at identifying discrepancies in documents.

  Analyze the following document content and identify any discrepancies in key numbers and claims. Provide a detailed description of each discrepancy, including the page number (if available) and the source text where the discrepancy was found.

  Document Type: {{{documentType}}}
  Document Content: {{{documentContent}}}

  Format your response as a JSON array of discrepancies, where each discrepancy object includes a description, pageNumber, sourceText1, and sourceText2.
  `,
});

const detectDocumentDiscrepanciesFlow = ai.defineFlow(
  {
    name: 'detectDocumentDiscrepanciesFlow',
    inputSchema: DetectDocumentDiscrepanciesInputSchema,
    outputSchema: DetectDocumentDiscrepanciesOutputSchema,
  },
  async input => {
    const {output} = await detectDocumentDiscrepanciesPrompt(input);
    return output!;
  }
);
