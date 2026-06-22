export type LifecycleState = "DRAFT" | "LOCKED" | "RECONCILING" | "RECONCILED";

export type CommitCategory = "Queen" | "Rook" | "Bishop" | "Knight" | "Pawn";

export type CommitStatus = "Planned" | "In progress" | "Done" | "Carried forward" | "Blocked";

export interface SupportingOutcome {
  id: string;
  rallyCry: string;
  definingObjective: string;
  outcome: string;
  owner: string;
}

export interface WeeklyCommit {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  supportingOutcomeId: string;
  category: CommitCategory;
  priority: number;
  plannedHours: number;
  actualHours: number;
  status: CommitStatus;
  managerNote?: string;
}

export interface WeeklyPlan {
  id: string;
  weekStart: string;
  ownerId: string;
  ownerName: string;
  managerId: string;
  lifecycleState: LifecycleState;
  commits: WeeklyCommit[];
  submittedAt?: string;
  reviewedAt?: string;
}

export interface TeamMemberSummary {
  id: string;
  name: string;
  role: string;
  lifecycleState: LifecycleState;
  alignment: number;
  plannedHours: number;
  actualHours: number;
  blockedCommits: number;
}

export interface ManagerDashboard {
  weekStart: string;
  completionRate: number;
  alignmentRate: number;
  reviewTurnaroundHours: number;
  teamMembers: TeamMemberSummary[];
}
