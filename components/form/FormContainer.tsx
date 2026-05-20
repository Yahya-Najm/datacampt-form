"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./ProgressBar";
import { Step1Personal } from "./steps/Step1Personal";
import { Step2Situation } from "./steps/Step2Situation";
import { Step3Academic } from "./steps/Step3Academic";
import { Step4DataCamp } from "./steps/Step4DataCamp";
import { Step5Essays } from "./steps/Step5Essays";
import { Step6Commitment } from "./steps/Step6Commitment";
import { Button } from "@/components/ui/Button";
import { submitApplication } from "@/actions/application";
import { uploadToR2 } from "@/lib/upload-client";
import { INITIAL_FORM_DATA, ApplicationFormData, FormErrors } from "@/types/application";

const TOTAL_STEPS = 6;

function validateStep(step: number, data: ApplicationFormData): FormErrors {
  const errs: FormErrors = {};

  if (step === 1) {
    if (!data.name.trim()) errs.name = "Full name is required.";
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!data.dateOfBirth) errs.dateOfBirth = "Date of birth is required.";
    if (!data.country) errs.country = "Country is required.";
    if (!data.city.trim()) errs.city = "City is required.";
    if (!data.gender) errs.gender = "Please select your gender.";
    if (data.gender === "Other" && !data.genderOther.trim())
      errs.gender = "Please specify your gender.";
  }

  if (step === 2) {
    if (data.currentSituation.length === 0)
      errs.currentSituation = "Please select at least one option.";
    if (!data.internetType) errs.internetType = "Please select your internet type.";
    if (data.internetType === "Other" && !data.internetOther.trim())
      errs.internetType = "Please specify your internet type.";
    if (data.devices.length === 0)
      errs.devices = "Please select at least one device.";
  }

  if (step === 3) {
    if (!data.currentSchool.trim()) errs.currentSchool = "School name is required.";
    if (!data.academicStage) errs.academicStage = "Please select your academic stage.";
  }

  if (step === 4) {
    if (!data.timeCommitment) errs.timeCommitment = "Please select your time commitment.";
    if (data.timeCommitment === "Other" && !data.timeCommitmentOther.trim())
      errs.timeCommitment = "Please specify your time commitment.";
  }

  if (step === 5) {
    if (!data.goals.trim()) errs.goals = "Please share your goals.";
    if (!data.whyDeserveScholarship.trim())
      errs.whyDeserveScholarship = "This field is required.";
    if (!data.challenge.trim()) errs.challenge = "Please describe a challenge you faced.";
  }

  if (step === 6) {
    if (!data.willingToSurvey)
      errs.willingToSurvey = "Please answer this question.";
  }

  return errs;
}

export function FormContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Files held locally until submit — never uploaded until the user submits
  const [situationFiles, setSituationFiles] = useState<File[]>([]);
  const [accomplishmentFiles, setAccomplishmentFiles] = useState<File[]>([]);

  const formCardRef = useRef<HTMLDivElement>(null);

  // Hide the Start button automatically when the form card enters the viewport
  useEffect(() => {
    const el = formCardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToForm = useCallback(() => {
    setHasStarted(true);
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const updateField = (field: keyof ApplicationFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    setErrors({});
    goToStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Upload files to R2 only at submission time
      const [situationUrls, accomplishmentUrl] = await Promise.all([
        Promise.all(situationFiles.map((f) => uploadToR2(f, "documents"))),
        accomplishmentFiles[0] ? uploadToR2(accomplishmentFiles[0], "pdfs") : Promise.resolve(""),
      ]);

      const result = await submitApplication({
        ...formData,
        situationFileUrls: situationUrls,
        accomplishmentFileUrl: accomplishmentUrl,
      });

      if (result.success) {
        router.push("/apply/success");
      } else {
        setSubmitError(result.error ?? "Something went wrong.");
        setIsSubmitting(false);
      }
    } catch {
      setSubmitError("File upload failed. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  const stepProps = { data: formData, errors, onChange: updateField };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/foroz-logo.svg" alt="FOROZ" className="h-7 md:h-9 w-auto" />
            <span className="text-gray-300 text-xl font-light">×</span>
            <img src="/datacampt.png" alt="DataCamp" className="h-7 md:h-9 w-auto" />
          </div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">
            Scholarship Application
          </h1>
          <p className="hidden sm:block mt-1.5 text-sm text-gray-500 max-w-lg mx-auto">
            Apply for free access to 440+ DataCamp courses — a $399+ USD value.
          </p>
        </div>
      </div>

      {/* Progress bar — sticky, scrollable on mobile */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      </div>

      {/* Intro / Start section — collapses once form is in view */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          hasStarted ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[600px] opacity-100"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-700 mb-5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Free Scholarship — $399+ USD value
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
              Ready to start your application?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
              Complete 6 short steps to apply for free access to 440+ DataCamp courses in
              Data Science, AI, Python, SQL, and more. Takes about 10–15 minutes.
            </p>

            {/* What you get */}
            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              {[
                { num: "440+", label: "Courses" },
                { num: "6–12", label: "Months free" },
                { num: "10 min", label: "To apply" },
              ].map(({ num, label }) => (
                <div key={label} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-3">
                  <p className="text-lg font-black text-teal-600">{num}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-teal-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Start Application
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Fields marked <span className="text-red-400">*</span> are required
            </p>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 md:py-10">
        <div ref={formCardRef} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 md:p-10" style={{ boxShadow: "0 4px 32px 0 rgba(3, 239, 98, 0.07), 0 1px 4px 0 rgba(0,0,0,0.06)" }}>

          {currentStep === 1 && <Step1Personal {...stepProps} />}
          {currentStep === 2 && (
            <Step2Situation
              {...stepProps}
              situationFiles={situationFiles}
              onSituationFilesChange={setSituationFiles}
            />
          )}
          {currentStep === 3 && <Step3Academic {...stepProps} />}
          {currentStep === 4 && (
            <Step4DataCamp
              {...stepProps}
              accomplishmentFiles={accomplishmentFiles}
              onAccomplishmentFilesChange={setAccomplishmentFiles}
            />
          )}
          {currentStep === 5 && <Step5Essays {...stepProps} />}
          {currentStep === 6 && <Step6Commitment {...stepProps} />}

          {submitError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              ← Back
            </Button>

            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              {currentStep} / {TOTAL_STEPS}
            </span>

            {currentStep < TOTAL_STEPS ? (
              <Button variant="teal" size="sm" onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <Button variant="teal" size="sm" onClick={handleSubmit} loading={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit"}
              </Button>
            )}
          </div>
        </div>

        {/* Discreet admin link — not advertised to applicants */}
        <div className="mt-6 text-center">
          <a
            href="/dashboard"
            className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}

