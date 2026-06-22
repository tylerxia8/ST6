# Demo Script

## Setup

1. Open the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

## Walkthrough

1. Show the weekly planning workspace for Ava Chen.
2. Point out the lifecycle rail: Draft, Locked, Reconciling, Reconciled.
3. Add a new commit and select a Supporting Outcome.
4. Explain the chess layer and priority fields.
5. Lock the plan.
6. Advance to reconciliation.
7. Enter actual hours and change a commit status.
8. Show the reconciliation variance panel.
9. Show the manager dashboard roll-up.
10. Explain how the module is exposed as a Module Federation remote for PA host integration.

## Key Talking Points

- ST6 enforces strategic alignment at commit entry time.
- Managers can see whether weekly work supports current RCDO priorities.
- The lifecycle prevents uncontrolled edits after lock and creates a clear reconciliation stage.
- The backend source supports PostgreSQL, Flyway, Spring Data Pageable, Auth0-style JWT validation, auditing, and quality gates.
