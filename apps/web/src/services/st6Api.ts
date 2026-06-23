import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiMode } from "../config";
import type { SupportingOutcome, WeeklyCommit, WeeklyPlan } from "../domain/types";
import { httpSt6Client } from "./httpSt6Client";
import { mockSt6Client } from "./mockSt6Client";
import type { ManagerDashboard } from "../domain/types";
import type { NewCommit } from "./st6Client";

const client = apiMode === "api" ? httpSt6Client : mockSt6Client;

async function query<T>(operation: () => Promise<T>) {
  try {
    return { data: await operation() };
  } catch (error) {
    return { error };
  }
}

export const st6Api = createApi({
  reducerPath: "st6Api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Plan", "Dashboard", "Outcomes"],
  endpoints: (builder) => ({
    getCurrentPlan: builder.query<WeeklyPlan, void>({
      queryFn: () => query(() => client.getCurrentPlan()),
      providesTags: ["Plan"]
    }),
    getOutcomes: builder.query<SupportingOutcome[], void>({
      queryFn: () => query(() => client.getOutcomes()),
      providesTags: ["Outcomes"]
    }),
    getManagerDashboard: builder.query<ManagerDashboard, void>({
      queryFn: () => query(() => client.getManagerDashboard()),
      providesTags: ["Dashboard"]
    }),
    addCommit: builder.mutation<WeeklyPlan, NewCommit>({
      queryFn: (commit) => query(() => client.addCommit(commit)),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(st6Api.util.upsertQueryData("getCurrentPlan", undefined, data));
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    updateCommit: builder.mutation<WeeklyPlan, WeeklyCommit>({
      queryFn: (commit) => query(() => client.updateCommit(commit)),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(st6Api.util.upsertQueryData("getCurrentPlan", undefined, data));
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    deleteCommit: builder.mutation<WeeklyPlan, string>({
      queryFn: (commitId) => query(() => client.deleteCommit(commitId)),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(st6Api.util.upsertQueryData("getCurrentPlan", undefined, data));
      },
      invalidatesTags: ["Plan", "Dashboard"]
    }),
    advanceLifecycle: builder.mutation<WeeklyPlan, void>({
      queryFn: () => query(() => client.advanceLifecycle()),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(st6Api.util.upsertQueryData("getCurrentPlan", undefined, data));
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
