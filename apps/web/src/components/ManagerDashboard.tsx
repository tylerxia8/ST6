import { Badge } from "flowbite-react";
import type { ManagerDashboard as Dashboard } from "../domain/types";
import { lifecycleLabels } from "../domain/workflow";

interface ManagerDashboardProps {
  dashboard: Dashboard;
}

export function ManagerDashboard({ dashboard }: ManagerDashboardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" data-testid="manager-dashboard">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Manager Review</h2>
          <p className="text-sm text-slate-600">Team roll-up for week of {dashboard.weekStart}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge color="success">{dashboard.completionRate}% complete</Badge>
          <Badge color="info">{dashboard.alignmentRate}% aligned</Badge>
          <Badge color="warning">{dashboard.reviewTurnaroundHours}h review</Badge>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {dashboard.teamMembers.map((member) => (
          <div
            key={member.id}
            className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.6fr]"
          >
            <div>
              <p className="font-semibold text-ink">{member.name}</p>
              <p className="text-sm text-slate-600">{member.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lifecycle</p>
              <p className="text-sm text-slate-800">{lifecycleLabels[member.lifecycleState]}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hours</p>
              <p className="text-sm text-slate-800">
                {member.actualHours} actual / {member.plannedHours} planned
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alignment</p>
              <p className="text-sm font-semibold text-ink">{member.alignment}%</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
