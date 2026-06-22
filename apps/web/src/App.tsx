import { Alert, Button } from "flowbite-react";
import { CalendarCheck, GitBranch, RefreshCcw, UsersRound } from "lucide-react";
import { CommitForm } from "./components/CommitForm";
import { CommitTable } from "./components/CommitTable";
import { LifecycleRail } from "./components/LifecycleRail";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { MetricTile } from "./components/MetricTile";
import {
  useAddCommitMutation,
  useAdvanceLifecycleMutation,
  useDeleteCommitMutation,
  useGetCurrentPlanQuery,
  useGetManagerDashboardQuery,
  useGetOutcomesQuery,
  useUpdateCommitMutation
} from "./services/st6Api";
import {
  calculateActualHours,
  calculateAlignment,
  calculatePlannedHours,
  canEditCommits,
  lifecycleActionLabel,
  lifecycleLabels
} from "./domain/workflow";

export function App() {
  const planQuery = useGetCurrentPlanQuery();
  const outcomesQuery = useGetOutcomesQuery();
  const dashboardQuery = useGetManagerDashboardQuery();
  const [addCommit] = useAddCommitMutation();
  const [updateCommit] = useUpdateCommitMutation();
  const [deleteCommit] = useDeleteCommitMutation();
  const [advanceLifecycle, advanceState] = useAdvanceLifecycleMutation();

  if (planQuery.isLoading || outcomesQuery.isLoading || dashboardQuery.isLoading) {
    return <div className="p-6 text-sm text-slate-600">Loading weekly plan...</div>;
  }

  if (!planQuery.data || !outcomesQuery.data || !dashboardQuery.data) {
    return (
      <div className="p-6">
        <Alert color="failure">Unable to load the weekly planning workspace.</Alert>
      </div>
    );
  }

  const plan = planQuery.data;
  const outcomes = outcomesQuery.data;
  const dashboard = dashboardQuery.data;
  const editable = canEditCommits(plan);
  const alignment = calculateAlignment(plan.commits);
  const plannedHours = calculatePlannedHours(plan.commits);
  const actualHours = calculateActualHours(plan.commits);

  return (
    <main className="min-h-screen bg-cloud">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-moss">
                <GitBranch className="h-4 w-4" aria-hidden="true" />
                ST6 Weekly Commitments
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-ink md:text-3xl">
                {plan.ownerName}'s plan for {plan.weekStart}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Weekly work is required to map to the RCDO hierarchy before manager review.
              </p>
            </div>
            <Button
              color="dark"
              onClick={() => void advanceLifecycle()}
              disabled={advanceState.isLoading}
              className="w-full sm:w-fit"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {lifecycleActionLabel(plan.lifecycleState)}
            </Button>
          </div>
          <LifecycleRail state={plan.lifecycleState} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricTile label="Strategic Alignment" value={`${alignment}%`} helper="Commits linked to RCDO" />
          <MetricTile label="Planned Capacity" value={`${plannedHours}h`} helper="Total weekly commitments" />
          <MetricTile label="Actuals Logged" value={`${actualHours}h`} helper="Used during reconciliation" />
          <MetricTile
            label="Lifecycle"
            value={lifecycleLabels[plan.lifecycleState]}
            helper="Controls edit and review state"
          />
        </div>

        {!editable && (
          <Alert color="warning">
            This plan is locked for commit edits. Advance to reconciliation to update actuals and carry-forward status.
          </Alert>
        )}

        <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
          <div className="grid gap-5">
            <CommitForm outcomes={outcomes} onAdd={(commit) => void addCommit(commit)} disabled={!editable} />
            <CommitTable
              commits={plan.commits}
              outcomes={outcomes}
              editable={editable}
              onUpdate={(commit) => void updateCommit(commit)}
              onDelete={(commitId) => void deleteCommit(commitId)}
            />
          </div>

          <aside className="grid content-start gap-5">
            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-copper" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-ink">Reconciliation</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {plan.commits.map((commit) => {
                  const variance = commit.actualHours - commit.plannedHours;
                  return (
                    <div key={commit.id} className="rounded-md border border-slate-200 p-3">
                      <p className="font-medium text-ink">{commit.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {commit.status} / variance {variance >= 0 ? "+" : ""}
                        {variance}h
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-moss" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-ink">Review Queue</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {dashboard.teamMembers.filter((member) => member.lifecycleState !== "RECONCILED").length} plans need
                manager attention.
              </p>
            </section>
          </aside>
        </div>

        <ManagerDashboard dashboard={dashboard} />
      </section>
    </main>
  );
}
