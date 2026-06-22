# Project Status

## Completed

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

- Add real persistence-backed form submissions and CRUD flows.
- Add a simple auth implementation or NextAuth provider configuration.
- Replace AI provider stubs with SDK calls and prompt templates.
- Add background refresh jobs for employer boards.
- Add saved job actions and application status mutations.
- Add richer filters and search on the jobs page.
- Add robust PDF parsing for resumes.
- Add real email provider API call and unsubscribe preferences.
- Add Vercel cron endpoint for daily refresh scheduling.

## Current Limitations

- UI uses demo data until persistence actions are wired.
- Auth is a stub mode placeholder.
- OpenAI and Anthropic provider branches are configured as extension points but not yet calling provider SDKs.
- Discovery is intentionally limited to Greenhouse and Lever.
- Resume PDF parsing is detected but not implemented yet.
