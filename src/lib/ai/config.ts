/**
 * AI SDK Configuration
 *
 * Supports OpenAI, Google Gemini and Mistral. Set AI_PROVIDER in .env.local to switch.
 */

import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';

export const AI_CONFIG = {
  temperature: 0.7,
  maxTokens: 1000,
  maxHistoryMessages: 20,
} as const;

/**
 * Returns the chat model based on AI_PROVIDER env variable.
 * - "gemini"  → Google Gemini 2.0 Flash  (requires GOOGLE_GENERATIVE_AI_API_KEY)
 * - "mistral" → Mistral Small Latest     (requires MISTRAL_API_KEY)
 * - "openai"  → OpenAI GPT-4o Mini       (requires OPENAI_API_KEY)
 */
export function getChatModel() {
  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'gemini') {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
    }
    return google('gemini-2.0-flash');
  }

  if (provider === 'mistral') {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY environment variable is not set');
    }
    return mistral('mistral-small-latest');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return openai('gpt-4o-mini');
}
