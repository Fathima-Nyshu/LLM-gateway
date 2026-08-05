# LLM Gateway

A gateway that sits between applications and LLM providers — handling authentication, rate limiting, cost tracking, and automatic failover, so no single app has to deal with API keys, quotas, or provider outages directly.

Live app: https://llm-gateway-weld.vercel.app
Backend: runs at the project root (`src/`)
Frontend: `frontend/` folder

Note: backend runs on Render's free tier, which spins down after 15 minutes of inactivity. First request after idle time can take 30–60 seconds — this is expected.

## Tech stack
(fill in what you actually used)
