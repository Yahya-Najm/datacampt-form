"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {hint && <p className="text-xs text-gray-500 -mt-1">{hint}</p>}
        <textarea
          ref={ref}
          id={inputId}
          rows={5}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400 resize-y transition-colors
            ${error ? "border-red-400 focus-visible:ring-red-400" : "border-gray-300 focus-visible:ring-teal-600"}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
