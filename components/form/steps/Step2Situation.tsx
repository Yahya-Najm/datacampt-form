"use client";

import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { FileUpload } from "@/components/ui/FileUpload";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: unknown) => void;
  situationFiles: File[];
  onSituationFilesChange: (files: File[]) => void;
}

const SITUATION_OPTIONS = [
  { label: "Unemployed", value: "Unemployed" },
  { label: "Underemployed (wage too low, not enough hours, etc.)", value: "Underemployed" },
  { label: "Living below the national poverty line", value: "Living below the national poverty line" },
  { label: "Refugee of war and/or environmental disaster", value: "Refugee" },
  {
    label: "Person with disability or a member of a historically disadvantaged community",
    value: "Person with disability or disadvantaged community",
  },
  { label: "Student aged 16–26", value: "Student aged 16-26" },
  {
    label: "Nonprofit research scientist working with environmental and health data",
    value: "Nonprofit research scientist",
  },
  { label: "None of the above", value: "None of the above" },
];

const INTERNET_OPTIONS = [
  { label: "My own Internet", value: "My own Internet" },
  { label: "Public/school Wi-Fi", value: "Public/school Wi-Fi" },
  { label: "A friend's wifi", value: "A friend's wifi" },
  { label: "Mobile data", value: "Mobile data" },
  { label: "I'm not sure", value: "I'm not sure" },
];

const DEVICE_OPTIONS = [
  { label: "My own computer", value: "My own computer" },
  { label: "A borrowed/shared computer", value: "A borrowed/shared computer" },
  { label: "My own mobile iOS/Android device", value: "My own mobile device" },
];

export function Step2Situation({ data, errors, onChange, situationFiles, onSituationFilesChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Your Situation</h2>
        <p className="mt-1 text-sm text-gray-500">Help us understand your current circumstances.</p>
      </div>

      <CheckboxGroup
        label="How would you describe your current situation? Please check ALL that apply."
        required
        options={SITUATION_OPTIONS}
        value={data.currentSituation}
        onChange={(v) => onChange("currentSituation", v)}
        error={errors.currentSituation}
        exclusiveValue="None of the above"
        hasOther
        otherValue={data.situationOther}
        onOtherChange={(v) => onChange("situationOther", v)}
      />

      <FileUpload
        label="Supporting documents for your situation above (optional)"
        hint="Upload any documents that support your selected status(es). Total limit: 10 MB. Files will be uploaded when you submit."
        accept="image/*,application/pdf,.doc,.docx"
        maxTotalSizeMB={10}
        files={situationFiles}
        onFilesChange={onSituationFilesChange}
      />

      <RadioGroup
        label="What type of Internet will you use to access DataCamp?"
        required
        options={INTERNET_OPTIONS}
        value={data.internetType}
        onChange={(v) => onChange("internetType", v)}
        error={errors.internetType}
        hasOther
        otherValue={data.internetOther}
        onOtherChange={(v) => onChange("internetOther", v)}
      />

      <CheckboxGroup
        label="On what device(s) will you use DataCamp?"
        required
        options={DEVICE_OPTIONS}
        value={data.devices}
        onChange={(v) => onChange("devices", v)}
        error={errors.devices}
        hasOther
        otherValue={data.deviceOther}
        onOtherChange={(v) => onChange("deviceOther", v)}
      />
    </div>
  );
}
