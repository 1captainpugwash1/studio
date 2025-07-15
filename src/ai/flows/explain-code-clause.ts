'use server';

/**
 * @fileOverview A flow to explain a specific clause or section of the Building Code of Australia.
 *
 * - explainCodeClause - A function that handles the explanation process.
 * - ExplainCodeClauseInput - The input type for the explainCodeClause function.
 * - ExplainCodeClauseOutput - The return type for the explainCodeClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeClauseInputSchema = z.object({
  codeClause: z
    .string()
    .describe('The specific clause or section of the Building Code of Australia to explain.'),
});
export type ExplainCodeClauseInput = z.infer<typeof ExplainCodeClauseInputSchema>;

const ExplainCodeClauseOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the code clause.'),
});
export type ExplainCodeClauseOutput = z.infer<typeof ExplainCodeClauseOutputSchema>;

export async function explainCodeClause(input: ExplainCodeClauseInput): Promise<ExplainCodeClauseOutput> {
  return explainCodeClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodeClausePrompt',
  input: {schema: ExplainCodeClauseInputSchema},
  output: {schema: ExplainCodeClauseOutputSchema},
  prompt: `You are an expert in the Building Code of Australia 2022 Volumes 1 & 2.

  A user has provided the following code clause or section:
  {{codeClause}}

  Provide a clear and concise explanation of its meaning and implications, in a conversational tone.`,
});

const explainCodeClauseFlow = ai.defineFlow(
  {
    name: 'explainCodeClauseFlow',
    inputSchema: ExplainCodeClauseInputSchema,
    outputSchema: ExplainCodeClauseOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
