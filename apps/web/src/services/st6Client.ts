import type { ManagerDashboard, SupportingOutcome, WeeklyCommit, WeeklyPlan } from "../domain/types";

export type NewCommit = Omit<WeeklyCommit, "id" | "ownerId" | "ownerName" | "actualHours" | "status">;

export interface St6Client {
  getCurrentPlan(): Promise<WeeklyPlan>;
  getOutcomes(): Promise<SupportingOutcome[]>;
  getManagerDashboard(): Promise<ManagerDashboard>;
  addCommit(commit: NewCommit): Promise<WeeklyPlan>;
  updateCommit(commit: WeeklyCommit): Promise<WeeklyPlan>;
  deleteCommit(commitId: string): Promise<WeeklyPlan>;
  advanceLifecycle(): Promise<WeeklyPlan>;
}
