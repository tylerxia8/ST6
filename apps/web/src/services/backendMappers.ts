import type {
  CommitCategory,
  CommitStatus,
  LifecycleState,
  ManagerDashboard,
  WeeklyPlan
} from "../domain/types";

export interface BackendCommit {
  id: string;
  title: string;
  description: string;
  supportingOutcomeId: string;
  category: string;
  priority: number;
  plannedHours: number;
  actualHours: number;
  status: string;
  managerNote?: string;
}

export interface BackendPlan {
  id: string;
  weekStart: string;
  ownerId: string;
  ownerName: string;
  managerId: string;
  lifecycleState: LifecycleState;
  submittedAt?: string;
  reviewedAt?: string;
  commits: BackendCommit[];
}

export interface BackendPage<T> {
  content: T[];
}

export interface BackendTeamMember {
  id: string;
  ownerId: string;
  name: string;
  lifecycleState: LifecycleState;
  alignment: number;
  plannedHours: number;
  actualHours: number;
  blockedCommits: number;
}

export interface BackendDashboard {
  weekStart: string;
  completionRate: number;
  alignmentRate: number;
  reviewTurnaroundHours: number;
  teamMembers: BackendTeamMember[];
}

export const commitCategoryToBackend: Record<CommitCategory, string> = {
  Queen: "QUEEN",
  Rook: "ROOK",
  Bishop: "BISHOP",
  Knight: "KNIGHT",
  Pawn: "PAWN"
};

export const commitStatusToBackend: Record<CommitStatus, string> = {
  Planned: "PLANNED",
  "In progress": "IN_PROGRESS",
  Done: "DONE",
  "Carried forward": "CARRIED_FORWARD",
  Blocked: "BLOCKED"
};

const commitCategoryFromBackend: Record<string, CommitCategory> = {
  QUEEN: "Queen",
  ROOK: "Rook",
  BISHOP: "Bishop",
  KNIGHT: "Knight",
  PAWN: "Pawn"
};

const commitStatusFromBackend: Record<string, CommitStatus> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  CARRIED_FORWARD: "Carried forward",
  BLOCKED: "Blocked"
};

export function mapPlan(plan: BackendPlan): WeeklyPlan {
  return {
    ...plan,
    commits: plan.commits.map((commit) => ({
      ...commit,
      ownerId: plan.ownerId,
      ownerName: plan.ownerName,
      category: commitCategoryFromBackend[commit.category] ?? "Pawn",
      status: commitStatusFromBackend[commit.status] ?? "Planned"
    }))
  };
}

export function mapDashboard(
  dashboard: BackendDashboard
): ManagerDashboard {
  const mappedMembers = dashboard.teamMembers.map((member) => ({
    id: member.ownerId,
    name: member.name,
    role: "Team member",
    lifecycleState: member.lifecycleState,
    alignment: member.alignment,
    plannedHours: Number(member.plannedHours),
    actualHours: Number(member.actualHours),
    blockedCommits: member.blockedCommits
  }));

  return {
    weekStart: dashboard.weekStart,
    completionRate: dashboard.completionRate,
    alignmentRate: dashboard.alignmentRate,
    reviewTurnaroundHours: dashboard.reviewTurnaroundHours,
    teamMembers: mappedMembers
  };
}
