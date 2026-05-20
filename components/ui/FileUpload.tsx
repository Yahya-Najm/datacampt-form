"use client";

import { useRef, useState } from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxTotalSizeMB?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}

function fmt(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  label,
  accept = "image/*,application/pdf",
  maxTotalSizeMB = 10,
  files,
  onFilesChange,
  error,
  required,
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectError, setSelectError] = useState<string | null>(null);

  const maxBytes = maxTotalSizeMB * 1024 * 1024;
  const usedBytes = files.reduce((s, f) => s + f.size, 0);
  const remainingBytes = maxBytes - usedBytes;
  const pct = Math.min((usedBytes / maxBytes) * 100, 100);
  const isFull = usedBytes >= maxBytes;

  const barColor =
    pct >= 90 ? "bg-red-500" : pct >= 65 ? "bg-amber-400" : "bg-teal-500";
  const textColor =
    pct >= 90 ? "text-red-600" : pct >= 65 ? "text-amber-600" : "text-teal-700";

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setSelectError(null);

    const addedBytes = picked.reduce((s, f) => s + f.size, 0);
    if (usedBytes + addedBytes > maxBytes) {
      if (remainingBytes <= 0) {
        setSelectError(`You've reached the ${maxTotalSizeMB} MB total limit.`);
      } else {
        setSelectError(
          `Selected files total ${fmt(addedBytes)}, but only ${fmt(remainingBytes)} remaining.`
        );
      }
      e.target.value = "";
      return;
    }

    onFilesChange([...files, ...picked]);
    e.target.value = "";
  };

  const remove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setSelectError(null);
  };

  const showBar = files.length > 0;

  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
      )}
      {hint && <p className="text-xs text-gray-500 -mt-1">{hint}</p>}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2"
            >
              <svg
                className="h-4 w-4 flex-shrink-0 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="flex-1 truncate text-sm text-teal-800">{file.name}</span>
              <span className="text-xs text-teal-500 flex-shrink-0">{fmt(file.size)}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex-shrink-0 ml-1 text-teal-400 hover:text-red-500 transition-colors"
                aria-label="Remove file"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cumulative size bar */}
      {showBar && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${textColor}`}>{fmt(usedBytes)} selected</span>
            <span className="text-xs text-gray-400">
              {fmt(remainingBytes)} remaining of {maxTotalSizeMB} MB
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop zone / button */}
      {!isFull && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-6 text-center transition-all hover:border-teal-400 hover:bg-teal-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <svg
            className="h-7 w-7 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <div>
            <span className="text-sm font-medium text-gray-700">Click to add files</span>
            <p className="text-xs text-gray-400 mt-0.5">
              {fmt(remainingBytes)} remaining · files upload on submit
            </p>
          </div>
        </button>
      )}

      {isFull && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Limit reached — remove a file to add more.
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleInput}
      />

      {(error || selectError) && (
        <p className="text-xs text-red-500">{error ?? selectError}</p>
      )}
    </div>
  );
}
