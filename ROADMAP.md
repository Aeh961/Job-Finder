# Roadmap

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
