/**
 * Netlify Function for testing OpenAI GPT-5 Responses API
 * 
 * This function demonstrates the proper setup for using OpenAI's Responses API
 * with GPT-5, following the 2025 documentation guidelines for the new API.
 * 
 * @fileoverview OpenAI GPT-5 test function using Responses API
 */

import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the response schema for validation
const TestResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timestamp: z.string(),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }).optional(),
});

type TestResponse = z.infer<typeof TestResponseSchema>;

// Define the structured output schema for GPT-5
const GPT5ResponseSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "TestResponse",
    strict: true,
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        timestamp: { type: "string" },
        model: { type: "string" },
        usage: {
          type: "object",
          properties: {
            prompt_tokens: { type: "number" },
            completion_tokens: { type: "number" },
            total_tokens: { type: "number" },
          },
          required: ["prompt_tokens", "completion_tokens", "total_tokens"],
        },
      },
      required: ["success", "message", "timestamp", "model", "usage"],
    },
  },
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
    const { testMessage = "Hello, this is a test message for GPT-5." } = body;

    // Call OpenAI Responses API with GPT-5
    const response = await openai.responses.create({
      model: "gpt-5",
      input: `You are a helpful AI assistant. Respond with a simple test message confirming you received the input: "${testMessage}". Keep your response concise and friendly. Return your response as JSON matching this exact format: {"success": true, "message": "your response here", "timestamp": "current timestamp", "model": "gpt-5", "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}}`,
    });

    // Parse the response content
    const responseContent = response.output_text;
    if (!responseContent) {
      throw new Error('No response content received from OpenAI');
    }

    // Parse JSON response
    let parsedResponse: TestResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      throw new Error(`Failed to parse OpenAI response: ${parseError}`);
    }

    // Validate response against schema
    const validatedResponse = TestResponseSchema.parse(parsedResponse);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: validatedResponse,
        raw_response: response,
        model_used: response.model,
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
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
