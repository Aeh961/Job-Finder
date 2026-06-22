# Roadmap

## V3.1 Production Hardening

- Move the full refresh worker into a shared service used by both `npm run refresh-jobs` and `/api/cron/refresh-jobs`.
- Add transactional server actions with user-facing success and error toasts.
- Add account settings for password changes and alert preferences.
- Add integration tests for authenticated server actions.
- Add migration files instead of relying on `prisma db push`.

## V2.1 Persistence

- Completed in V3 for the beta path.

## V2.2 Resume Intelligence

- Add reliable PDF parsing.
- Add resume section detection and experience summaries.
- Let users accept or reject extracted skills before saving.

## V2.3 Alerts and Refresh

- Add a Vercel cron route for daily refresh scheduling.
- Send high-match job emails through a production provider.
- Add alert preferences, threshold controls, and unsubscribe handling.

## V1.1 Persistence

- Wire profile, employer, saved job, and application forms to Prisma mutations.
- Add seed data and database reset scripts.
- Add user-scoped dashboard queries.

## V1.2 Authentication

- Add NextAuth with email or OAuth provider support.
- Protect app routes.
- Associate all profile, employer, job match, application, and packet records with the signed-in user.

## V1.3 Discovery

- Add employer board validation.
- Add scheduled refresh jobs.
- Add duplicate detection and posting expiration handling.
- Keep unsupported employers in manual review mode.

## V1.4 AI Helper

- Implement OpenAI and Anthropic SDK calls behind a provider abstraction.
- Add prompt templates for fit summaries, resume summaries, cover letters, recruiter messages, and checklists.
- Store generated packets and allow regeneration.

## V1.5 Product Polish

- Add job filters, sorting, and saved views.
- Add application timeline notes.
- Add CSV export.
- Add observability for discovery failures.
