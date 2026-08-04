# LLM Gateway

A production-style API gateway for LLM providers — handling authentication, rate limiting, cost tracking, quota management, response caching, and automatic provider failover.

Built to solve a real problem: when multiple applications call LLM APIs directly, there's no central control over cost, no protection against runaway usage, and no fallback when a provider goes down. This gateway sits between client applications and LLM providers (Groq, OpenRouter) to solve exactly that.

## Live Demo

*(Add your deployed link here once deployed)*

## Features

- **API Key Authentication** — every request is authenticated via a unique, per-user API key
- **Rate Limiting** — token bucket algorithm (Redis-backed) prevents burst abuse, 10 requests/user with gradual refill
- **Monthly Quotas** — per-user request budgets, independent of rate limiting
- **Usage Logging & Cost Tracking** — every request logged with token counts and calculated cost
- **Response Caching** — Jaccard similarity matching skips redundant LLM calls for near-duplicate prompts, reducing cost and latency
- **Multi-Provider Failover** — automatically falls back from Groq to OpenRouter if the primary provider fails
- **Dashboard** — React frontend showing live usage stats, API key management, and detailed request logs

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Atlas), Redis (Cloud)
**Frontend:** React, Vite, Tailwind CSS, React Router
**LLM Providers:** Groq (primary), OpenRouter (fallback)

## Architecture

```
Client Request
      │
      ▼
 Authentication  ──── invalid key ────▶ 401
      │
      ▼
 Rate Limiting   ──── bucket empty ───▶ 429
      │
      ▼
 Quota Check     ──── quota exceeded ─▶ 429
      │
      ▼
 Cache Lookup    ──── match found ────▶ return cached response
      │
      ▼
 Groq (primary)  ──── fails ──────────▶ OpenRouter (fallback)
      │
      ▼
 Log usage + cost, save to cache, return response
```

## Project Structure

```
llm-gateway/
├── src/
│   ├── config/         # MongoDB, Redis connections
│   ├── controllers/     # request handlers
│   ├── routes/          # route definitions
│   ├── services/        # business logic (auth, rate limit, cache, providers)
│   └── middleware/      # auth, rate limit, quota, error handling
├── frontend/
│   └── src/
│       ├── pages/        # Signup, Dashboard, API Keys, Usage Logs
│       └── components/   # Sidebar, Layout
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- A Redis Cloud connection string
- A Groq API key ([console.groq.com](https://console.groq.com))
- An OpenRouter API key ([openrouter.ai](https://openrouter.ai))

### Backend Setup

```bash
git clone https://github.com/Fathima-Nyshu/LLM-gateway.git
cd LLM-gateway
npm install
cp .env.example .env
# fill in your API keys and connection strings in .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`, frontend on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/v1/signup` | Create a new user, returns an API key |
| POST | `/v1/chat` | Send a prompt, get an AI response (requires `x-api-key` header) |
| GET | `/v1/usage` | Get usage summary and logs for the authenticated user |

## Example Request

```bash
curl -X POST http://localhost:3000/v1/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_your_api_key" \
  -d '{"prompt": "What is the capital of France?"}'
```

## Design Decisions

- **Token bucket over fixed window rate limiting** — allows short bursts while still capping average request rate, matching how real APIs like Stripe and GitHub implement rate limits.
- **Jaccard similarity over embedding-based caching** — chosen for reliability with short prompts and zero external dependency risk, after an initial embedding-model approach introduced unresolved dependency vulnerabilities.
- **Provider-agnostic service layer** — Groq and OpenRouter integrations share an identical interface, making the fallback logic simple and making it easy to add a third provider later.

## What's Next

- Docker Compose setup for one-command local deployment
- Load testing with k6 to validate rate limiter behavior under concurrent load
