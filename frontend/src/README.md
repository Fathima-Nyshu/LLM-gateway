# LLM Gateway

A gateway that sits between your applications and LLM providers — handling authentication, rate limiting, cost tracking, and automatic failover, so no single app has to deal with API keys, quotas, or provider outages directly.

Live app: https://llm-gateway-weld.vercel.app
Backend repo: same repo, backend lives at the project root (`src/`)

Note: the backend runs on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time can take 30–60 seconds to respond — this is expected, not a bug.

## What it does

* Sign up and get a unique API key, no password required
* Send prompts through the gateway instead of calling an LLM provider directly
* Requests are rate-limited per key using a token bucket (10 requests, refilling over time) — bursts are allowed, sustained abuse is not
* Each user has a monthly request quota, tracked and enforced independently of the rate limiter
* Near-duplicate prompts are served from cache instead of hitting the LLM again, saving cost and latency
* If the primary provider (Groq) fails, the gateway automatically retries with a backup provider (OpenRouter) — the caller never sees the failure
* A dashboard shows live usage: total requests, tokens, cost, and a full request log

## How it works

1. **Authenticate:** every request carries an `x-api-key` header, checked against a user record in MongoDB.
2. **Rate limit:** a token bucket stored in Redis tracks each key's remaining requests, refilling gradually so short bursts are fine but sustained hammering gets a `429`.
3. **Quota check:** a separate, monthly counter in MongoDB blocks requests once a user's request budget for the month is used up — independent of the rate limiter, which resets every few seconds.
4. **Cache lookup:** the incoming prompt is compared against previously cached prompts using Jaccard similarity (word-overlap based). A close-enough match returns the cached response immediately, skipping the LLM call entirely.
5. **Provider call:** if nothing's cached, the prompt goes to Groq. If that call fails for any reason, the gateway automatically retries the same prompt against OpenRouter before giving up.
6. **Log and respond:** the response is logged (tokens used, calculated cost, timestamp), cached for future similar prompts, and returned to the caller.

## Tech stack

* Frontend: React (Vite), Tailwind CSS, deployed on Vercel
* Backend: Node.js, Express, deployed on Render
* Database: MongoDB Atlas
* Rate limiting: Redis Cloud
* LLM providers: Groq (primary), OpenRouter (fallback)
* Auth: per-user API keys, no passwords

## Known limitations

Being upfront about the current tradeoffs:

* Caching uses word-overlap similarity (Jaccard), not true semantic embeddings — it catches reworded duplicates well but won't recognize prompts that mean the same thing using completely different words.
* No key recovery. Since there's no password or email verification, a lost API key can't be reissued — this mirrors how most developer API keys work (shown once at creation), but it's a real constraint worth knowing.
* No per-key regeneration or revocation yet — a key is permanent once issued.
* Only two providers are wired up (Groq, OpenRouter). Provider selection is fixed (always try Groq first) rather than based on live cost or latency.
* No streaming responses — replies return all at once rather than token-by-token.

## Running locally

```bash
# Backend
cd LLM-gateway
npm install
# Add a .env file with GROQ_API_KEY, MONGODB_URI, REDIS_URL, OPENROUTER_API_KEY
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```