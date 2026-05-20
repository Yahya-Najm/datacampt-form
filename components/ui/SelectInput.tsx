"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: string[];
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, required, placeholder, options, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors appearance-none cursor-pointer
            ${error ? "border-red-400 focus-visible:ring-red-400" : "border-gray-300 focus-visible:ring-teal-600"}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${!props.value ? "text-gray-400" : "text-gray-900"}
            ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-gray-900">
              {opt}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
