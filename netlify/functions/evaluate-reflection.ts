/**
 * Netlify Function for evaluating student reflections using OpenAI GPT-5 Responses API
 * 
 * This function evaluates student reflections for educational feedback, specifically
 * designed for 6-7th grade ELL students. It provides structured feedback on three
 * key requirements: what happened, how they felt, and what they plan to do next.
 * 
 * @fileoverview Reflection evaluation function using OpenAI Responses API
 */

import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structured response schema for validation
const EvaluationResponseSchema = z.object({
  feedback: z.object({
    happened: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    }),
    feeling: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    }),
    next: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    })
  }),
  suggestions: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  status: z.enum(['needs-work', 'good', 'excellent'])
});

type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;

// Define the structured output schema for GPT-5
const GPT5ResponseSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "ReflectionEvaluation",
    strict: true,
    schema: {
      type: "object",
      properties: {
        feedback: {
          type: "object",
          properties: {
            happened: {
              type: "object",
              properties: {
                pass: { type: "boolean" },
                remarks: { type: "string" },
                suggestions: { 
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["pass", "remarks"]
            },
            feeling: {
              type: "object",
              properties: {
                pass: { type: "boolean" },
                remarks: { type: "string" },
                suggestions: { 
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["pass", "remarks"]
            },
            next: {
              type: "object",
              properties: {
                pass: { type: "boolean" },
                remarks: { type: "string" },
                suggestions: { 
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["pass", "remarks"]
            }
          },
          required: ["happened", "feeling", "next"]
        },
        suggestions: {
          type: "array",
          items: { type: "string" }
        },
        overallScore: { type: "number", minimum: 0, maximum: 100 },
        status: { 
          type: "string",
          enum: ["needs-work", "good", "excellent"]
        }
      },
      required: ["feedback", "suggestions", "overallScore", "status"]
    }
  }
};

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
    const { reflectionText } = body;

    if (!reflectionText || typeof reflectionText !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request',
          message: 'reflectionText is required and must be a string'
        }),
        { status: 400, headers }
      );
    }

    // First, check for content moderation
    const moderationResponse = await openai.moderations.create({
      input: reflectionText
    });

    if (moderationResponse.results[0].flagged) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Content flagged for review',
          message: 'The reflection content requires adult review',
          flagged: true,
          categories: moderationResponse.results[0].categories
        }),
        { status: 200, headers }
      );
    }

    // Create educational evaluation prompt
    const evaluationPrompt = `You are a supportive 6-7th grade ELL writing coach. Evaluate this student's daily reflection and provide encouraging, constructive feedback.

Student's Reflection: "${reflectionText}"

Please evaluate the reflection based on these three key requirements:
1. What happened today? (Did they describe an event or experience?)
2. How did it make them feel? (Did they express emotions or feelings?)
3. What will they do next/tomorrow? (Did they mention future plans or actions?)

Guidelines for evaluation:
- Be encouraging and supportive, never harsh or critical
- Provide specific, actionable feedback
- Use age-appropriate language (6-7th grade level)
- Focus on what they did well first, then suggest improvements
- Keep remarks under 30 words each
- Give hints and suggestions, never direct answers
- Consider this is for ELL students - be patient and clear

IMPORTANT: You MUST return ONLY valid JSON in the following exact format:
{
  "feedback": {
    "happened": {
      "pass": true/false,
      "remarks": "brief comment",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "feeling": {
      "pass": true/false,
      "remarks": "brief comment",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "next": {
      "pass": true/false,
      "remarks": "brief comment",
      "suggestions": ["suggestion1", "suggestion2"]
    }
  },
  "suggestions": ["overall suggestion 1", "overall suggestion 2"],
  "overallScore": 75,
  "status": "needs-work"
}

Do not include any text before or after the JSON. Return ONLY the JSON object.`;

    // Call OpenAI Responses API with GPT-5
    const response = await openai.responses.create({
      model: "gpt-5",
      input: evaluationPrompt,
      reasoning: {
        effort: "minimal"
      },
      max_output_tokens: 400,
      text: {
        format: {
          type: "json_object"
        },
        verbosity: "low"
      }
    });

    // Parse the response content
    const responseContent = response.output_text;
    if (!responseContent) {
      throw new Error('No response content received from OpenAI');
    }

    // Parse JSON response
    let parsedResponse: EvaluationResponse;
    try {
      // Log the raw response for debugging
      console.log('Raw OpenAI response:', responseContent);
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Raw response:', responseContent);
      throw new Error(`Failed to parse OpenAI response: ${parseError}`);
    }

    // Validate response against schema
    const validatedResponse = EvaluationResponseSchema.parse(parsedResponse);

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
    console.error('Reflection evaluation error:', error);
    
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
