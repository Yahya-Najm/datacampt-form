"use client";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  required,
  hasOther,
  otherValue = "",
  onOtherChange,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-1">
            <span
              role="radio"
              aria-checked={value === opt.value}
              tabIndex={0}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange(opt.value)}
              onClick={() => onChange(opt.value)}
              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                ${value === opt.value
                  ? "border-teal-600"
                  : "border-gray-300 group-hover:border-teal-400"
                }`}
            >
              {value === opt.value && (
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              )}
            </span>
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}

        {hasOther && (
          <div className="flex items-start gap-3">
            <span
              role="radio"
              aria-checked={value === "Other"}
              tabIndex={0}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange("Other")}
              onClick={() => onChange("Other")}
              className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                ${value === "Other"
                  ? "border-teal-600"
                  : "border-gray-300 hover:border-teal-400"
                }`}
            >
              {value === "Other" && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
            </span>
            <div className="flex-1">
              <span className="text-sm text-gray-700">Other:</span>
              {value === "Other" && (
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => onOtherChange?.(e.target.value)}
                  placeholder="Please specify..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
                />
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
