/**
 * Quick deployment verification script
 * 
 * This script quickly checks if your Netlify site is deployed
 * and accessible before running the full OpenAI tests.
 * 
 * Run with: node verify-deployment.js YOUR_SITE_URL
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get site URL from command line arguments
const siteUrl = process.argv[2];

if (!siteUrl) {
  console.error('❌ Please provide your Netlify site URL as an argument');
  console.log('Usage: node verify-deployment.js https://your-site.netlify.app');
  process.exit(1);
}

// Ensure URL has proper format
const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

async function verifyDeployment() {
  console.log('🔍 Verifying Netlify deployment...\n');
  console.log(`📍 Site URL: ${baseUrl}\n`);

  try {
    // Test main site
    console.log('1. Testing main site accessibility...');
    const mainResponse = await fetch(baseUrl);
    
    if (mainResponse.ok) {
      console.log('✅ Main site is accessible');
    } else {
      console.log(`❌ Main site returned status: ${mainResponse.status}`);
    }

    // Test API endpoint
    console.log('2. Testing API endpoint accessibility...');
    const apiResponse = await fetch(`${baseUrl}/api/openai-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testMessage: 'Quick deployment test',
      }),
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data.success) {
        console.log('✅ API endpoint is working');
        console.log(`   Model: ${data.data.model}`);
        console.log(`   Message: ${data.data.message}`);
      } else {
        console.log('❌ API endpoint returned error:', data.error);
      }
    } else {
      console.log(`❌ API endpoint returned status: ${apiResponse.status}`);
    }

    console.log('\n🎉 Deployment verification complete!');
    console.log('\n💡 If everything looks good, you can run the full test:');
    console.log(`node test-netlify-production.js ${baseUrl}`);

  } catch (error) {
    console.log('❌ Deployment verification failed!');
    console.log(`   Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your site URL is correct');
    console.log('2. Ensure your site is deployed on Netlify');
    console.log('3. Check if the deployment completed successfully');
    console.log('4. Verify the OPENAI_API_KEY is set in Netlify site settings');
  }
}

// Run the verification
verifyDeployment().catch(console.error);
