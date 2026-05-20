"use client";

interface ScaleSelectorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  minLabel?: string;
  maxLabel?: string;
  steps?: number;
}

export function ScaleSelector({
  label,
  value,
  onChange,
  error,
  minLabel = "Very little",
  maxLabel = "I am an expert",
  steps = 5,
}: ScaleSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: steps }, (_, i) => {
            const n = String(i + 1);
            const active = value === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(active ? "" : n)}
                className={`h-11 w-11 flex-shrink-0 rounded-full border-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  ${active
                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-500/30"
                    : "bg-white border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600"
                  }`}
                aria-label={`Scale ${n}`}
                aria-pressed={active}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">{minLabel}</span>
          <span className="text-xs text-gray-500">{maxLabel}</span>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
