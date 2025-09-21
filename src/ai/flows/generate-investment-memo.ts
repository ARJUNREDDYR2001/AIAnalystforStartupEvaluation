'use server';
/**
 * @fileOverview Generates a comprehensive investment memo by synthesizing various analyses.
 *
 * - generateInvestmentMemo - A function that synthesizes analyses and provides an investment recommendation.
 * - GenerateInvestmentMemoInput - The input type for the generateInvestmentMemo function.
 * - GenerateInvestmentMemoOutput - The return type for the generateInvestmentMemo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateInvestmentMemoInputSchema = z.object({
    companyName: z.string().describe("The name of the company being analyzed."),
    founderAnalysis: z.string().describe("JSON string of the founder analysis result (integrity score, green lights, red flags)."),
    documentAnalysis: z.string().describe("JSON string of the document discrepancy analysis result."),
    peerAnalysis: z.string().describe("JSON string of the peer benchmark analysis result."),
    companyInsights: z.string().describe("JSON string of the company insights (SWOT, competitors)."),
    weights: z.object({
        team: z.number().min(0).max(100).describe("The weight (0-100) assigned to the team/founder strength."),
        product: z.number().min(0).max(100).describe("The weight (0-100) assigned to the product/market fit and document analysis."),
        market: z.number().min(0).max(100).describe("The weight (0-100) assigned to the market opportunity and competitive landscape."),
    }).describe("Investor's customizable weights for the final recommendation.")
});
export type GenerateInvestmentMemoInput = z.infer<typeof GenerateInvestmentMemoInputSchema>;

export const GenerateInvestmentMemoOutputSchema = z.object({
    executiveSummary: z.string().describe("A concise summary of the investment opportunity, including the final recommendation."),
    recommendation: z.enum(['Invest', 'Pass']).describe("The final investment recommendation."),
    overallScore: z.number().min(0).max(100).describe("A final weighted score for the investment opportunity (0-100)."),
    detailedRationale: z.string().describe("A detailed breakdown of the reasoning behind the recommendation, considering all analysis inputs and weights."),
});
export type GenerateInvestmentMemoOutput = z.infer<typeof GenerateInvestmentMemoOutputSchema>;

export async function generateInvestmentMemo(
  input: GenerateInvestmentMemoInput
): Promise<GenerateInvestmentMemoOutput> {
  return generateInvestmentMemoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvestmentMemoPrompt',
  input: {schema: GenerateInvestmentMemoInputSchema},
  output: {schema: GenerateInvestmentMemoOutputSchema},
  prompt: `You are a world-class venture capital analyst. Your task is to synthesize multiple streams of analysis into a single, actionable investment memo for the partners.

You must provide a clear "Invest" or "Pass" recommendation based on the provided data and the investor's preferred weightings.

Company Being Analyzed: {{{companyName}}}

Analysis Inputs:
1. Founder Analysis: {{{founderAnalysis}}}
2. Document Discrepancy Analysis: {{{documentAnalysis}}}
3. Peer Benchmark Analysis: {{{peerAnalysis}}}
4. Company Insights (SWOT & Competitors): {{{companyInsights}}}

Investor Weightings:
- Team: {{{weights.team}}}%
- Product (including document analysis): {{{weights.product}}}%
- Market (including peer and competitor analysis): {{{weights.market}}}%

Your task is to:
1.  Calculate an 'overallScore' (0-100) based on the inputs and the provided weights. A score above 70 is generally positive.
2.  Determine a final 'recommendation' ('Invest' or 'Pass') based on the score and a holistic view of the data. Don't just rely on the score; consider critical red flags that might warrant a 'Pass' even with a high score.
3.  Write a concise 'executiveSummary' that starts with the recommendation and then briefly justifies it.
4.  Provide a 'detailedRationale' explaining how you arrived at your conclusion, referencing specific points from the analyses and how they were evaluated against the investor's weights.
`,
});

const generateInvestmentMemoFlow = ai.defineFlow(
  {
    name: 'generateInvestmentMemoFlow',
    inputSchema: GenerateInvestmentMemoInputSchema,
    outputSchema: GenerateInvestmentMemoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
