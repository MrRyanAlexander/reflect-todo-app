/**
 * Test script for OpenAI GPT-5 integration on Netlify production
 * 
 * This script tests the deployed Netlify function to ensure
 * the OpenAI Responses API is working correctly in production.
 * 
 * Run with: node test-netlify-production.js YOUR_SITE_URL
 * Example: node test-netlify-production.js https://your-site.netlify.app
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env.local') });

// Get site URL from command line arguments
const siteUrl = process.argv[2];

if (!siteUrl) {
  console.error('❌ Please provide your Netlify site URL as an argument');
  console.log('Usage: node test-netlify-production.js https://your-site.netlify.app');
  console.log('Example: node test-netlify-production.js https://amazing-todo-app.netlify.app');
  process.exit(1);
}

// Ensure URL has proper format
const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
const testEndpoint = `${baseUrl}/api/openai-test`;

async function testNetlifyProduction() {
  console.log('🌐 Testing OpenAI GPT-5 Integration on Netlify Production...\n');
  console.log(`📍 Site URL: ${baseUrl}`);
  console.log(`🔗 Test Endpoint: ${testEndpoint}\n`);

  const testCases = [
    {
      name: 'Basic Production Test',
      message: 'Hello from production! This is a test of the deployed Netlify function.',
    },
    {
      name: 'Performance Test',
      message: 'Please respond quickly to test production performance.',
    },
    {
      name: 'Error Handling Test',
      message: 'Test error handling with a very long message: ' + 'x'.repeat(1000),
    },
  ];

  let successCount = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📝 Running: ${testCase.name}`);
    console.log(`   Message: ${testCase.message.substring(0, 50)}${testCase.message.length > 50 ? '...' : ''}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(testEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMessage: testCase.message,
        }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Success!');
        console.log(`   Model: ${data.data.model}`);
        console.log(`   Message: ${data.data.message}`);
        console.log(`   Response Time: ${responseTime}ms`);
        console.log(`   Timestamp: ${data.data.timestamp}`);
        if (data.data.usage) {
          console.log(`   Tokens: ${data.data.usage.total_tokens} (prompt: ${data.data.usage.prompt_tokens}, completion: ${data.data.usage.completion_tokens})`);
        }
        successCount++;
      } else {
        console.log('❌ Failed!');
        console.log(`   Error: ${data.error || 'Unknown error'}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response Time: ${responseTime}ms`);
      }
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log('❌ Network Error!');
      console.log(`   Error: ${error.message}`);
      console.log(`   Response Time: ${responseTime}ms`);
      
      if (error.message.includes('fetch')) {
        console.log('   💡 Check if your site URL is correct and the site is deployed');
      }
    }
    
    console.log('');
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${successCount}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalTests - successCount}/${totalTests}`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 All tests passed! Your production deployment is working perfectly!');
    console.log('\n🚀 Next steps:');
    console.log('1. Your OpenAI integration is ready for production use');
    console.log('2. You can now integrate this into your chat app');
    console.log('3. Monitor your OpenAI usage in the OpenAI dashboard');
  } else {
    console.log('\n⚠️  Some tests failed. Please check:');
    console.log('1. Your site is properly deployed on Netlify');
    console.log('2. The OPENAI_API_KEY is set in Netlify site settings');
    console.log('3. Your site URL is correct');
    console.log('4. The function is accessible at /api/openai-test');
  }

  console.log('\n💡 Pro tip: You can also test manually with:');
  console.log(`curl -X POST ${testEndpoint} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"testMessage": "Hello from curl!"}\'');
}

// Run the test
testNetlifyProduction().catch(console.error);
