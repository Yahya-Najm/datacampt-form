"use client";

import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Textarea } from "@/components/ui/Textarea";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: unknown) => void;
}

const ACADEMIC_STAGES = [
  "High school student",
  "Undergraduate student",
  "Graduate student (Master's)",
  "Doctoral student (PhD)",
  "Recent graduate (within 1 year)",
  "Not currently enrolled",
];

const FINANCIAL_OPTIONS = [
  { label: "Financial aid / need-based scholarship", value: "Financial aid / need-based scholarship" },
  { label: "Merit-based scholarship", value: "Merit-based scholarship" },
  { label: "Federal grant", value: "Federal grant" },
  { label: "Federal student loans", value: "Federal student loans" },
  { label: "None of the above", value: "None of the above" },
];

const EDUCATION_LEVELS = [
  "Post-graduate degree (PhD, etc.)",
  "Graduate degree (MA, MS, etc.)",
  "Bachelor's Degree (BA, BS, BFA, etc.)",
  "Associate's Degree",
  "High School / Secondary School Degree",
  "None of the above",
];

export function Step3Academic({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Academic & Work</h2>
        <p className="mt-1 text-sm text-gray-500">Tell us about your education and employment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Job Title"
          placeholder="e.g. Software Developer (if employed)"
          value={data.jobTitle}
          onChange={(e) => onChange("jobTitle", e.target.value)}
        />

        <Input
          label="Employer"
          placeholder="Company or organization (if employed)"
          value={data.employer}
          onChange={(e) => onChange("employer", e.target.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Current School (or last school attended)"
            required
            placeholder="Name of your school or university"
            value={data.currentSchool}
            onChange={(e) => onChange("currentSchool", e.target.value)}
            error={errors.currentSchool}
          />
        </div>

        <div className="md:col-span-2">
          <SelectInput
            label="Where are you in your academic career?"
            required
            placeholder="Select one…"
            options={ACADEMIC_STAGES}
            value={data.academicStage}
            onChange={(e) => onChange("academicStage", e.target.value)}
            error={errors.academicStage}
          />
        </div>
      </div>

      <CheckboxGroup
        label="Please check off the types of financial assistance you receive."
        options={FINANCIAL_OPTIONS}
        value={data.financialAssistance}
        onChange={(v) => onChange("financialAssistance", v)}
        exclusiveValue="None of the above"
      />

      <Textarea
        label="More info about your financial assistance (optional)"
        placeholder="You may provide additional context here…"
        rows={3}
        value={data.financialAssistanceNote}
        onChange={(e) => onChange("financialAssistanceNote", e.target.value)}
      />

      <SelectInput
        label="What was your parents' highest level of education?"
        placeholder="Select one…"
        options={EDUCATION_LEVELS}
        value={data.parentsEducation}
        onChange={(e) => onChange("parentsEducation", e.target.value)}
      />
    </div>
  );
}
