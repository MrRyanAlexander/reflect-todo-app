# OpenAI GPT-5 Integration Setup

This document explains how to set up and test the OpenAI GPT-5 integration using the Responses API.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Node.js 22**: Ensure you're using Node.js 22 (configured in `netlify.toml`)

## Environment Setup

### Local Development

1. Copy the environment template:
   ```bash
   cp .env.local .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Netlify Production

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment variables**
3. Add a new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key

## Testing the Integration

### Option 1: Using the Test Script

1. Start the Netlify development server:
   ```bash
   netlify dev
   ```

2. In another terminal, run the test script:
   ```bash
   node test-openai.js
   ```

### Option 2: Manual Testing

1. Start the development server:
   ```bash
   netlify dev
   ```

2. Make a POST request to `http://localhost:8888/api/openai-test`:
   ```bash
   curl -X POST http://localhost:8888/api/openai-test \
     -H "Content-Type: application/json" \
     -d '{"testMessage": "Hello, GPT-5!"}'
   ```

## Production Testing

### Quick Deployment Verification

1. Deploy your site to Netlify (push to your connected Git repository)
2. Get your site URL from the Netlify dashboard
3. Run the quick verification:
   ```bash
   node verify-deployment.js https://your-site.netlify.app
   ```

### Full Production Testing

1. Run the comprehensive production test:
   ```bash
   node test-netlify-production.js https://your-site.netlify.app
   ```

2. The test will check:
   - Basic functionality
   - Performance metrics
   - Error handling
   - Response times
   - Token usage

### Manual Production Testing

Test your deployed function directly:
```bash
curl -X POST https://your-site.netlify.app/api/openai-test \
  -H "Content-Type: application/json" \
  -d '{"testMessage": "Hello from production!"}'
```

## Function Details

The OpenAI function (`netlify/functions/openai-test.ts`) implements:

- **GPT-5 Model**: Uses the latest GPT-5 model via the new Responses API
- **Responses API**: Uses `client.responses.create()` as per 2025 OpenAI documentation
- **Simple Input Format**: Uses string input instead of message arrays
- **JSON Output**: Requests structured JSON responses from the model
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Proper CORS headers for web requests

## API Endpoint

**URL**: `/api/openai-test`
**Method**: `POST`
**Content-Type**: `application/json`

### Request Body
```json
{
  "testMessage": "Your test message here"
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "GPT-5 response message",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "model": "gpt-5",
    "usage": {
      "prompt_tokens": 50,
      "completion_tokens": 25,
      "total_tokens": 75
    }
  },
  "raw_usage": { /* OpenAI usage object */ },
  "model_used": "gpt-5"
}
```

## Cost Considerations

The function is optimized for cost efficiency:
- **Simple input format**: Uses string input for efficient processing
- **JSON output requests**: Ensures predictable response sizes
- **Error handling**: Prevents unnecessary API calls on failures
- **Structured responses**: Validates output to prevent malformed responses

## Next Steps

Once testing is complete, you can:

1. **Integrate with your chat app**: Use the same function structure for chat functionality
2. **Add safety measures**: Implement content moderation using `omni-moderation-latest`
3. **Scale up**: Adjust parameters based on your specific use case
4. **Add streaming**: Implement streaming responses for real-time chat

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure `OPENAI_API_KEY` is set in your environment
   - Check that the key is valid and has sufficient credits

2. **"Method not allowed"**
   - Ensure you're making a POST request
   - Check the endpoint URL is correct

3. **Network errors in test script**
   - Make sure `netlify dev` is running
   - Check that the port (8888) is available

4. **Schema validation errors**
   - The function uses strict JSON schema validation
   - Check that your request body matches the expected format

### Getting Help

- Check the [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- Review the [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- Check the function logs in Netlify dashboard for detailed error messages
