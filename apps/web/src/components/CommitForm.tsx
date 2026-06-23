import { Plus } from "lucide-react";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CommitCategory, SupportingOutcome } from "../domain/types";

interface CommitFormProps {
  outcomes: SupportingOutcome[];
  onAdd: (commit: {
    title: string;
    description: string;
    supportingOutcomeId: string;
    category: CommitCategory;
    priority: number;
    plannedHours: number;
  }) => void;
  disabled: boolean;
}

const categories: CommitCategory[] = ["Queen", "Rook", "Bishop", "Knight", "Pawn"];

export function CommitForm({ outcomes, onAdd, disabled }: CommitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supportingOutcomeId, setSupportingOutcomeId] = useState(outcomes[0]?.id ?? "");
  const [category, setCategory] = useState<CommitCategory>("Queen");
  const [priority, setPriority] = useState(1);
  const [plannedHours, setPlannedHours] = useState(4);

  useEffect(() => {
    if (!supportingOutcomeId && outcomes[0]) {
      setSupportingOutcomeId(outcomes[0].id);
    }
  }, [outcomes, supportingOutcomeId]);

  const canSubmit = useMemo(
    () => title.trim().length > 2 && supportingOutcomeId.length > 0 && plannedHours > 0,
    [title, supportingOutcomeId, plannedHours]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || disabled) {
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      supportingOutcomeId,
      category,
      priority,
      plannedHours
    });
    setTitle("");
    setDescription("");
    setPriority((current) => current + 1);
    setPlannedHours(4);
  }

  return (
    <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div>
          <Label htmlFor="title" value="Commit" />
          <TextInput
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Describe the weekly commitment"
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="outcome" value="Supporting Outcome" />
          <Select
            id="outcome"
            value={supportingOutcomeId}
            onChange={(event) => setSupportingOutcomeId(event.target.value)}
            disabled={disabled}
          >
            {outcomes.map((outcome) => (
              <option key={outcome.id} value={outcome.id}>
                {outcome.outcome}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description" value="Context" />
        <Textarea
          id="description"
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Scope, decision needed, or dependency"
          disabled={disabled}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="category" value="Chess Layer" />
          <Select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as CommitCategory)}
            disabled={disabled}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="priority" value="Priority" />
          <TextInput
            id="priority"
            type="number"
            min={1}
            value={priority}
            onChange={(event) => setPriority(Number(event.target.value))}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="hours" value="Planned Hours" />
          <TextInput
            id="hours"
            type="number"
            min={1}
            value={plannedHours}
            onChange={(event) => setPlannedHours(Number(event.target.value))}
            disabled={disabled}
          />
        </div>
      </div>
      <Button type="submit" color="dark" disabled={!canSubmit || disabled} className="w-full sm:w-fit">
        <Plus className="mr-2 h-4 w-4" />
        Add commit
      </Button>
    </form>
  );
}
