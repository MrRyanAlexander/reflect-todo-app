# Testing Guide

## Local Development Testing

### Prerequisites
- Node.js installed
- Netlify CLI installed: `npm install -g netlify-cli`
- OpenAI API key in `.env.local`

### Quick Test Setup

1. **Start local development server:**
   ```bash
   netlify dev
   ```

2. **Run automated function tests:**
   ```bash
   node test-functions.js
   ```

3. **Test in browser:**
   - Open http://localhost:8888
   - Submit a reflection
   - Test chat functionality

### Manual API Testing

#### Test Reflection Evaluation
```bash
curl -s http://localhost:8888/.netlify/functions/evaluate-reflection \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"reflectionText":"Today I went to school and felt happy about my math test. Tomorrow I will study more for my science quiz."}' \
  | jq .
```

#### Test Chat Function
```bash
curl -s http://localhost:8888/.netlify/functions/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"reflectionText":"Today I went to school and felt happy about my math test. Tomorrow I will study more for my science quiz.","message":"Can you help me improve my reflection?"}' \
  | jq .
```

## Production Testing

After pushing to GitHub, Netlify will automatically deploy. Test the production site:

1. Visit: https://reflect-todo-app.netlify.app
2. Submit a reflection
3. Verify LLM responses work

## Troubleshooting

### Functions not working locally
- Check if `netlify dev` is running
- Verify `.env.local` has correct API key
- Check function logs in terminal

### 404 errors in production
- Verify `netlify.toml` has correct functions directory
- Check Netlify build logs
- Ensure functions are in `netlify/functions/` directory

### API parameter errors
- Check OpenAI API documentation for latest parameter format
- Update function parameters accordingly
