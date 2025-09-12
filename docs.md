Node.js (runtime for local dev and Netlify builds)

Latest LTS: v22.19.0 (LTS) per the Node.js security release post. Action: use Node 22 locally and in Netlify. 
Node.js

Pin Node on Netlify: set NODE_VERSION (UI or netlify.toml). Netlify pins the build env’s Node version; you can override with env vars. 
Netlify Docs
+1

Doc example (Netlify env var):
NODE_VERSION=22 (set in Netlify → Site settings → Build & deploy → Environment). 
Netlify Docs

Note: Netlify’s default Node moved to 22 in 2025—don’t rely on image defaults; pin explicitly. 
Netlify Support Forums

React + Vite (build tool and scaffolding)

React guidance: CRA is sunset; new apps should use a framework or a build tool like Vite. 
React
+1

Vite docs: Start with npm create vite@latest. 
vitejs
+1

Doc example (scaffold):
npm create vite@latest my-app → choose React + TypeScript. 
vitejs

Note: Use a React plugin for Vite (see next section). Vite 5/6 plugin guidance is consolidated on the Plugins page. 
vitejs

Vite’s React plugin (choose SWC or Babel path)

Official options (Vite Plugins page):

@vitejs/plugin-react (esbuild+Babel flexibility).

@vitejs/plugin-react-swc (SWC during dev; faster HMR on big projects). 
vitejs

Doc example (why SWC): “For big projects … HMR can be significantly faster.” (plugin page). 
vitejs

Note: The SWC plugin repo moved under the main vite-plugin-react monorepo; the standalone repo is archived. Prefer the package published on npm but be aware the source location changed. 
GitHub
+2
GitHub
+2

Tailwind CSS (current install flow with Vite)

Tailwind v4.x adds a Vite plugin path. You: install tailwindcss @tailwindcss/vite, add the plugin in vite.config, and @import "tailwindcss"; in your CSS. 
Tailwind CSS

Doc example (Vite plugin):

npm install tailwindcss @tailwindcss/vite
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()] })
// style.css
@import "tailwindcss";


Tailwind CSS

Note: This replaces the older npx tailwindcss init -p + manual PostCSS config flow for Vite projects. Use the plugin route for simplest setup. 
Tailwind CSS

PostCSS & Autoprefixer (when/why)

PostCSS is the CSS transform runtime Tailwind can run on; you can still integrate Tailwind as a PostCSS plugin when needed (e.g., other frameworks). 
PostCSS
+1

Autoprefixer remains the standard PostCSS plugin to add vendor prefixes to your own CSS (Tailwind utilities don’t require you to handwrite prefixes). 
GitHub

Doc example (PostCSS path):
npm install tailwindcss @tailwindcss/postcss postcss and add Tailwind to your PostCSS pipeline. 
Tailwind CSS

Note: With the new Tailwind Vite plugin, you usually don’t need a manual PostCSS config for Tailwind itself. Add Autoprefixer only if you’re writing non-Tailwind CSS that needs it. 
Tailwind CSS
+1

ESLint 9 (flat config) + typescript-eslint

Status: ESLint v9 made flat config the default and added migration guidance. 
eslint.org
+1

Doc example (minimal flat config for TS):

// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
)


(from typescript-eslint “Getting Started”). 
typescript-eslint.io

Note: Use flat config (eslint.config.*) instead of .eslintrc*. The CLI behavior changed in v9 (running with no patterns assumes .). 
eslint.org

Prettier 3 (formatter)

Config locations: prettier key in package.json, .prettierrc*, or prettier.config.*. 
prettier.io

Doc example (tiny config):

{ "printWidth": 100, "singleQuote": true }


(any supported Prettier config file). 
prettier.io

Note: Keep Prettier independent of ESLint; use Prettier for formatting, ESLint for linting. (Prettier’s docs emphasize separate configuration.) 
prettier.io

Vitest (test runner) + config

Getting started: Vitest is Vite-native; add a test section in vite.config to configure. 
vitest.dev
+1

Doc example (config + CLI):

/// <reference types="vitest" />
import { defineConfig } from 'vite'
export default defineConfig({
  test: { environment: 'jsdom' }
})
// Run: `vitest` (watch) or `vitest run`


vitest.dev
+1

Note: Reuses your Vite config/plugins for tests; Jest-compatible APIs. 
vitest.dev

React Testing Library (component tests)

Install (with TS types if needed). 
testing-library.com

npm i -D @testing-library/react @testing-library/dom
# + @types/react @types/react-dom (TS)


Note: Library focuses on user-centric queries; works with any runner (Vitest/Jest). 
testing-library.com

Netlify Functions (backend for the demo) + CLI

Overview & v2 handler shape: Functions are version-controlled API endpoints. Netlify supports streaming responses; use modern Request/Response in ESM handlers. 
Netlify Docs

Doc example (routing /api → functions):

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200


(Netlify redirects; include status = 200 to preserve method). 
Netlify
+1

Local dev: netlify dev proxies your Vite app and functions locally. 
Netlify Docs

Vite on Netlify: framework guide covers defaults for build & publish. 
Netlify Docs

Core model + API
GPT-5 model family (API)

What to use: gpt-5 (flagship), gpt-5-mini, gpt-5-nano. GPT-5 adds verbosity and reasoning_effort (supports minimal); very large context windows. Doc example (capabilities & pricing excerpt): “GPT-5 / GPT-5 mini / GPT-5 nano … 400K context, 128K max output tokens … pricing per 1M tokens.” 
OpenAI
+1

Note: Prefer gpt-5 for highest accuracy on nuanced writing evaluation; use gpt-5-mini for faster/cheaper runs; reserve gpt-5-nano for heuristics/triage. Launch posts confirm new params and sizes. 
OpenAI
+1

Responses API (use this, not Chat Completions)

Why: Officially recommended programmable surface (tools, structured outputs, streaming). Doc example (JS):

import OpenAI from "openai";
const client = new OpenAI();
const res = await client.responses.create({
  model: "gpt-5",
  input: "Evaluate the student's reflection...",
});


(Canonical call shape; parameters below.) 
OpenAI Platform

Note: Responses API exposes max_output_tokens, tool calls, structured outputs, and store/stateless patterns directly. 
OpenAI Platform

New GPT-5 parameters

verbosity: low | medium | high to control response length. Doc example: verbosity: "low" to force concise remarks. 
OpenAI

reasoning_effort: add minimal for faster answers (lower cost/latency) when deep chain-of-thought is unnecessary. Doc note: Parameter introduced for GPT-5; changelog references “minimal reasoning effort.” 
OpenAI Platform

max_output_tokens: explicit cap for completions. Doc example: max_output_tokens: 400 to bound output. 
OpenAI Platform

Structured evaluation output (strict JSON)
Structured Outputs via response_format: { type: "json_schema", ... }

What: Force model to emit JSON matching a schema for your rubric. Doc example:

response_format: {
  type: "json_schema",
  json_schema: {
    name: "Evaluation",
    strict: true,
    schema: {
      type: "object",
      properties: {
        checklist: {
          type: "object",
          properties: {
            happened: { type: "object", properties: { pass: {type:"boolean"}, remarks:{type:"string"}}, required:["pass","remarks"] },
            feeling:  { type: "object", properties: { pass: {type:"boolean"}, remarks:{type:"string"}}, required:["pass","remarks"] },
            next:     { type: "object", properties: { pass: {type:"boolean"}, remarks:{type:"string"}}, required:["pass","remarks"] }
          },
          required: ["happened","feeling","next"]
        }
      },
      required: ["checklist"]
    }
  }
}


(Shape mirrors docs: json_schema enforces exact JSON.) 
OpenAI Platform
+1

Note: Use strict: true to prevent extra fields; combine with max_output_tokens to stay within token bounds. 
OpenAI Platform

Tooling (optional for Part 2, useful later)
Tool calling & custom tools

What: GPT-5 supports tool calls; custom tools allow plaintext arguments (not only JSON). Useful if you add local grammar/lexicon checks later. Doc note: Custom tools + minimal reasoning introduced alongside GPT-5. 
OpenAI
+1

Agents SDK (future use): Lightweight agent patterns; automatic schema for function tools; built-in tracing. Keep on radar for Part 3/4, not required now. 
OpenAI Platform
+1

Safety & policy hooks
Moderation (text)

Model: omni-moderation-latest over /v1/moderations. Doc example: send the raw student text; if flagged, return a safety banner and avoid storing locally. 
OpenAI Platform

Note: For ELL teens, keep checks enabled even if you don’t block—route to “needs adult review” state.

Data use (API)

Enterprise/API default: OpenAI states API data is not used for training by default; opt-in controls exist. Cite in README. 
OpenAI

Retention: API customer data typically retained up to 30 days for abuse monitoring (DPA language). 
OpenAI

General privacy/policies: Link to OpenAI Privacy + Usage Policies in README. 
OpenAI
+1

Testing & validation stack
Schema validation (runtime)

Zod: validate request/response at the function boundary; generate TS types from schema. Doc example:

const EvalResponse = z.object({
  checklist: z.object({
    happened: z.object({ pass: z.boolean(), remarks: z.string() }),
    feeling:  z.object({ pass: z.boolean(), remarks: z.string() }),
    next:     z.object({ pass: z.boolean(), remarks: z.string() })
  })
});


(Use this only to validate the model output that was already constrained via json_schema.) 
OpenAI Platform

Mocking the OpenAI API

MSW (Mock Service Worker) for HTTP-level mocks in Vitest. Doc example: define a handler for POST /v1/responses and return a fixture JSON. 
OpenAI Platform

Note: Prefer black-box HTTP mocks over SDK stubs to avoid coupling to SDK internals.

Practical parameter presets for this app
Recommended call template (JS example for docs parity)

Doc example (assemble key GPT-5 params for our rubric):

await client.responses.create({
  model: "gpt-5",
  input: [
    { role: "system", content: "You are a 6–7th grade ELL writing coach. Evaluate without giving exact answers. Remarks ≤ 30 words each." },
    { role: "user", content: studentText },
    { role: "developer", content: "Return strictly as JSON per the provided schema." }
  ],
  verbosity: "low",
  reasoning_effort: "minimal",
  max_output_tokens: 400,
  response_format: { type: "json_schema", json_schema: /* as above */ },
  // Optionally: tools: [...]
});


(Structure mirrors Responses API patterns + GPT-5 params.) 
OpenAI Platform
+3
OpenAI Platform
+3
OpenAI
+3

Note: This keeps responses terse, cheap, and schema-safe. Increase reasoning_effort only if evaluations miss subtlety.

Cost, latency, and rate-limit notes

Pricing: As of current docs—see GPT-5/mini/nano token pricing; include in README’s budget table. 
OpenAI

Throughput: Large max_output_tokens + “thinking” can slow responses; GPT-5’s minimal reasoning reduces that. 
OpenAI Platform

Context: Avoid sending history for Part 2; keep calls stateless (Responses API supports store: false patterns). 
OpenAI Platform

Acceptance criteria (for Part 2 completion)

/api/evaluate returns strict JSON that passes local Zod validation and matches the json_schema Structured Output. 
OpenAI Platform

Requests set verbosity: "low", reasoning_effort: "minimal", and a bounded max_output_tokens. 
OpenAI
+2
OpenAI Platform
+2

Safety path: raw input sent to omni-moderation-latest; flagged ⇒ response includes { safety: { flagged: true } } and skips local store by default. 
OpenAI Platform

Tests: Vitest + MSW black-box HTTP mocks for /v1/responses. 
OpenAI Platform

Critical gotchas (reduce avoidable churn)

Pin Node 22 everywhere (local + Netlify) to avoid surprise build image changes. 
Netlify Docs
+1

Tailwind with Vite: prefer the @tailwindcss/vite plugin + @import "tailwindcss";. Don’t carry over the old tailwind.config + PostCSS boilerplate unless you need it. 
Tailwind CSS

ESLint: use flat config; don’t start new projects on .eslintrc. 
eslint.org

Netlify redirect: missing status = 200 converts POSTs to 301, which breaks methods—set it explicitly. 
Netlify Support Forums

Do not use Chat Completions; several GPT-5 controls (e.g., verbosity) are surfaced in Responses API and launch docs—not guaranteed in legacy endpoints. 
OpenAI Platform
+1

Missing max_output_tokens + high verbosity can explode costs with GPT-5’s 128K output capacity. Cap it. 
OpenAI

If you later stream, ensure you parse event chunks into a final JSON that still validates against your schema (don’t render partials to storage). 
OpenAI Platform