# Test Results

Date: 2026-06-23

## Latest Local Results

| Area | Command | Status | Notes |
| --- | --- | --- | --- |
| Frontend dependencies | `npm install` | Passed | Cypress package install required `CYPRESS_INSTALL_BINARY=0` after the full binary download hit local disk limits |
| Frontend tests | `npm run test:run` | Passed | 1 test file, 2 tests passed |
| Frontend build | `npm run build` | Passed | Vite production build completed and emitted `remoteEntry.js` |
| Frontend lint | `npm run lint` | Passed | ESLint completed with no reported errors |
| Production dependency audit | `npm audit --omit=dev` | Passed | 0 production vulnerabilities |
| Dev server | `Invoke-WebRequest http://localhost:5173` | Passed | Returned HTTP 200 |
| Cypress/Gherkin setup | GitHub Actions run `28052065865` | Passed in CI | Mock-mode and API-mode Cypress/Cucumber scenarios passed; local execution remains constrained by disk space |
| Browser smoke check | GitHub Actions run `28052065865` | Passed in CI | Vite dev server and nginx-served Compose web entrypoint both returned HTTP 200 in CI |
| Backend wrapper | GitHub Actions run `28052065865` | Passed in CI | Backend tests, JaCoCo report, and coverage verification passed from the API Gradle wrapper |
| Docker/API-mode follow-up | GitHub Actions run `28052065865` | Passed | API-backed Cypress E2E exercised Vite proxy, local API auth, commit creation, and lifecycle lock through the Compose-backed API on commit `00b823e` |
| CI workflow | GitHub Actions run `28052065865` | Passed | Frontend lint, unit tests, build, Cypress E2E, backend tests, JaCoCo report, service coverage verification, Compose config, API/web image build, Compose stack startup, API-backed Cypress E2E, reusable smoke script, manager dashboard authorization path, controller authorization tests, and teardown passed on commit `00b823e` |

## E2E Coverage

The repository includes executable Cypress/Cucumber wiring for `apps/web/e2e/weekly-planning.feature` plus step definitions in `apps/web/e2e/weekly-planning.ts`. API-backed Cypress coverage lives in `apps/web/e2e/weekly-planning-api.feature` and `apps/web/e2e/weekly-planning-api.ts`.

The scenarios cover weekly commit creation, RCDO linkage, lifecycle movement, reconciliation, manager review, and a Compose-backed API path for commit creation and plan locking.
