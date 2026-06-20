"use client";

const STEPS = [
  { number: 1, label: "ACCEPTANCE" },
  { number: 2, label: "REGISTRATION" },
  { number: 3, label: "ANALYSIS" },
];

export function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center gap-2">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 shrink-0 ${
                  isCompleted
                    ? "bg-cyan-500"
                    : isActive
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-neutral-700"
                }`}
              />
              <span
                className={`font-orbitron text-[8px] tracking-widest uppercase whitespace-nowrap ${
                  isCompleted || isActive
                    ? "text-cyan-400"
                    : "text-neutral-700"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 h-px shrink-0 ${
                  step.number < currentStep
                    ? "bg-cyan-500/40"
                    : "bg-neutral-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
