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

## Job Discovery Policy

V1 only supports Greenhouse and Lever public job board APIs. It does not scrape arbitrary websites, bypass CAPTCHAs, or auto-apply. Unsupported employers are marked as manual review needed. Every normalized job stores a source API URL and original job URL.
