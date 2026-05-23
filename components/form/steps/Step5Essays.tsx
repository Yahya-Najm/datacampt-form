"use client";

import { Textarea } from "@/components/ui/Textarea";
import { ApplicationFormData, FormErrors } from "@/types/application";

interface Props {
  data: ApplicationFormData;
  errors: FormErrors;
  onChange: (field: keyof ApplicationFormData, value: string) => void;
}

export function Step5Essays({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Your Story</h2>
        <p className="mt-1 text-sm text-gray-500">
          These essays help us understand your goals and motivations.
        </p>
      </div>

      <Textarea
        label="The free DataCamp Donates scholarship lasts 6–12 months. What personal and professional goals do you hope to achieve by the end of this year? How will free access to DataCamp help you accomplish them?"
        required
        rows={6}
        maxWords={250}
        placeholder="Share your goals and how DataCamp will help you achieve them…"
        value={data.goals}
        onChange={(e) => onChange("goals", e.target.value)}
        error={errors.goals}
      />

      <Textarea
        label="Why are you the right person to receive this scholarship?"
        required
        rows={6}
        maxWords={250}
        placeholder="Explain why you deserve this scholarship…"
        value={data.whyDeserveScholarship}
        onChange={(e) => onChange("whyDeserveScholarship", e.target.value)}
        error={errors.whyDeserveScholarship}
      />

      <Textarea
        label="Please describe a personal or professional challenge you have faced and how you overcame it."
        required
        rows={6}
        maxWords={250}
        placeholder="Describe a challenge and how you overcame it…"
        value={data.challenge}
        onChange={(e) => onChange("challenge", e.target.value)}
        error={errors.challenge}
      />

      <Textarea
        label="Is there anything else we should know about you?"
        rows={4}
        maxWords={250}
        placeholder="Optional — anything else you'd like to share…"
        value={data.anythingElse}
        onChange={(e) => onChange("anythingElse", e.target.value)}
      />
    </div>
  );
}
