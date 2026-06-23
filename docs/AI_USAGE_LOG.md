# AI Usage Log

Date: 2026-06-23

Tool: OpenAI Codex

## Work Performed

- Read and summarized the supplied PRD.
- Created the GitHub repository `tylerxia8/ST6`.
- Scaffolded the ST6 monorepo.
- Implemented a React/Vite weekly planning micro-frontend.
- Added RTK Query data access with deterministic seed data for standalone demo use.
- Added Module Federation remote configuration.
- Added Spring Boot backend source with JPA entities, Flyway schema, services, controllers, and tests.
- Added technical documentation, test results, and demo script.
- Added executable Cypress/Cucumber E2E wiring for the weekly planning feature.
- Added a Gradle wrapper for backend test and run commands.
- Added Docker runtime scaffolding and frontend API-mode configuration.
- Added backend CORS, structured error responses, and delete support for commit CRUD.
- Split frontend mock and HTTP API clients.
- Added GitHub Actions CI, OpenAPI, Auth0 scope checks, Testcontainers PostgreSQL test scaffolding, and Outlook integration boundary.
- Added API-backed Cypress E2E through the Vite proxy against the Compose-backed Spring API.
- Fixed API-mode commit creation by disabling CSRF for the API chain and returning detailed plans after mutations.
- Added production deployment documentation, Kubernetes templates, a production environment template, and a tag-based image release workflow.
- Documented the npm-vs-Nx/Yarn assessment tradeoff and the Microsoft Graph implementation boundary.

## Human Decisions

- User requested that all aspects of the PRD be completed.
- Implementation prioritized a complete assessment artifact that runs locally without requiring PostgreSQL, Auth0, AWS, or PA host infrastructure.

## Limitations

- The frontend defaults to mock mode for demo reliability, but CI now validates API mode against the Spring backend.
- Local full-stack validation was limited by the remaining local disk budget after cache cleanup; GitHub Actions is the authoritative validation path.
- Microsoft Graph reminder delivery is represented by an interface and no-op implementation until tenant credentials and calendar/mail rules are supplied.
- Demo video is represented by a script/checklist in this repository; an actual recorded video file still requires screen recording.
