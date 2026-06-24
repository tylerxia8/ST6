# ST6

ST6 is a strategic weekly planning module that replaces disconnected 15Five planning with weekly commitments tied directly to the Rally Cry, Defining Objective, and Supporting Outcome hierarchy.

## What Is Included

- React 18 + Vite 5 micro-frontend in `apps/web`
- Module Federation-ready remote configuration
- TypeScript strict mode
- Redux Toolkit + RTK Query API access
- Tailwind CSS + Flowbite React UI
- Weekly plan lifecycle: draft, locked, reconciling, reconciled, carry forward
- Commit CRUD UI with RCDO linking and prioritization
- Manager dashboard and reconciliation views
- Spring Boot 3.3 Java 21 backend source in `apps/api`
- PostgreSQL/Flyway/JPA domain model
- Technical docs, test results, AI usage log, and demo script

## Quick Start

```bash
npm install
npm run dev
```

The web app runs at `http://localhost:5173`.

By default, the frontend runs in mock mode so the assessment can be reviewed without PostgreSQL or Auth0:

```bash
VITE_API_MODE=mock
```

To point the frontend at the Spring API, set:

```bash
VITE_API_MODE=api
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AUTH_TOKEN=<auth0-jwt>
```

## Useful Commands

```bash
npm run build
npm run test:run
npm run lint
```

Backend source is in `apps/api` and includes a Gradle wrapper:

```bash
cd apps/api
gradlew.bat test
gradlew.bat bootRun
```

## Docker Compose

Copy `.env.example` to `.env`, then run:

```bash
docker compose up --build
```

Compose starts PostgreSQL 16.4, the Spring API, and the built web app.
After the stack is up, run `bash scripts/compose-smoke.sh` to verify API health,
seeded demo data, and the web entrypoint.

The default `.env.example` values run the API with `SPRING_PROFILES_ACTIVE=local`.
That profile seeds demo data and installs a local-only demo authentication filter so the
frontend can exercise the real API without requiring an Auth0 token. Use a non-local
Spring profile and a real `AUTH0_ISSUER_URI` for production-like JWT validation.

## API Docs

When the API is running, OpenAPI documentation is available at:

```text
http://localhost:8080/swagger-ui.html
```

Application endpoints expect JWT scopes:

- `st6:read`
- `st6:write`
- `st6:manager`
- `st6:admin`

## Documentation

- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Policy](SECURITY.md)
- [Test Results](docs/TEST_RESULTS.md)
- [AI Usage Log](docs/AI_USAGE_LOG.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Demo Video Guide](docs/DEMO_VIDEO_GUIDE.md)

## Submission Status

The repository is assessment-ready without a recorded demo video. The demo script and guide
remain in `docs/` for reviewers who want a walkthrough, but the executable app, API,
Docker runtime, CI, API-backed E2E, CodeQL, and container scans are the primary evidence.

## Production Path

Production deployment uses the Spring API image, PostgreSQL/RDS, Auth0 JWT validation,
and CloudFront-hosted Module Federation assets. See `.env.production.example`,
`.github/workflows/release.yml`, and `infra/k8s/` for the release and EKS templates.

The assessment repo uses npm workspaces for portability in this environment. The code is
kept in an Nx-compatible monorepo shape (`apps/web`, `apps/api`, shared root scripts), but
Nx/Yarn wiring is intentionally documented rather than required for reviewers to run it.

## Security Automation

Dependabot tracks npm, Gradle, Docker, and GitHub Actions updates. CodeQL scans Java and
TypeScript source, and Trivy scans built API/web container images with SARIF upload to
GitHub code scanning.
