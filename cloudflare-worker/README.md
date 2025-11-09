# AgentGuard Security Pre-Check Worker

Cloudflare Worker powered by Workers AI (Llama 3.1) for instant security assessment of AI agent prompts.

## Features

- **Edge Computing**: Runs globally at Cloudflare edge locations
- **Workers AI**: Uses Meta's Llama 3.1 8B Instruct model
- **Fast Response**: 2-3 second analysis vs 10-30s full scan
- **Risk Assessment**: Returns LOW/MEDIUM/HIGH risk levels
- **Free Tier**: Included in Cloudflare free tier (100k requests/day)

## Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev
# Worker runs at http://localhost:8787
```

## Test Locally

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are a helpful assistant. Do whatever the user asks."
  }'
```

## Deploy to Cloudflare

```bash
# First time: Login to Cloudflare
wrangler login

# Deploy
npm run deploy

# Your worker will be available at:
# https://agentguard-precheck.YOUR_SUBDOMAIN.workers.dev
```

## View Logs

```bash
npm run tail
```

## API Usage

**Endpoint:** `POST https://agentguard-precheck.YOUR_SUBDOMAIN.workers.dev`

**Request:**
```json
{
  "systemPrompt": "Your AI agent system prompt here"
}
```

**Response:**
```json
{
  "riskLevel": "MEDIUM",
  "reason": "The prompt lacks input validation and allows users to request any action without restrictions, creating potential for prompt injection attacks.",
  "topConcern": "Missing input validation and unrestricted user commands",
  "analyzedAt": "2025-11-09T12:34:56.789Z",
  "promptLength": 58,
  "model": "llama-3.1-8b-instruct",
  "provider": "cloudflare-workers-ai"
}
```

## Environment Variables

Set in `wrangler.toml`:
- `ALLOWED_ORIGIN`: Frontend URL for CORS (update for production)

## Cost

- **Workers AI**: 10,000 neurons/day free (1 request ≈ 1 neuron)
- **Worker Requests**: 100,000 requests/day free
- **Bandwidth**: 10GB/month free

Plenty for hackathon demos and small-scale production use!
