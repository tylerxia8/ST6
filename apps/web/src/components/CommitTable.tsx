import { Flag, Trash2 } from "lucide-react";
import { Button, Select, TextInput } from "flowbite-react";
import type { CommitStatus, SupportingOutcome, WeeklyCommit } from "../domain/types";

interface CommitTableProps {
  commits: WeeklyCommit[];
  outcomes: SupportingOutcome[];
  editable: boolean;
  onUpdate: (commit: WeeklyCommit) => void;
  onDelete: (commitId: string) => void;
}

const statuses: CommitStatus[] = ["Planned", "In progress", "Done", "Carried forward", "Blocked"];

export function CommitTable({ commits, outcomes, editable, onUpdate, onDelete }: CommitTableProps) {
  const outcomeById = new Map(outcomes.map((outcome) => [outcome.id, outcome]));

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Commit</th>
              <th className="px-4 py-3">RCDO Link</th>
              <th className="px-4 py-3">Layer</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commits.map((commit) => {
              const outcome = outcomeById.get(commit.supportingOutcomeId);

              return (
                <tr key={commit.id} className="align-top">
                  <td className="px-4 py-4 font-semibold text-ink">{commit.priority}</td>
                  <td className="max-w-md px-4 py-4">
                    <p className="font-semibold text-ink">{commit.title}</p>
                    <p className="mt-1 text-slate-600">{commit.description}</p>
                  </td>
                  <td className="min-w-72 px-4 py-4">
                    <div className="flex items-start gap-2">
                      <Flag className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-slate-800">{outcome?.outcome}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {outcome?.rallyCry} / {outcome?.definingObjective}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{commit.category}</td>
                  <td className="min-w-40 px-4 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      <span>{commit.plannedHours}h planned</span>
                      <TextInput
                        aria-label={`Actual hours for ${commit.title}`}
                        sizing="sm"
                        type="number"
                        min={0}
                        value={commit.actualHours}
                        disabled={!editable}
                        onChange={(event) =>
                          onUpdate({ ...commit, actualHours: Number(event.target.value) })
                        }
                      />
                    </div>
                  </td>
                  <td className="min-w-44 px-4 py-4">
                    <Select
                      sizing="sm"
                      value={commit.status}
                      disabled={!editable}
                      onChange={(event) =>
                        onUpdate({ ...commit, status: event.target.value as CommitStatus })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      color="light"
                      size="xs"
                      disabled={!editable}
                      onClick={() => onDelete(commit.id)}
                      title="Delete commit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
