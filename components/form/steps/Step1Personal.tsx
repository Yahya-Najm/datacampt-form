"use client";

import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { FileUpload } from "@/components/ui/FileUpload";
import { COUNTRIES } from "@/data/countries";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: string) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  idDocumentFiles: File[];
  onIdDocumentFilesChange: (files: File[]) => void;
}

const GENDER_OPTIONS = [
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
];

export function Step1Personal({
  data,
  errors,
  onChange,
  photoFiles,
  onPhotoFilesChange,
  idDocumentFiles,
  onIdDocumentFilesChange,
}: Props) {
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

        <div className="md:col-span-2">
          <Input
            label="Phone Number"
            required
            type="tel"
            placeholder="+1 234 567 8900"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            error={errors.phone}
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

        <div className="md:col-span-2">
          <FileUpload
            label="Your Photo"
            required
            accept="image/*"
            maxTotalSizeMB={5}
            files={photoFiles}
            onFilesChange={(files) => onPhotoFilesChange(files.slice(0, 1))}
            error={errors.photoUrl}
            hint="Upload a clear, recent photo of yourself (JPG, PNG — max 5 MB)."
          />
        </div>

        <div className="md:col-span-2">
          <FileUpload
            label="Identity Card or Passport"
            required
            accept="image/*,application/pdf"
            maxTotalSizeMB={10}
            files={idDocumentFiles}
            onFilesChange={(files) => onIdDocumentFilesChange(files.slice(0, 1))}
            error={errors.idDocumentUrl}
            hint="Upload a scan or photo of your national ID card or passport (JPG, PNG, PDF — max 10 MB)."
          />
        </div>
      </div>
    </div>
  );
}
