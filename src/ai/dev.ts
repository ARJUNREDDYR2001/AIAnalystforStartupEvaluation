import { config } from 'dotenv';
config();

import '@/ai/flows/generate-integrity-score.ts';
import '@/ai/flows/generate-due-diligence-questions.ts';
import '@/ai/flows/detect-document-discrepancies.ts';
import '@/ai/flows/benchmark-startup-against-peers.ts';