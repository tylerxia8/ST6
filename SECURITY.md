# Security

## Supported Version

The `main` branch is the active development and assessment branch for ST6.

## Reporting

Do not open public issues for suspected vulnerabilities. Share details with the repository owner through the private channel used for the assessment or engagement.

Include:

- affected component (`apps/web`, `apps/api`, infrastructure, or CI)
- reproduction steps
- expected impact
- dependency or container image details, when relevant

## Automated Checks

The repository includes:

- Dependabot updates for npm, Gradle, Docker, and GitHub Actions.
- CodeQL scanning for Java and TypeScript, saved as SARIF artifacts.
- Trivy container image scans saved as SARIF artifacts, with best-effort upload to GitHub code scanning when repository settings allow it.
- CI coverage for frontend lint/test/build, backend tests and coverage, Docker Compose smoke checks, and API-backed Cypress E2E.

Trivy currently reports findings without failing CI so the first baseline can be reviewed. After triage, set `exit-code: "1"` in `.github/workflows/container-scan.yml` to enforce a blocking gate for high and critical fixed vulnerabilities.
