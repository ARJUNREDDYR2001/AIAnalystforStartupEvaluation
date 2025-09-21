'use server';

import { ai } from '@/ai/genkit';
import { 
  GenerateInvestmentMemoInput, 
  GenerateInvestmentMemoOutput,
  GenerateInvestmentMemoInputSchema,
  GenerateInvestmentMemoOutputSchema 
} from './schemas/investment-memo-schemas';

// Server Action
export async function generateInvestmentMemo(input: GenerateInvestmentMemoInput): Promise<GenerateInvestmentMemoOutput> {
    try {
        const prompt = ai.definePrompt({
            name: 'generateInvestmentMemoPrompt',
            input: { schema: GenerateInvestmentMemoInputSchema },
            output: { schema: GenerateInvestmentMemoOutputSchema },
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
1. Calculate an 'overallScore' (0-100) based on the inputs and the provided weights. A score above 70 is generally positive.
2. Determine a final 'recommendation' ('Invest' or 'Pass') based on the score and a holistic view of the data.
3. Write a concise 'executiveSummary' that starts with the recommendation and then briefly justifies it.
4. Provide a 'detailedRationale' explaining how you arrived at your conclusion, referencing specific points from the analyses and how they were evaluated against the investor's weights.`
        });

        const { output } = await prompt(input);
        if (!output) {
            throw new Error('Failed to generate investment memo');
        }
        
        return output;
    } catch (error) {
        console.error('Error in generateInvestmentMemo:', error);
        throw new Error('Failed to generate investment memo');
    }
}
