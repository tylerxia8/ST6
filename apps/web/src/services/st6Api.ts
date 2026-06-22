import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { initialDashboard, initialPlan, outcomes } from "../domain/seedData";
import { nextLifecycleState } from "../domain/workflow";
import type { ManagerDashboard, SupportingOutcome, WeeklyCommit, WeeklyPlan } from "../domain/types";

let planState: WeeklyPlan = structuredClone(initialPlan);
let dashboardState: ManagerDashboard = structuredClone(initialDashboard);

type NewCommit = Omit<WeeklyCommit, "id" | "ownerId" | "ownerName" | "actualHours" | "status">;

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
      queryFn: () => ({ data: structuredClone(planState) }),
      providesTags: ["Plan"]
    }),
    getOutcomes: builder.query<SupportingOutcome[], void>({
      queryFn: () => ({ data: outcomes }),
      providesTags: ["Outcomes"]
    }),
    getManagerDashboard: builder.query<ManagerDashboard, void>({
      queryFn: () => ({ data: structuredClone(dashboardState) }),
      providesTags: ["Dashboard"]
    }),
    addCommit: builder.mutation<WeeklyPlan, NewCommit>({
      queryFn: (commit) => {
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
      queryFn: (commit) => {
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
      queryFn: (commitId) => {
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
      queryFn: () => {
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
