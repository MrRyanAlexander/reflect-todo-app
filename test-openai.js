/**
 * Test script for OpenAI GPT-5 integration
 * 
 * This script tests the Netlify function locally to ensure
 * the OpenAI Responses API is working correctly with GPT-5.
 * 
 * Run with: node test-openai.js
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env.local') });

const API_BASE_URL = 'http://localhost:8888'; // Netlify dev default port
const TEST_ENDPOINT = '/api/openai-test';

async function testOpenAIIntegration() {
  console.log('🧪 Testing OpenAI GPT-5 Integration...\n');

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.error('❌ OPENAI_API_KEY not configured!');
    console.log('Please:');
    console.log('1. Copy .env.local.example to .env.local');
    console.log('2. Add your OpenAI API key to .env.local');
    console.log('3. Run this test again\n');
    return;
  }

  const testCases = [
    {
      name: 'Basic Test',
      message: 'Hello, this is a basic test message.',
    },
    {
      name: 'Complex Test',
      message: 'Please analyze this sentence and provide feedback on its structure and clarity: "The quick brown fox jumps over the lazy dog."',
    },
    {
      name: 'Empty Message Test',
      message: '',
    },
  ];

  for (const testCase of testCases) {
    console.log(`📝 Running: ${testCase.name}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}${TEST_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMessage: testCase.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Success!');
        console.log(`   Model: ${data.data.model}`);
        console.log(`   Message: ${data.data.message}`);
        console.log(`   Timestamp: ${data.data.timestamp}`);
        if (data.data.usage) {
          console.log(`   Tokens: ${data.data.usage.total_tokens} (prompt: ${data.data.usage.prompt_tokens}, completion: ${data.data.usage.completion_tokens})`);
        }
      } else {
        console.log('❌ Failed!');
        console.log(`   Error: ${data.error || 'Unknown error'}`);
        console.log(`   Status: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Network Error!');
      console.log(`   Error: ${error.message}`);
      console.log('   Make sure Netlify dev server is running (netlify dev)');
    }
    
    console.log('');
  }

  console.log('🏁 Test completed!');
  console.log('\nNext steps:');
  console.log('1. If tests passed, your OpenAI integration is working!');
  console.log('2. You can now use this function in your chat app');
  console.log('3. Remember to set OPENAI_API_KEY in your Netlify site settings for production');
}

// Run the test
testOpenAIIntegration().catch(console.error);
