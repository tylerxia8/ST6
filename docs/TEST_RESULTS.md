# Test Results

Date: 2026-06-22

## Latest Local Results

| Area | Command | Status | Notes |
| --- | --- | --- | --- |
| Frontend dependencies | `npm install` | Passed | Cypress package install required `CYPRESS_INSTALL_BINARY=0` after the full binary download hit local disk limits |
| Frontend tests | `npm run test:run` | Passed | 1 test file, 2 tests passed |
| Frontend build | `npm run build` | Passed | Vite production build completed and emitted `remoteEntry.js` |
| Frontend lint | `npm run lint` | Passed | ESLint completed with no reported errors |
| Production dependency audit | `npm audit --omit=dev` | Passed | 0 production vulnerabilities |
| Dev server | `Invoke-WebRequest http://localhost:5173` | Passed | Returned HTTP 200 |
| Cypress/Gherkin setup | `npm run e2e` | Blocked | Cypress config and step definitions are present; local run requires `cypress install`, which previously failed with `ENOSPC` while downloading the binary |
| Browser smoke check | In-app browser automation | Blocked | Browser runtime failed with environment metadata error before attaching |
| Backend wrapper | `npm run api:test` | Blocked | Gradle wrapper downloaded Gradle 8.10.2, then local disk space prevented Gradle cache creation and dependency resolution |
| Docker/API-mode follow-up | Static review | Not run | Dependency caches were removed to recover disk space; remaining disk budget is too low for another install/build cycle |
| CI workflow | Static review | Not run locally | Added GitHub Actions workflow for frontend, Cypress, backend, JaCoCo, and Testcontainers |

## E2E Coverage

The repository includes executable Cypress/Cucumber wiring for `apps/web/e2e/weekly-planning.feature` plus step definitions in `apps/web/e2e/weekly-planning.ts`.

The scenarios cover weekly commit creation, RCDO linkage, lifecycle movement, reconciliation, and manager review.
