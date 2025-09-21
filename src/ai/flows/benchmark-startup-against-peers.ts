'use server';
/**
 * @fileOverview Benchmarks a startup against its peers based on metrics like ARR and burn multiple.
 *
 * - benchmarkStartupAgainstPeers - A function that handles the startup benchmarking process.
 * - BenchmarkStartupAgainstPeersInput - The input type for the benchmarkStartupAgainstPeers function.
 * - BenchmarkStartupAgainstPeersOutput - The return type for the benchmarkStartupAgainstPeers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BenchmarkStartupAgainstPeersInputSchema = z.object({
  companyName: z.string().describe('The name of the startup to benchmark.'),
  arr: z.number().describe('The annual recurring revenue of the startup.'),
  burnMultiple: z
    .number()
    .describe('The burn multiple of the startup (net burn / ARR added).'),
  industry: z.string().describe('The industry the startup operates in.'),
  stage: z.string().describe('The stage of the startup (e.g., Seed, Series A).'),
});
export type BenchmarkStartupAgainstPeersInput = z.infer<
  typeof BenchmarkStartupAgainstPeersInputSchema
>;

const BenchmarkStartupAgainstPeersOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An analysis of how the startup compares to its peers in terms of ARR and burn multiple, including specific examples of peer companies and their metrics (This data is mocked so use placeholder data).'
    ),
  radarChartData: z
    .string()
    .describe(
      'Data suitable for rendering a radar chart, showing the startup and its peers across key metrics. Format as a JSON string.'
    ),
});
export type BenchmarkStartupAgainstPeersOutput = z.infer<
  typeof BenchmarkStartupAgainstPeersOutputSchema
>;

export async function benchmarkStartupAgainstPeers(
  input: BenchmarkStartupAgainstPeersInput
): Promise<BenchmarkStartupAgainstPeersOutput> {
  return benchmarkStartupAgainstPeersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'benchmarkStartupAgainstPeersPrompt',
  input: {schema: BenchmarkStartupAgainstPeersInputSchema},
  output: {schema: BenchmarkStartupAgainstPeersOutputSchema},
  prompt: `You are an expert venture capital analyst.

You will analyze a startup's performance against its peers based on its ARR and burn multiple.

Provide an analysis of how the startup compares to its peers, including specific examples of peer companies and their metrics.  This data is mocked so use placeholder data.

Also generate data suitable for rendering a radar chart, showing the startup and its peers across key metrics. Format the radarChartData as a JSON string.

Startup Name: {{{companyName}}}
ARR: {{{arr}}}
Burn Multiple: {{{burnMultiple}}}
Industry: {{{industry}}}
Stage: {{{stage}}}`,
});

const benchmarkStartupAgainstPeersFlow = ai.defineFlow(
  {
    name: 'benchmarkStartupAgainstPeersFlow',
    inputSchema: BenchmarkStartupAgainstPeersInputSchema,
    outputSchema: BenchmarkStartupAgainstPeersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
