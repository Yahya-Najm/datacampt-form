"use client";

import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { COUNTRIES } from "@/data/countries";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: string) => void;
}

const GENDER_OPTIONS = [
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
];

export function Step1Personal({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">Tell us a bit about yourself.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            required
            placeholder="Your full name"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Email Address"
            required
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <Input
          label="Date of Birth"
          required
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onChange("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
        />

        <SelectInput
          label="Country of Residence"
          required
          placeholder="Select country…"
          options={COUNTRIES}
          value={data.country}
          onChange={(e) => onChange("country", e.target.value)}
          error={errors.country}
        />

        <Input
          label="City of Residence"
          required
          placeholder="Your city"
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          error={errors.city}
        />

        <div />

        <div className="md:col-span-2">
          <RadioGroup
            label="Gender"
            required
            options={GENDER_OPTIONS}
            value={data.gender}
            onChange={(v) => onChange("gender", v)}
            error={errors.gender}
            hasOther
            otherValue={data.genderOther}
            onOtherChange={(v) => onChange("genderOther", v)}
          />
        </div>
      </div>
    </div>
  );
}
