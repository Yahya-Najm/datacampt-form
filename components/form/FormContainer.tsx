"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./ProgressBar";
import { Step0Social } from "./steps/Step0Social";
import { Step1Personal } from "./steps/Step1Personal";
import { Step2Situation } from "./steps/Step2Situation";
import { Step3Academic } from "./steps/Step3Academic";
import { Step4DataCamp } from "./steps/Step4DataCamp";
import { Step5Essays } from "./steps/Step5Essays";
import { Step6Commitment } from "./steps/Step6Commitment";
import { Step7CodeOfConduct } from "./steps/Step7CodeOfConduct";
import { Button } from "@/components/ui/Button";
import { submitApplication } from "@/actions/application";
import { uploadToR2 } from "@/lib/upload-client";
import { INITIAL_FORM_DATA, ApplicationFormData, FormErrors } from "@/types/application";

const TOTAL_STEPS = 8;

function validateStep(step: number, data: ApplicationFormData): FormErrors {
  const errs: FormErrors = {};

  // step 1 = Social Links — no validation required

  if (step === 2) {
    if (!data.name.trim()) errs.name = "Full name is required.";
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!data.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s\-().]{7,20}$/.test(data.phone.trim())) {
      errs.phone = "Please enter a valid phone number.";
    }
    if (!data.dateOfBirth) errs.dateOfBirth = "Date of birth is required.";
    if (!data.country) errs.country = "Country is required.";
    if (!data.city.trim()) errs.city = "City is required.";
    if (!data.gender) errs.gender = "Please select your gender.";
    if (data.gender === "Other" && !data.genderOther.trim())
      errs.gender = "Please specify your gender.";
    if (!data.photoUrl) errs.photoUrl = "Please upload your photo.";
    if (!data.idDocumentUrl) errs.idDocumentUrl = "Please upload your ID card or passport.";
  }

  if (step === 3) {
    if (data.currentSituation.length === 0)
      errs.currentSituation = "Please select at least one option.";
    if (!data.internetType) errs.internetType = "Please select your internet type.";
    if (data.internetType === "Other" && !data.internetOther.trim())
      errs.internetType = "Please specify your internet type.";
    if (data.devices.length === 0)
      errs.devices = "Please select at least one device.";
  }

  if (step === 4) {
    if (!data.currentSchool.trim()) errs.currentSchool = "School name is required.";
    if (!data.academicStage) errs.academicStage = "Please select your academic stage.";
  }

  if (step === 5) {
    if (!data.timeCommitment) errs.timeCommitment = "Please select your time commitment.";
    if (data.timeCommitment === "Other" && !data.timeCommitmentOther.trim())
      errs.timeCommitment = "Please specify your time commitment.";
  }

  if (step === 6) {
    const wc = (s: string) => (s.trim() === "" ? 0 : s.trim().split(/\s+/).length);
    if (!data.goals.trim()) errs.goals = "Please share your goals.";
    else if (wc(data.goals) > 250) errs.goals = "Please keep your answer to 250 words or fewer.";
    if (!data.whyDeserveScholarship.trim()) errs.whyDeserveScholarship = "This field is required.";
    else if (wc(data.whyDeserveScholarship) > 250) errs.whyDeserveScholarship = "Please keep your answer to 250 words or fewer.";
    if (!data.challenge.trim()) errs.challenge = "Please describe a challenge you faced.";
    else if (wc(data.challenge) > 250) errs.challenge = "Please keep your answer to 250 words or fewer.";
    if (data.anythingElse && wc(data.anythingElse) > 250) errs.anythingElse = "Please keep your answer to 250 words or fewer.";
  }

  if (step === 7) {
    if (!data.codeOfConduct)
      errs.codeOfConduct = "You must acknowledge the Code of Conduct to continue.";
  }

  if (step === 8) {
    if (!data.willingToSurvey)
      errs.willingToSurvey = "Please answer this question.";
  }

  return errs;
}

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export function FormContainer({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
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
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [idDocumentFiles, setIdDocumentFiles] = useState<File[]>([]);

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

  // Mirror file selections into formData so validateStep can check them
  useEffect(() => {
    setFormData((prev) => ({ ...prev, photoUrl: photoFiles.length > 0 ? "pending" : "" }));
  }, [photoFiles]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, idDocumentUrl: idDocumentFiles.length > 0 ? "pending" : "" }));
  }, [idDocumentFiles]);

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
      const [situationUrls, accomplishmentUrl, photoUrl, idDocumentUrl] = await Promise.all([
        Promise.all(situationFiles.map((f) => uploadToR2(f, "documents"))),
        accomplishmentFiles[0] ? uploadToR2(accomplishmentFiles[0], "pdfs") : Promise.resolve(""),
        photoFiles[0] ? uploadToR2(photoFiles[0], "photos") : Promise.resolve(""),
        idDocumentFiles[0] ? uploadToR2(idDocumentFiles[0], "documents") : Promise.resolve(""),
      ]);

      const result = await submitApplication({
        ...formData,
        situationFileUrls: situationUrls,
        accomplishmentFileUrl: accomplishmentUrl,
        photoUrl,
        idDocumentUrl,
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
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">Technical support</p>
            <div className="flex flex-wrap justify-center gap-2">
            <a
              href="https://wa.me/93706755741"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:najm@foroz.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-colors"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              najm@foroz.com
            </a>
            <a
              href="mailto:yahyasafdari0@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-colors"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              DM yahyasafdari0@gmail.com
            </a>
            </div>
          </div>
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

            {/* AI Warning */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-left mb-6">
              <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">Do not use AI to fill out this form</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  All answers, especially essays, must be written entirely in your own words. Applications detected as AI-generated (ChatGPT, Copilot, etc.) will be automatically disqualified.
                </p>
              </div>
            </div>

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

          {/* Persistent AI warning — shown on all steps */}
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 mb-6">
            <svg className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">AI-free zone:</span> Write all answers yourself. AI-generated content (ChatGPT, Copilot, etc.) will disqualify your application.
            </p>
          </div>

          {currentStep === 1 && <Step0Social socialLinks={socialLinks} />}
          {currentStep === 2 && (
            <Step1Personal
              {...stepProps}
              photoFiles={photoFiles}
              onPhotoFilesChange={setPhotoFiles}
              idDocumentFiles={idDocumentFiles}
              onIdDocumentFilesChange={setIdDocumentFiles}
            />
          )}
          {currentStep === 3 && (
            <Step2Situation
              {...stepProps}
              situationFiles={situationFiles}
              onSituationFilesChange={setSituationFiles}
            />
          )}
          {currentStep === 4 && <Step3Academic {...stepProps} />}
          {currentStep === 5 && (
            <Step4DataCamp
              {...stepProps}
              accomplishmentFiles={accomplishmentFiles}
              onAccomplishmentFilesChange={setAccomplishmentFiles}
            />
          )}
          {currentStep === 6 && <Step5Essays {...stepProps} />}
          {currentStep === 7 && (
            <Step7CodeOfConduct
              data={formData}
              errors={errors}
              onChange={(field, value) => updateField(field, value)}
            />
          )}
          {currentStep === 8 && <Step6Commitment {...stepProps} />}

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

