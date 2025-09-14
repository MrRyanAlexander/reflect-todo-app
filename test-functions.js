#!/usr/bin/env node

/**
 * Test script for Netlify Functions
 * Run this to test the API endpoints locally before deploying
 */

const BASE_URL = 'http://localhost:8888';

async function testFunction(endpoint, data, description) {
  console.log(`\n🧪 Testing ${description}...`);
  console.log(`📡 POST ${endpoint}`);
  console.log(`📝 Input:`, JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Success!`);
      console.log(`📊 Response:`, JSON.stringify(result.data, null, 2));
    } else {
      console.log(`❌ Failed:`, result.error);
    }
  } catch (error) {
    console.log(`💥 Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Netlify Functions Tests');
  console.log('📍 Base URL:', BASE_URL);
  
  // Test 1: Evaluate Reflection
  await testFunction(
    '/.netlify/functions/evaluate-reflection',
    {
      reflectionText: "Today I went to school and felt happy about my math test. Tomorrow I will study more for my science quiz."
    },
    'Reflection Evaluation'
  );
  
  // Test 2: Chat Function
  await testFunction(
    '/.netlify/functions/chat',
    {
      reflectionText: "Today I went to school and felt happy about my math test. Tomorrow I will study more for my science quiz.",
      message: "Can you help me improve my reflection?"
    },
    'Chat Assistant'
  );
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure netlify dev is running (netlify dev)');
  console.log('2. If tests pass, deploy to production');
  console.log('3. Test the full app flow in the browser');
}

// Check if netlify dev is running
fetch(`${BASE_URL}/.netlify/functions/evaluate-reflection`, { method: 'HEAD' })
  .then(() => {
    console.log('✅ Netlify dev server is running');
    runTests();
  })
  .catch(() => {
    console.log('❌ Netlify dev server is not running');
    console.log('Please run: netlify dev');
    process.exit(1);
  });
