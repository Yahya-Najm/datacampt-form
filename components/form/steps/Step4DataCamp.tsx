"use client";

import { FileUpload } from "@/components/ui/FileUpload";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { ScaleSelector } from "@/components/ui/ScaleSelector";
import { Textarea } from "@/components/ui/Textarea";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: unknown) => void;
  accomplishmentFiles: File[];
  onAccomplishmentFilesChange: (files: File[]) => void;
}

const TIME_OPTIONS = [
  { label: ">5 hours/week", value: ">5 hours/week" },
  { label: "3–5 hours/week", value: "3-5 hours/week" },
  { label: "1–2 hours/week", value: "1-2 hours/week" },
  { label: "<1 hour/week", value: "<1 hour/week" },
];

export function Step4DataCamp({ data, errors, onChange, accomplishmentFiles, onAccomplishmentFilesChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">DataCamp Background</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your data skills and experience with DataCamp.
        </p>
      </div>

      {/* Previous DataCamp */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">
          Have you completed a course or track on DataCamp before?
        </p>
        <div className="flex gap-4">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <span
                role="radio"
                aria-checked={
                  opt === "Yes" ? data.previousDatacamp : !data.previousDatacamp
                }
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === " " || e.key === "Enter") &&
                  onChange("previousDatacamp", opt === "Yes")
                }
                onClick={() => onChange("previousDatacamp", opt === "Yes")}
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${(opt === "Yes" ? data.previousDatacamp : !data.previousDatacamp)
                    ? "border-teal-600"
                    : "border-gray-300 group-hover:border-teal-400"
                  }`}
              >
                {(opt === "Yes" ? data.previousDatacamp : !data.previousDatacamp) && (
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                )}
              </span>
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>

        {data.previousDatacamp && (
          <FileUpload
            label="Upload your Statement(s) of Accomplishment"
            hint="Total limit: 10 MB. Files will be uploaded when you submit."
            accept="image/*,application/pdf"
            maxTotalSizeMB={10}
            files={accomplishmentFiles}
            onFilesChange={onAccomplishmentFilesChange}
          />
        )}
      </div>

      <ScaleSelector
        label="On a scale of 1–5, how much do you know about data science, analysis, engineering, AI, and/or machine learning? (Leave blank if unsure)"
        value={data.knowledgeScale}
        onChange={(v) => onChange("knowledgeScale", v)}
      />

      <Textarea
        label="What are some topics, skills, and technologies you want to learn on DataCamp?"
        placeholder="e.g. Python, machine learning, SQL, data visualization…"
        hint="Browse the full list at datacamp.com/courses-all"
        rows={4}
        value={data.topicsToLearn}
        onChange={(e) => onChange("topicsToLearn", e.target.value)}
      />

      <RadioGroup
        label="How much time will you dedicate to use DataCamp regularly?"
        required
        options={TIME_OPTIONS}
        value={data.timeCommitment}
        onChange={(v) => onChange("timeCommitment", v)}
        error={errors.timeCommitment}
        hasOther
        otherValue={data.timeCommitmentOther}
        onOtherChange={(v) => onChange("timeCommitmentOther", v)}
      />
    </div>
  );
}
