import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { lifecycleLabels, lifecycleOrder } from "../domain/workflow";
import type { LifecycleState } from "../domain/types";

interface LifecycleRailProps {
  state: LifecycleState;
}

export function LifecycleRail({ state }: LifecycleRailProps) {
  const activeIndex = lifecycleOrder.indexOf(state);

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {lifecycleOrder.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;
        const Icon = isComplete ? CheckCircle2 : isActive ? CircleDot : Circle;

        return (
          <div
            key={step}
            className={[
              "flex min-h-16 items-center gap-3 rounded-md border px-4 py-3",
              isActive
                ? "border-moss bg-emerald-50 text-moss"
                : isComplete
                  ? "border-slate-300 bg-white text-slate-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
            ].join(" ")}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">{lifecycleLabels[step]}</span>
          </div>
        );
      })}
    </div>
  );
}
