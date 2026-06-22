# Project Status

## Completed

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
- Add seed scripts for employers, demo user profile, and applications.
- Replace AI provider stubs with SDK calls and prompt templates.
- Add background refresh jobs for employer boards.
- Add saved job actions and application status mutations.
- Add richer filters and search on the jobs page.

## Current Limitations

- UI uses demo data until persistence actions are wired.
- Auth is a stub mode placeholder.
- OpenAI and Anthropic provider branches are configured as extension points but not yet calling provider SDKs.
- Discovery is intentionally limited to Greenhouse and Lever.
