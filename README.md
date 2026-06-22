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

## Documentation

- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Test Results](docs/TEST_RESULTS.md)
- [AI Usage Log](docs/AI_USAGE_LOG.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
