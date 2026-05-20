"use client";

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
  exclusiveValue?: string; // selecting this deselects all others
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  error,
  required,
  exclusiveValue,
  hasOther,
  otherValue = "",
  onOtherChange,
}: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (exclusiveValue && opt === exclusiveValue) {
      onChange([opt]);
      return;
    }
    if (exclusiveValue && value.includes(exclusiveValue)) {
      onChange([opt]);
      return;
    }
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

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
          <label
            key={opt.value}
            className="flex items-start gap-3 cursor-pointer group py-1"
          >
            <span
              role="checkbox"
              aria-checked={value.includes(opt.value)}
              tabIndex={0}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle(opt.value)}
              onClick={() => toggle(opt.value)}
              className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all
                ${value.includes(opt.value)
                  ? "bg-teal-600 border-teal-600"
                  : "bg-white border-gray-300 group-hover:border-teal-400"
                }`}
            >
              {value.includes(opt.value) && (
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-sm text-gray-700 leading-5">{opt.label}</span>
          </label>
        ))}

        {hasOther && (
          <div className="flex items-start gap-3">
            <span
              role="checkbox"
              aria-checked={value.includes("Other")}
              tabIndex={0}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle("Other")}
              onClick={() => toggle("Other")}
              className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer
                ${value.includes("Other")
                  ? "bg-teal-600 border-teal-600"
                  : "bg-white border-gray-300 hover:border-teal-400"
                }`}
            >
              {value.includes("Other") && (
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="flex-1">
              <span className="text-sm text-gray-700">Other:</span>
              {value.includes("Other") && (
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
