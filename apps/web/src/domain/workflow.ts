import type { LifecycleState, WeeklyCommit, WeeklyPlan } from "./types";

export const lifecycleOrder: LifecycleState[] = ["DRAFT", "LOCKED", "RECONCILING", "RECONCILED"];

export const lifecycleLabels: Record<LifecycleState, string> = {
  DRAFT: "Draft",
  LOCKED: "Locked",
  RECONCILING: "Reconciling",
  RECONCILED: "Reconciled"
};

export function calculateAlignment(commits: WeeklyCommit[]): number {
  if (commits.length === 0) {
    return 0;
  }

  const linked = commits.filter((commit) => commit.supportingOutcomeId.length > 0).length;
  return Math.round((linked / commits.length) * 100);
}

export function calculatePlannedHours(commits: WeeklyCommit[]): number {
  return commits.reduce((sum, commit) => sum + commit.plannedHours, 0);
}

export function calculateActualHours(commits: WeeklyCommit[]): number {
  return commits.reduce((sum, commit) => sum + commit.actualHours, 0);
}

export function nextLifecycleState(state: LifecycleState): LifecycleState {
  switch (state) {
    case "DRAFT":
      return "LOCKED";
    case "LOCKED":
      return "RECONCILING";
    case "RECONCILING":
      return "RECONCILED";
    case "RECONCILED":
      return "DRAFT";
  }
}

export function lifecycleActionLabel(state: LifecycleState): string {
  switch (state) {
    case "DRAFT":
      return "Lock plan";
    case "LOCKED":
      return "Start reconciliation";
    case "RECONCILING":
      return "Mark reconciled";
    case "RECONCILED":
      return "Carry forward";
  }
}

export function canEditCommits(plan: WeeklyPlan): boolean {
  return plan.lifecycleState === "DRAFT" || plan.lifecycleState === "RECONCILING";
}
