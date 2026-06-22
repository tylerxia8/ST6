import { initialDashboard, initialPlan, outcomes } from "../domain/seedData";
import { nextLifecycleState } from "../domain/workflow";
import type { ManagerDashboard, SupportingOutcome, WeeklyCommit, WeeklyPlan } from "../domain/types";
import type { NewCommit, St6Client } from "./st6Client";

let planState: WeeklyPlan = structuredClone(initialPlan);
let dashboardState: ManagerDashboard = structuredClone(initialDashboard);

function syncDashboardWithPlan(): void {
  dashboardState = {
    ...dashboardState,
    teamMembers: dashboardState.teamMembers.map((member) =>
      member.id === planState.ownerId
        ? {
            ...member,
            lifecycleState: planState.lifecycleState,
            alignment: planState.commits.length > 0 ? 100 : 0,
            plannedHours: planState.commits.reduce((sum, commit) => sum + commit.plannedHours, 0),
            actualHours: planState.commits.reduce((sum, commit) => sum + commit.actualHours, 0),
            blockedCommits: planState.commits.filter((commit) => commit.status === "Blocked").length
          }
        : member
    )
  };
}

export const mockSt6Client: St6Client = {
  async getCurrentPlan() {
    return structuredClone(planState);
  },
  async getOutcomes(): Promise<SupportingOutcome[]> {
    return structuredClone(outcomes);
  },
  async getManagerDashboard() {
    return structuredClone(dashboardState);
  },
  async addCommit(commit: NewCommit) {
    planState = {
      ...planState,
      commits: [
        ...planState.commits,
        {
          ...commit,
          id: `c-${Date.now()}`,
          ownerId: planState.ownerId,
          ownerName: planState.ownerName,
          actualHours: 0,
          status: "Planned" as const
        }
      ].sort((a, b) => a.priority - b.priority)
    };
    syncDashboardWithPlan();
    return structuredClone(planState);
  },
  async updateCommit(commit: WeeklyCommit) {
    planState = {
      ...planState,
      commits: planState.commits
        .map((existing) => (existing.id === commit.id ? commit : existing))
        .sort((a, b) => a.priority - b.priority)
    };
    syncDashboardWithPlan();
    return structuredClone(planState);
  },
  async deleteCommit(commitId: string) {
    planState = {
      ...planState,
      commits: planState.commits.filter((commit) => commit.id !== commitId)
    };
    syncDashboardWithPlan();
    return structuredClone(planState);
  },
  async advanceLifecycle() {
    planState = {
      ...planState,
      lifecycleState: nextLifecycleState(planState.lifecycleState),
      submittedAt: planState.lifecycleState === "DRAFT" ? new Date().toISOString() : planState.submittedAt,
      reviewedAt: planState.lifecycleState === "RECONCILING" ? new Date().toISOString() : planState.reviewedAt
    };
    syncDashboardWithPlan();
    return structuredClone(planState);
  }
};
