'use server';
/**
 * @fileOverview An AI agent that suggests relevant clauses in the Building Code of Australia based on a user's query.
 *
 * - suggestRelevantClauses - A function that suggests relevant clauses based on a user query.
 * - SuggestRelevantClausesInput - The input type for the suggestRelevantClauses function.
 * - SuggestRelevantClausesOutput - The return type for the suggestRelevantClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantClausesInputSchema = z.object({
  query: z.string().describe('The user query to find relevant clauses.'),
});
export type SuggestRelevantClausesInput = z.infer<typeof SuggestRelevantClausesInputSchema>;

const SuggestRelevantClausesOutputSchema = z.object({
  clauses: z
    .array(z.string())
    .describe('An array of relevant clauses related to the user query.'),
});
export type SuggestRelevantClausesOutput = z.infer<typeof SuggestRelevantClausesOutputSchema>;

export async function suggestRelevantClauses(input: SuggestRelevantClausesInput): Promise<SuggestRelevantClausesOutput> {
  return suggestRelevantClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantClausesPrompt',
  input: {schema: SuggestRelevantClausesInputSchema},
  output: {schema: SuggestRelevantClausesOutputSchema},
  prompt: `You are an expert in the Building Code of Australia (BCA) 2022 Volumes 1 & 2.

  Based on the user's query, suggest other relevant clauses that might be related to their query, even if they don't contain the exact search term.

  User Query: {{{query}}}
  `,
});

const suggestRelevantClausesFlow = ai.defineFlow(
  {
    name: 'suggestRelevantClausesFlow',
    inputSchema: SuggestRelevantClausesInputSchema,
    outputSchema: SuggestRelevantClausesOutputSchema,
  },
  async input => {
    let retries = 0;
    const maxRetries = 3;
    while (retries < maxRetries) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (error.message.includes('503 Service Unavailable') && retries < maxRetries - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries))); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error('Failed to get a response from the AI after multiple retries.');
  }
);
