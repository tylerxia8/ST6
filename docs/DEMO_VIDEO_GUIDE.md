# Demo Video Guide

Target length: 3-5 minutes.

## Recording Flow

1. Show the repo root and explain that ST6 replaces disconnected 15Five planning.
2. Start the frontend in mock mode with `npm run dev`.
3. Open `http://localhost:5173`.
4. Add a weekly commit and link it to a Supporting Outcome.
5. Explain the chess layer and priority model.
6. Lock the plan, advance to reconciliation, enter actual hours, and set a status.
7. Show the manager dashboard and review queue.
8. Briefly show `apps/api` for the Spring Boot API, Flyway migration, Auth0 resource server config, and auditing entities.
9. Show `docker-compose.yml` for PostgreSQL, API, and web runtime.
10. Show `apps/web/vite.config.ts` and `remoteEntry.js` exposure for Module Federation.

## Closing Script

ST6 enforces strategy alignment at the weekly planning boundary. Every commit links to the RCDO hierarchy, managers get a reviewable team roll-up, and reconciliation captures planned vs actual execution. The app runs standalone for assessment and is structured as a Vite Module Federation remote for PA host integration.
