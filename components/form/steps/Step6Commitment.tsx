"use client";

import { RadioGroup } from "@/components/ui/RadioGroup";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: string) => void;
}

const SURVEY_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "I am not sure", value: "I am not sure" },
];

export function Step6Commitment({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Commitment</h2>
        <p className="mt-1 text-sm text-gray-500">One final question before you submit.</p>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
        <p className="text-sm text-teal-800 leading-relaxed">
          <strong>Please note:</strong> FOROZ reserves the right to revoke your scholarship if it is
          not used for two or more months. After using DataCamp for 6–12 months, we may ask you to
          fill out a short survey about your experience.
        </p>
      </div>

      <RadioGroup
        label="After using DataCamp for 6–12 months, are you willing and able to fill out and submit a survey about your experience?"
        required
        options={SURVEY_OPTIONS}
        value={data.willingToSurvey}
        onChange={(v) => onChange("willingToSurvey", v)}
        error={errors.willingToSurvey}
      />

      {/* Declaration */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600 leading-relaxed">
        By submitting this application, I confirm that all the information I have provided is
        accurate and truthful. I understand that any false or misleading information may result in
        the rejection of my application or revocation of my scholarship.
      </div>
    </div>
  );
}
