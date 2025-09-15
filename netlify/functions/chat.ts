/**
 * Netlify Function for contextual chat assistance with reflection learning
 * 
 * This function provides conversational help for students working on their
 * daily reflections. It maintains context about the current reflection and
 * provides educational hints without giving direct answers.
 * 
 * @fileoverview Contextual chat function for reflection learning support
 */

import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the chat response schema for validation
const ChatResponseSchema = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
  context: z.enum(['general', 'reflection-help', 'feedback-discussion']),
  helpful: z.boolean()
});

type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * Main handler function for the Netlify function
 */
export default async function handler(request: Request): Promise<Response> {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          message: 'Please set OPENAI_API_KEY environment variable'
        }),
        { status: 500, headers }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      message, 
      reflectionText, 
      chatHistory = [], 
      context = 'general',
      currentFeedback = null
    } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request',
          message: 'message is required and must be a string'
        }),
        { status: 400, headers }
      );
    }

    // First, check for content moderation
    const moderationResponse = await openai.moderations.create({
      input: message
    });

    if (moderationResponse.results[0].flagged) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Content flagged for review',
          message: 'Your message requires adult review',
          flagged: true
        }),
        { status: 200, headers }
      );
    }

    // Build context-aware prompt
    let systemPrompt = `You are a supportive 6-7th grade ELL writing coach helping students fix their daily reflections to pass.

Your role:
- Help students identify what's missing to get a passing score
- Give ONE specific, actionable fix at a time
- Use simple, encouraging language
- Focus on the three requirements: what happened, how they felt, what they'll do next

Guidelines:
- Keep responses under 60 words
- Give ONE clear suggestion, not a list
- Ask ONE simple question to help them think
- Be encouraging but focused on the fix
- If they have multiple issues, mention 2-3 briefly, then focus on the most important one
- IMPORTANT: If their score is 75% or higher, say "Your reflection looks great! Ready to submit?" and stop asking for changes
- Don't be overly critical - if they have the basic elements, they should pass`;

    // Add reflection context if available
    if (reflectionText && reflectionText.trim()) {
      systemPrompt += `\n\nCurrent reflection the student is working on: "${reflectionText}"`;
    }

    // Add feedback context if available
    if (currentFeedback) {
      systemPrompt += `\n\nCurrent feedback on their reflection:`;
      if (currentFeedback.feedback) {
        systemPrompt += `\n- What happened: ${currentFeedback.feedback.happened.pass ? 'PASS' : 'NEEDS WORK'} - ${currentFeedback.feedback.happened.remarks}`;
        if (currentFeedback.feedback.happened.suggestions && currentFeedback.feedback.happened.suggestions.length > 0) {
          systemPrompt += ` Suggestion: ${currentFeedback.feedback.happened.suggestions[0]}`;
        }
        
        systemPrompt += `\n- How they felt: ${currentFeedback.feedback.feeling.pass ? 'PASS' : 'NEEDS WORK'} - ${currentFeedback.feedback.feeling.remarks}`;
        if (currentFeedback.feedback.feeling.suggestions && currentFeedback.feedback.feeling.suggestions.length > 0) {
          systemPrompt += ` Suggestion: ${currentFeedback.feedback.feeling.suggestions[0]}`;
        }
        
        systemPrompt += `\n- What they'll do next: ${currentFeedback.feedback.next.pass ? 'PASS' : 'NEEDS WORK'} - ${currentFeedback.feedback.next.remarks}`;
        if (currentFeedback.feedback.next.suggestions && currentFeedback.feedback.next.suggestions.length > 0) {
          systemPrompt += ` Suggestion: ${currentFeedback.feedback.next.suggestions[0]}`;
        }
      }
      systemPrompt += `\nOverall score: ${currentFeedback.overallScore}%`;
    }

    // Add chat history context
    if (chatHistory && chatHistory.length > 0) {
      systemPrompt += `\n\nRecent conversation:\n`;
      chatHistory.slice(-5).forEach((msg: any) => {
        systemPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    // Add context-specific guidance
    switch (context) {
      case 'reflection-help':
        systemPrompt += `\n\nFocus on helping them improve their reflection writing. Guide them to include what happened, how they felt, and what they plan to do next.`;
        break;
      case 'feedback-discussion':
        systemPrompt += `\n\nHelp them understand the feedback they received and how to improve their reflection.`;
        break;
      default:
        systemPrompt += `\n\nProvide general help with their reflection writing.`;
    }

    systemPrompt += `\n\nStudent's question: "${message}"`;

    // Call OpenAI Responses API with GPT-5
    const response = await openai.responses.create({
      model: "gpt-5",
      input: systemPrompt,
      reasoning: {
        effort: "minimal"
      },
      max_output_tokens: 200,
      text: {
        verbosity: "low"
      }
    });

    // Parse the response content
    const responseContent = response.output_text;
    if (!responseContent) {
      throw new Error('No response content received from OpenAI');
    }

    // Create structured response
    const chatResponse: ChatResponse = {
      response: responseContent.trim(),
      context: context as 'general' | 'reflection-help' | 'feedback-discussion',
      helpful: true
    };

    // Validate response
    const validatedResponse = ChatResponseSchema.parse(chatResponse);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: validatedResponse,
        model_used: response.model,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Chat function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers }
    );
  }
}
