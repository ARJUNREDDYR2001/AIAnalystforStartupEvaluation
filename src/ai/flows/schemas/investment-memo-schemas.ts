import { z } from 'genkit';

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
