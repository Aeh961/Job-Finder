# JobFinder AI

JobFinder AI is a SaaS-style MVP for tracking target employers, discovering jobs from Greenhouse and Lever, scoring role fit, and preparing application materials.

## V1 Features

- Landing page and app dashboard
- Profile form for resume text, skills, desired titles, locations, work mode, and sponsorship preference
- Target employer tracker with Greenhouse, Lever, and manual review states
- Job discovery adapters for Greenhouse and Lever
- Match scoring from 0-100 with reasons, missing skills, and suggested next action
- Saved application pipeline statuses
- Local AI application helper fallback with optional OpenAI or Anthropic environment variables
- Prisma schema for PostgreSQL
- Basic tests for scoring, parsers, and utilities

## V2 Features

- Real onboarding checklist for profile, resume, watchlist, job review, and packets
- Resume upload page with TXT and Markdown extraction
- PDF upload detection with a clear TODO instead of unreliable parsing
- Skills extraction from resume text
- Improved target employer watchlist with priority and manual review states
- Daily refresh command: `npm run refresh-jobs`
- Local fallback email alert rendering with environment-variable hooks
- Saved jobs and ignored jobs demo workflow
- Application packet generation page
- More detailed job detail page with score breakdown and generated materials
- Seed data for a realistic software engineer user and target employers

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL and set `DATABASE_URL` in `.env`.

4. Generate Prisma Client and apply the schema:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

5. Run the app:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000).

The app currently ships with demo data so it is usable before a database is connected.

## Tests

```bash
npm test
```

## Daily Refresh

```bash
npm run refresh-jobs
```

The command is safe by default. Without `DATABASE_URL`, it runs in local fallback mode. With a database configured, it fetches supported Greenhouse and Lever employers, upserts jobs, scores matches for users, and renders or sends high-match email alerts. Unsupported employers stay in manual review.

## Email Alerts

Set these variables when you are ready to send real alerts:

```bash
EMAIL_PROVIDER="local"
ALERT_EMAIL_TO="you@example.com"
EMAIL_FROM="JobFinder AI <alerts@example.com>"
RESEND_API_KEY=""
HIGH_MATCH_THRESHOLD="80"
JOB_REFRESH_TIMEOUT_MS="15000"
```

If no provider key is configured, the app renders the alert content locally and does not send email.

## Vercel Deployment

1. Create a Vercel project from the GitHub repository.
2. Add a hosted PostgreSQL database and set `DATABASE_URL`.
3. Add optional `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `ALERT_EMAIL_TO`, and `EMAIL_FROM`.
4. Keep the default build command: `npm run build`.
5. The `postinstall` script runs `prisma generate` for deployment readiness.
6. Run `npx prisma db push` or a migration command against production before first use.

## Job Discovery Policy

V1 only supports Greenhouse and Lever public job board APIs. It does not scrape arbitrary websites, bypass CAPTCHAs, or auto-apply. Unsupported employers are marked as manual review needed. Every normalized job stores a source API URL and original job URL.
