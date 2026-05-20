"use client";

import { STEP_TITLES } from "@/types/application";

interface ProgressBarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
  totalSteps: number;
}

export function ProgressBar({
  currentStep,
  completedSteps,
  onStepClick,
  totalSteps,
}: ProgressBarProps) {
  return (
    <div className="w-full px-4 py-4 overflow-x-auto">
      {/* Active step label — mobile only, shown above the circles */}
      <p className="sm:hidden text-center text-xs font-bold text-teal-700 uppercase tracking-widest mb-3">
        Step {currentStep} — {STEP_TITLES[currentStep - 1]}
      </p>

      {/* Min-width keeps all circles on one line on small phones */}
      <div className="relative min-w-[320px]">
        {/*
          Line layer: absolutely positioned at top-5 (= half of h-10 circle)
          so lines always pass through the exact center of each circle.
        */}
        <div className="absolute top-5 left-5 right-5 flex pointer-events-none">
          {Array.from({ length: totalSteps - 1 }, (_, i) => {
            const leftStep = i + 1;
            const filled = completedSteps.has(leftStep);
            return (
              <div
                key={i}
                className={`flex-1 h-0.5 transition-colors duration-300 ${
                  filled ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            );
          })}
        </div>

        {/* Circles + labels layer */}
        <div className="relative z-10 flex justify-between items-start">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const isActive = step === currentStep;
            const isCompleted = completedSteps.has(step);
            const isClickable =
              isCompleted || step <= Math.max(...Array.from(completedSteps), 0) + 1;

            return (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  aria-label={`Step ${step}: ${STEP_TITLES[i]}`}
                  aria-current={isActive ? "step" : undefined}
                  className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all font-semibold text-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                    ${
                      isActive
                        ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/30 scale-110"
                        : isCompleted
                        ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                        : isClickable
                        ? "bg-white border-gray-300 text-gray-500 hover:border-teal-400 cursor-pointer"
                        : "bg-white border-gray-200 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  {isCompleted && !isActive ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </button>

                {/* Label — hidden on mobile, shown on sm+ */}
                <span
                  className={`hidden sm:block text-center leading-tight transition-colors max-w-[68px]
                    ${
                      isActive
                        ? "text-teal-700 text-xs font-bold"
                        : isCompleted
                        ? "text-teal-500 text-xs font-medium"
                        : "text-gray-400 text-xs font-medium"
                    }`}
                >
                  {STEP_TITLES[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
