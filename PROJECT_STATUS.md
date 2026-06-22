# Project Status

## Completed

### V3

- Added NextAuth credentials authentication with bcrypt password hashes.
- Added sign in and sign up pages.
- Added database-backed user profile, resume, employer watchlist, saved/ignored job, application status, and generated packet actions.
- Kept demo mode available for unsigned local browsing.
- Added user-aware data loading that uses Prisma records for signed-in users and V2 demo data otherwise.
- Added persisted onboarding quick-start profile form.
- Added cron-ready `/api/cron/refresh-jobs` endpoint protected by `CRON_SECRET` that refreshes Greenhouse and Lever jobs, updates matches, and triggers high-match alerts.
- Added seed password for the demo user.
- Added README auth, deployment, and screenshot documentation.
- Added auth utility test coverage.

### Senior Review Fixes

- Fixed the highest-priority V2 deployment gap: `npm run refresh-jobs` now performs a real database-backed refresh for Greenhouse and Lever employers instead of only printing placeholder readiness text.
- Added refresh behavior that upserts job postings, recalculates user job matches, reports provider errors without aborting the entire run, and renders local email previews when no email provider key is set.
- Added Resend-compatible email alert sending through `RESEND_API_KEY`, `EMAIL_FROM`, and `ALERT_EMAIL_TO` environment variables.
- Added `JOB_REFRESH_TIMEOUT_MS` to control external job board request timeouts.
- Added resume upload size limits in both browser and shared resume extraction code to avoid reading oversized files into memory.
- Added test coverage for oversized resume rejection.

### V2

- Added an onboarding flow that guides users through profile setup, resume upload, employer watchlist, job review, and application packet generation.
- Added a resume upload page with TXT and Markdown extraction, local skills extraction, loading state, and clear PDF TODO messaging.
- Added improved company watchlist UI with priority, provider, board token, supported board count, and manual review count.
- Added saved and ignored job demo flows with local interactive controls.
- Added a richer job detail page with score breakdown, source API URL, cover letter draft, and job actions.
- Added an application packets page that generates fit summaries, tailored resume summaries, recruiter messages, cover letter drafts, and checklists.
- Added local fallback email alert utilities and environment-variable hooks.
- Added `npm run refresh-jobs` daily refresh command.
- Added seed data for a realistic software engineer user and OpenAI, Anthropic, Microsoft, Amazon, Google, NVIDIA, Meta, and Apple employers.
- Added tests for resume extraction, skills extraction, email alerts, saved/ignored selections, and refresh behavior.
- Added Vercel deployment instructions and deployment-oriented `postinstall` Prisma generation.

### V1

- Created a Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL-ready project from an empty repository.
- Added a SaaS-style landing page and app pages for dashboard, profile, employers, jobs, job details, applications, and settings.
- Added Prisma models for User, UserProfile, Resume, Employer, UserEmployerPreference, JobPosting, JobMatch, Application, and GeneratedApplicationPacket.
- Implemented Greenhouse and Lever job board parsers and discovery helpers.
- Implemented job match scoring across title, skills, seniority, location, remote preference, employer priority, sponsorship signals, and user interests.
- Added local fallback AI application packet generation with environment-variable hooks for OpenAI and Anthropic.
- Added demo data so the MVP is runnable without API keys or a seeded database.
- Added tests for scoring logic, Greenhouse parsing, Lever parsing, and database utilities.
- Added README, environment example, project status, and roadmap docs.

## Next

- Replace AI provider stubs with SDK calls and prompt templates.
- Add richer filters and search on the jobs page.
- Add robust PDF parsing for resumes.
- Add real email provider API call and unsubscribe preferences.
- Deduplicate the cron endpoint and CLI refresh worker into one shared service.

## Current Limitations

- Demo mode is intentionally still available for unsigned local browsing.
- OpenAI and Anthropic provider branches are configured as extension points but not yet calling provider SDKs.
- Discovery is intentionally limited to Greenhouse and Lever.
- Resume PDF parsing is detected but not implemented yet.
- Cron endpoint and CLI refresh worker are both implemented, but they still duplicate some refresh logic.
