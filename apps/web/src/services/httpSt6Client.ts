import {
  apiBaseUrl,
  authToken,
  demoManagerId,
  demoOwnerId,
  demoWeekStart
} from "../config";
import type { ManagerDashboard, SupportingOutcome, WeeklyCommit, WeeklyPlan } from "../domain/types";
import {
  commitCategoryToBackend,
  commitStatusToBackend,
  mapDashboard,
  mapPlan,
  type BackendDashboard,
  type BackendPlan,
} from "./backendMappers";
import type { NewCommit, St6Client } from "./st6Client";

let currentPlanId: string | undefined;
let currentLifecycleState: WeeklyPlan["lifecycleState"] | undefined;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...init?.headers
  };

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function remember(plan: BackendPlan): WeeklyPlan {
  const mapped = mapPlan(plan);
  currentPlanId = mapped.id;
  currentLifecycleState = mapped.lifecycleState;
  return mapped;
}

function currentPlanIdOrThrow(): string {
  if (!currentPlanId) {
    throw new Error("Current plan must be loaded before mutating commits");
  }
  return currentPlanId;
}

async function requireCurrentPlanId(): Promise<string> {
  if (!currentPlanId) {
    await getCurrentPlanFromApi();
  }
  return currentPlanIdOrThrow();
}

async function getCurrentPlanFromApi(): Promise<WeeklyPlan> {
  return remember(
    await requestJson<BackendPlan>(`/plans/current?ownerId=${demoOwnerId}&weekStart=${demoWeekStart}`)
  );
}

export const httpSt6Client: St6Client = {
  async getCurrentPlan() {
    return getCurrentPlanFromApi();
  },
  async getOutcomes(): Promise<SupportingOutcome[]> {
    return requestJson<SupportingOutcome[]>("/outcomes");
  },
  async getManagerDashboard(): Promise<ManagerDashboard> {
    const dashboard = await requestJson<BackendDashboard>(
      `/managers/${demoManagerId}/dashboard?weekStart=${demoWeekStart}&page=0&size=50`
    );
    return mapDashboard(dashboard);
  },
  async addCommit(commit: NewCommit) {
    return remember(
      await requestJson<BackendPlan>(`/plans/${await requireCurrentPlanId()}/commits`, {
        method: "POST",
        body: JSON.stringify({
          title: commit.title,
          description: commit.description,
          supportingOutcomeId: commit.supportingOutcomeId,
          category: commitCategoryToBackend[commit.category],
          priority: commit.priority,
          plannedHours: commit.plannedHours
        })
      })
    );
  },
  async updateCommit(commit: WeeklyCommit) {
    if (currentLifecycleState !== "RECONCILING") {
      return getCurrentPlanFromApi();
    }

    const planId = await requireCurrentPlanId();
    return remember(
      await requestJson<BackendPlan>(
        `/plans/${planId}/commits/${commit.id}/reconciliation`,
        {
          method: "PATCH",
          body: JSON.stringify({
            actualHours: commit.actualHours,
            status: commitStatusToBackend[commit.status],
            managerNote: commit.managerNote
          })
        }
      )
    );
  },
  async deleteCommit(commitId: string) {
    const planId = await requireCurrentPlanId();
    return remember(
      await requestJson<BackendPlan>(`/plans/${planId}/commits/${commitId}`, {
        method: "DELETE"
      })
    );
  },
  async advanceLifecycle() {
    const planId = await requireCurrentPlanId();
    return remember(
      await requestJson<BackendPlan>(`/plans/${planId}/lifecycle/advance`, {
        method: "POST"
      })
    );
  }
};
