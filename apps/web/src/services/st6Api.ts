import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  apiBaseUrl,
  apiMode,
  authToken,
  demoManagerId,
  demoOwnerId,
  demoWeekStart
} from "../config";
import { initialDashboard, initialPlan, outcomes } from "../domain/seedData";
import { nextLifecycleState } from "../domain/workflow";
import type {
  CommitCategory,
  CommitStatus,
  LifecycleState,
  ManagerDashboard,
  SupportingOutcome,
  WeeklyCommit,
  WeeklyPlan
} from "../domain/types";

let planState: WeeklyPlan = structuredClone(initialPlan);
let dashboardState: ManagerDashboard = structuredClone(initialDashboard);

type NewCommit = Omit<WeeklyCommit, "id" | "ownerId" | "ownerName" | "actualHours" | "status">;

interface BackendCommit {
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

interface BackendPlan {
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

interface BackendPage<T> {
  content: T[];
}

interface BackendTeamMember {
  id: string;
  ownerId: string;
  name: string;
  lifecycleState: LifecycleState;
  alignment: number;
  plannedHours: number;
  actualHours: number;
  blockedCommits: number;
}

const commitCategoryToBackend: Record<CommitCategory, string> = {
  Queen: "QUEEN",
  Rook: "ROOK",
  Bishop: "BISHOP",
  Knight: "KNIGHT",
  Pawn: "PAWN"
};

const commitCategoryFromBackend: Record<string, CommitCategory> = {
  QUEEN: "Queen",
  ROOK: "Rook",
  BISHOP: "Bishop",
  KNIGHT: "Knight",
  PAWN: "Pawn"
};

const commitStatusToBackend: Record<CommitStatus, string> = {
  Planned: "PLANNED",
  "In progress": "IN_PROGRESS",
  Done: "DONE",
  "Carried forward": "CARRIED_FORWARD",
  Blocked: "BLOCKED"
};

const commitStatusFromBackend: Record<string, CommitStatus> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  CARRIED_FORWARD: "Carried forward",
  BLOCKED: "Blocked"
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mapPlan(plan: BackendPlan): WeeklyPlan {
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

function mapTeamMember(member: BackendTeamMember) {
  return {
    id: member.ownerId,
    name: member.name,
    role: "Team member",
    lifecycleState: member.lifecycleState,
    alignment: member.alignment,
    plannedHours: Number(member.plannedHours),
    actualHours: Number(member.actualHours),
    blockedCommits: member.blockedCommits
  };
}

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

export const st6Api = createApi({
  reducerPath: "st6Api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Plan", "Dashboard", "Outcomes"],
  endpoints: (builder) => ({
    getCurrentPlan: builder.query<WeeklyPlan, void>({
      queryFn: async () => {
        if (apiMode === "api") {
          try {
            const plan = await requestJson<BackendPlan>(
              `/plans/current?ownerId=${demoOwnerId}&weekStart=${demoWeekStart}`
            );
            planState = mapPlan(plan);
            return { data: structuredClone(planState) };
          } catch (error) {
            return { error };
          }
        }

        return { data: structuredClone(planState) };
      },
      providesTags: ["Plan"]
    }),
    getOutcomes: builder.query<SupportingOutcome[], void>({
      queryFn: async () => {
        if (apiMode === "api") {
          try {
            return { data: await requestJson<SupportingOutcome[]>("/outcomes") };
          } catch (error) {
            return { error };
          }
        }

        return { data: outcomes };
      },
      providesTags: ["Outcomes"]
    }),
    getManagerDashboard: builder.query<ManagerDashboard, void>({
      queryFn: async () => {
        if (apiMode === "api") {
          try {
            const page = await requestJson<BackendPage<BackendTeamMember>>(
              `/managers/${demoManagerId}/plans?weekStart=${demoWeekStart}&page=0&size=50`
            );
            const teamMembers = page.content.map(mapTeamMember);
            const alignmentRate =
              teamMembers.length === 0
                ? 0
                : Math.round(
                    teamMembers.reduce((sum, member) => sum + member.alignment, 0) / teamMembers.length
                  );
            return {
              data: {
                weekStart: demoWeekStart,
                completionRate: Math.round(
                  (teamMembers.filter((member) => member.lifecycleState !== "DRAFT").length /
                    Math.max(teamMembers.length, 1)) *
                    100
                ),
                alignmentRate,
                reviewTurnaroundHours: 0,
                teamMembers
              }
            };
          } catch (error) {
            return { error };
          }
        }

        return { data: structuredClone(dashboardState) };
      },
      providesTags: ["Dashboard"]
    }),
    addCommit: builder.mutation<WeeklyPlan, NewCommit>({
      queryFn: async (commit) => {
        if (apiMode === "api") {
          try {
            const plan = await requestJson<BackendPlan>(`/plans/${planState.id}/commits`, {
              method: "POST",
              body: JSON.stringify({
                title: commit.title,
                description: commit.description,
                supportingOutcomeId: commit.supportingOutcomeId,
                category: commitCategoryToBackend[commit.category],
                priority: commit.priority,
                plannedHours: commit.plannedHours
              })
            });
            planState = mapPlan(plan);
            return { data: structuredClone(planState) };
          } catch (error) {
            return { error };
          }
        }

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
        return { data: structuredClone(planState) };
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    updateCommit: builder.mutation<WeeklyPlan, WeeklyCommit>({
      queryFn: async (commit) => {
        if (apiMode === "api" && planState.lifecycleState === "RECONCILING") {
          try {
            const plan = await requestJson<BackendPlan>(
              `/plans/${planState.id}/commits/${commit.id}/reconciliation`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  actualHours: commit.actualHours,
                  status: commitStatusToBackend[commit.status],
                  managerNote: commit.managerNote
                })
              }
            );
            planState = mapPlan(plan);
            return { data: structuredClone(planState) };
          } catch (error) {
            return { error };
          }
        }

        planState = {
          ...planState,
          commits: planState.commits
            .map((existing) => (existing.id === commit.id ? commit : existing))
            .sort((a, b) => a.priority - b.priority)
        };
        syncDashboardWithPlan();
        return { data: structuredClone(planState) };
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    deleteCommit: builder.mutation<WeeklyPlan, string>({
      queryFn: async (commitId) => {
        if (apiMode === "api") {
          try {
            const plan = await requestJson<BackendPlan>(`/plans/${planState.id}/commits/${commitId}`, {
              method: "DELETE"
            });
            planState = mapPlan(plan);
            return { data: structuredClone(planState) };
          } catch (error) {
            return { error };
          }
        }

        planState = {
          ...planState,
          commits: planState.commits.filter((commit) => commit.id !== commitId)
        };
        syncDashboardWithPlan();
        return { data: structuredClone(planState) };
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    advanceLifecycle: builder.mutation<WeeklyPlan, void>({
      queryFn: async () => {
        if (apiMode === "api") {
          try {
            const plan = await requestJson<BackendPlan>(`/plans/${planState.id}/lifecycle/advance`, {
              method: "POST"
            });
            planState = mapPlan(plan);
            return { data: structuredClone(planState) };
          } catch (error) {
            return { error };
          }
        }

        planState = {
          ...planState,
          lifecycleState: nextLifecycleState(planState.lifecycleState),
          submittedAt: planState.lifecycleState === "DRAFT" ? new Date().toISOString() : planState.submittedAt,
          reviewedAt: planState.lifecycleState === "RECONCILING" ? new Date().toISOString() : planState.reviewedAt
        };
        syncDashboardWithPlan();
        return { data: structuredClone(planState) };
      },
      invalidatesTags: ["Plan", "Dashboard"]
    })
  })
});

export const {
  useGetCurrentPlanQuery,
  useGetOutcomesQuery,
  useGetManagerDashboardQuery,
  useAddCommitMutation,
  useUpdateCommitMutation,
  useDeleteCommitMutation,
  useAdvanceLifecycleMutation
} = st6Api;
