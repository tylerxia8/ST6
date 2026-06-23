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
| Cypress/Gherkin setup | `npm run e2e` | Blocked | Cypress config and step definitions are present; local run requires `cypress install`, which previously failed with `ENOSPC` while downloading the binary |
| Browser smoke check | In-app browser automation | Blocked | Browser runtime failed with environment metadata error before attaching |
| Backend wrapper | `npm run api:test` | Blocked locally | Gradle wrapper downloaded Gradle 8.10.2, then the local daemon disappeared under disk/memory pressure before tasks completed |
| Docker/API-mode follow-up | GitHub Actions run `28051822395` | Passed | API-backed Cypress E2E exercised Vite proxy, local API auth, commit creation, and lifecycle lock through the Compose-backed API on commit `38e5ed3` |
| CI workflow | GitHub Actions run `28051822395` | Passed | Frontend lint, unit tests, build, Cypress E2E, backend tests, JaCoCo report, service coverage verification, Compose config, API/web image build, Compose stack startup, API-backed Cypress E2E, reusable smoke script, manager dashboard authorization path, controller authorization tests, and teardown passed on commit `38e5ed3` |

## E2E Coverage

The repository includes executable Cypress/Cucumber wiring for `apps/web/e2e/weekly-planning.feature` plus step definitions in `apps/web/e2e/weekly-planning.ts`. API-backed Cypress coverage lives in `apps/web/e2e/weekly-planning-api.feature` and `apps/web/e2e/weekly-planning-api.ts`.

The scenarios cover weekly commit creation, RCDO linkage, lifecycle movement, reconciliation, manager review, and a Compose-backed API path for commit creation and plan locking.
