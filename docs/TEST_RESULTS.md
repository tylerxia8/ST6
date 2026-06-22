# Test Results

Date: 2026-06-21

## Planned Verification

- Frontend install
- Frontend unit tests
- Frontend production build
- Frontend lint
- Backend unit tests where Gradle is available

## Latest Local Results

| Area | Command | Status | Notes |
| --- | --- | --- | --- |
| Frontend dependencies | `npm install` | Passed | 384 packages installed |
| Frontend tests | `npm run test:run` | Passed | 1 test file, 2 tests passed |
| Frontend build | `npm run build` | Passed | Vite production build completed and emitted `remoteEntry.js` |
| Frontend lint | `npm run lint` | Passed | ESLint completed with no reported errors |
| Production dependency audit | `npm audit --omit=dev` | Passed | 0 production vulnerabilities |
| Dev server | `Invoke-WebRequest http://localhost:5173` | Passed | Returned HTTP 200 |
| Browser smoke check | In-app browser automation | Blocked | Browser runtime failed with environment metadata error before attaching |
| Backend tests | `gradle test` | Not run | Gradle is not installed in the current shell and no wrapper is present |

## E2E Coverage

The repository includes a Gherkin feature file at `apps/web/e2e/weekly-planning.feature` covering weekly commit creation, lifecycle movement, reconciliation, and manager review. Cypress runner wiring is intentionally left as a documented next step to avoid pulling a large binary dependency into the assessment scaffold unless required by the reviewer.
