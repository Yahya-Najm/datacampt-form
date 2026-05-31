"use client";

import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: boolean) => void;
}

const CONDUCT_RULES = [
  "All written responses are my own original work and reflect my genuine thoughts and experiences.",
  "I have not used any AI tools, software, or services (including ChatGPT, Gemini, Copilot, or similar) to generate, rephrase, or enhance any part of my application.",
  "All documents, credentials, and information I provide are authentic and truthful.",
  "I understand that FOROZ reserves the right to verify any information I submit at any time.",
  "I accept that any violation of this Code of Conduct will result in a permanent ban from all FOROZ programs.",
];

export function Step7CodeOfConduct({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Code of Conduct</h2>
        <p className="mt-1 text-sm text-gray-500">Please read carefully before submitting.</p>
      </div>

      {/* Warning banner */}
      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <h3 className="text-base font-bold text-red-800 mb-1">
              Strict Academic Integrity Policy — Permanent Ban Warning
            </h3>
            <p className="text-sm text-red-700 leading-relaxed mb-3">
              The use of Artificial Intelligence (AI) tools to generate or assist in writing any part
              of this application is strictly forbidden. Any form of document forgery, identity fraud,
              or misrepresentation of credentials is a serious violation.
            </p>
            <div className="rounded-lg bg-red-100 border border-red-300 px-4 py-3">
              <p className="text-sm font-semibold text-red-900">
                Consequence: Detection of AI-generated content or forgery will result in an{" "}
                <span className="uppercase tracking-wide">immediate and permanent ban</span> from all
                current and future FOROZ programs and DataCamp scholarship applications — with no
                possibility of appeal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">By continuing, you agree that:</p>
        <ul className="space-y-3">
          {CONDUCT_RULES.map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Acknowledgment checkbox */}
      <div className={`rounded-xl border-2 p-5 ${errors.codeOfConduct ? "border-red-300 bg-red-50" : "border-orange-200 bg-orange-50"}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.codeOfConduct}
            onChange={(e) => onChange("codeOfConduct", e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-orange-400 text-red-600 focus:ring-red-500"
          />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold text-gray-900">
              I have read and fully understand the Code of Conduct above. *
            </p>
            <p className="text-gray-600 mt-1">
              I acknowledge that submitting AI-generated content or forged documents will result in a{" "}
              <strong>permanent ban</strong> from all FOROZ programs and applications.
            </p>
          </div>
        </label>
        {errors.codeOfConduct && (
          <p className="mt-3 text-xs text-red-600 font-medium">{errors.codeOfConduct}</p>
        )}
      </div>
    </div>
  );
}
