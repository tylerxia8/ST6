# ST6 Technical Documentation

## Objective

ST6 replaces disconnected 15Five weekly planning with a weekly execution system where every commitment links to a Rally Cry, Defining Objective, and Supporting Outcome. The module supports individual planning, manager review, and reconciliation of planned vs. actual work.

## Architecture

The repository is organized as a small monorepo:

- `apps/web`: React 18, Vite 5, TypeScript strict mode, Tailwind CSS, Flowbite React, Redux Toolkit, and RTK Query.
- `apps/api`: Spring Boot 3.3, Java 21, Spring Data JPA, Flyway, PostgreSQL, OAuth2 resource server configuration, JaCoCo, Spotless, and SpotBugs configuration.
- `docs`: assessment deliverables and operating notes.

The frontend can run standalone for assessment and is also configured as a Vite Module Federation remote named `st6_weekly_commitments`. It exposes `./WeeklyCommitments` from `src/remote/WeeklyCommitmentsRemote.tsx`.

## Frontend Behavior

The first screen is the weekly planning workspace. It includes:

- Lifecycle rail for `DRAFT`, `LOCKED`, `RECONCILING`, and `RECONCILED`.
- Commit entry form with required Supporting Outcome linkage.
- Chess-layer prioritization using Queen, Rook, Bishop, Knight, and Pawn categories.
- Commit table with planned hours, actual hours, status, and delete controls.
- Reconciliation summary showing planned vs. actual variance.
- Manager dashboard with completion, alignment, turnaround, lifecycle, hours, and blocked work.

The current UI uses an RTK Query `fakeBaseQuery` with deterministic seed data so reviewers can run the frontend without backend infrastructure. The endpoint boundaries mirror the Spring controller contract, so replacing the fake query with `fetchBaseQuery({ baseUrl: "/api" })` is straightforward.

## Backend API

Primary endpoints:

- `GET /api/outcomes`
- `GET /api/plans/current?ownerId={id}&weekStart={yyyy-mm-dd}`
- `POST /api/plans/{planId}/commits`
- `PATCH /api/plans/{planId}/commits/{commitId}/reconciliation`
- `POST /api/plans/{planId}/lifecycle/advance`
- `GET /api/managers/{managerId}/plans?weekStart={yyyy-mm-dd}&page=0&size=50`

Team views use Spring Data `Pageable` to support large result sets.

## Data Model

All entities extend `AbstractAuditingEntity`.

- `SupportingOutcome`: Rally Cry, Defining Objective, outcome text, and owner.
- `WeeklyPlan`: owner, manager, week start, lifecycle state, submitted/reviewed timestamps.
- `WeeklyCommit`: plan, Supporting Outcome, title, description, chess category, priority, planned hours, actual hours, status, and manager note.

Flyway migration `V1__initial_schema.sql` creates the PostgreSQL schema and indexes.

## Security

The API is configured as an OAuth2 JWT resource server for Auth0-style issuer configuration. Health and info actuator endpoints are public; application endpoints require authentication.

## Performance Notes

- Web routes are Vite-bundled and Module Federation-ready for CDN delivery.
- API plan retrieval is modeled as a direct owner/week lookup with an entity graph for commits and outcomes.
- Manager dashboard retrieval is pageable for up to 2000+ records.
- RTK Query provides client-side caching and invalidation around plan and dashboard mutations.

## Local Development

```bash
npm install
npm run dev
```

Backend development in an environment with Gradle:

```bash
cd apps/api
gradle bootRun
```

Production deployment would publish the web `dist` assets to S3/CloudFront and run the API as a containerized Spring Boot service on EKS.
