import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-relevant-clauses.ts';
import '@/ai/flows/answer-bca-query.ts';
import '@/ai/flows/explain-code-clause.ts';