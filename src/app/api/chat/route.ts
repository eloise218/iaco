export const runtime = "nodejs";
import { auth } from '@/lib/auth';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import db from '@/db/drizzle';
import { chatMessages, userProfiles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';

/**
 * POST /api/chat
 * 
 * Handles chat message submission and AI response streaming.
 * 
 * Requirements:
 * - 3.1: Validates user session using BetterAuth
 * - 3.2: Loads conversation history and user profile
 * - 3.3: Integrates Vercel AI SDK with streaming
 * - 3.4: Implements message persistence
 * - 5.1, 5.2: Saves user and assistant messages
 * - 8.2, 8.3: Error handling and authentication
 */
export async function POST(req: Request) {
  try {
    // Subtask 3.1: Authenticate user
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Please sign in to use the chat assistant.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate incoming message
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Subtask 3.2: Load user profile for context personalization
    let profile;
;
    try {
      const dbProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, session.user.id),
      });

      // Transform database profile to match expected UserProfile type
      if (dbProfile && dbProfile.investmentObjectives) {
    
        const objectives: string[] = Array.isArray(dbProfile.investmentObjectives)
          ? dbProfile.investmentObjectives.filter(
            (x): x is string => typeof x === "string"
            )
          : [];        
        profile = {
          experienceLevel: dbProfile.experienceLevel,
          investmentObjectives: objectives,
          riskTolerance: dbProfile.riskTolerance || 'low',
        };
      }
    } catch (dbError) {
      console.error('Error loading user profile:', dbError);
      // Continue without profile - not critical for chat functionality
    }

    // Subtask 3.2: Query last 20 messages from chat_messages table
    let history: Array<{ role: string; content: string }> = [];
    try {
      history = await db.query.chatMessages.findMany({
        where: eq(chatMessages.userId, session.user.id),
        orderBy: [desc(chatMessages.createdAt)],
        limit: 20,
      });
    } catch (dbError) {
      console.error('Error loading chat history:', dbError);
      // Continue with empty history if database fails
      history = [];
    }

    // Subtask 3.2: Build context messages array
    const contextMessages = history
      .reverse() // Convert to chronological order
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Add current user message to context
    contextMessages.push({
      role: 'user' as const,
      content: message,
    });

    // Subtask 3.4: Save user message to database before AI call
    try {
      await db.insert(chatMessages).values({
        userId: session.user.id,
        role: 'user',
        content: message,
      });
    } catch (dbError) {
      console.error('Error saving user message to database:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save your message. Please try again.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Subtask 3.3: Call streamText with OpenAI model
    let result;
    try {
      result = streamText({
        model: openai('gpt-4-turbo'),
        system: buildSystemPrompt(profile),
        messages: contextMessages,
        temperature: 0.7,
      });
    } catch (aiError: unknown) {
      console.error('AI API error:', aiError);

      // Subtask 3.5: Handle rate limit errors with retry-after
      const error = aiError as { status?: number; code?: string; message?: string };
      if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
        return new Response(
          JSON.stringify({
            error: 'Too many requests. Please wait a moment and try again.',
            retryAfter: 60
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60'
            },
          }
        );
      }

      // Handle quota exceeded errors
      if (error?.status === 402 || error?.code === 'insufficient_quota') {
        return new Response(
          JSON.stringify({
            error: 'Service temporarily unavailable. Please try again later.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle invalid API key or authentication errors
      if (error?.status === 401 || error?.code === 'invalid_api_key') {
        console.error('AI API authentication error - check API key configuration');
        return new Response(
          JSON.stringify({
            error: 'Service configuration error. Please contact support.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle model not found or invalid model errors
      if (error?.status === 404 || error?.code === 'model_not_found') {
        console.error('AI model not found - check model configuration');
        return new Response(
          JSON.stringify({
            error: 'Service configuration error. Please contact support.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle timeout errors
      if (error?.code === 'timeout' || error?.message?.includes('timeout')) {
        return new Response(
          JSON.stringify({
            error: 'Request timed out. Please try again with a shorter message.'
          }),
          {
            status: 504,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Generic AI API error
      return new Response(
        JSON.stringify({
          error: 'Unable to generate a response. Please try again.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Subtask 3.4: Save assistant response after streaming completes
    // Collect the full response text asynchronously
    (async () => {
      try {
        let fullResponse = '';
        for await (const chunk of result.textStream) {
          fullResponse += chunk;
        }

        // Save the complete response to database
        await db.insert(chatMessages).values({
          userId: session.user.id,
          role: 'assistant',
          content: fullResponse,
        });
      } catch (dbError) {
        console.error('Error saving assistant message to database:', dbError);
        // Don't throw - we've already started streaming to the client
      }
    })();

    // Subtask 3.3: Return streaming response with proper headers
    return result.toTextStreamResponse();

  } catch (error) {
    // Subtask 3.5: Catch and log AI API errors
    console.error('Unexpected chat API error:', error);

    // Subtask 3.5: Return user-friendly error messages
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
