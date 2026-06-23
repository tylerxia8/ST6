# Demo Video Guide

Target length: 3-5 minutes.

## Recording Flow

1. Show the repo root and explain that ST6 replaces disconnected 15Five planning.
2. Start the frontend in mock mode with `npm run dev`, or use Docker Compose for the API-backed path.
3. Open `http://localhost:5173`.
4. Add a weekly commit and link it to a Supporting Outcome.
5. Explain the chess layer and priority model.
6. Lock the plan, advance to reconciliation, enter actual hours, and set a status.
7. Show the manager dashboard and review queue.
8. Briefly show `apps/api` for the Spring Boot API, Flyway migration, Auth0 resource server config, and auditing entities.
9. Show `docker-compose.yml` for PostgreSQL, API, and web runtime.
10. Show `apps/web/vite.config.ts` and `remoteEntry.js` exposure for Module Federation.
11. Show `docs/DEPLOYMENT.md`, `.env.production.example`, and `infra/k8s` for the AWS/EKS deployment path.

## API-Backed Recording Option

Use this flow when enough local disk is available for Docker and Cypress:

```bash
copy .env.example .env
docker compose up --build
bash scripts/compose-smoke.sh
```

Open `http://localhost:8088` and record the same user flow against the real Spring API.

## Closing Script

ST6 enforces strategy alignment at the weekly planning boundary. Every commit links to the RCDO hierarchy, managers get a reviewable team roll-up, and reconciliation captures planned vs actual execution. The app runs standalone for assessment, is validated in API mode through CI, and is structured as a Vite Module Federation remote for PA host integration.
