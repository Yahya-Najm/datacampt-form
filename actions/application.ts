"use server";

import { prisma } from "@/lib/prisma";
import { ApplicationFormData } from "@/types/application";
import { headers } from "next/headers";

export async function submitApplication(
  data: ApplicationFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existing = await prisma.application.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: "An application with this email address has already been submitted.",
      };
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    const gender =
      data.gender === "Other" && data.genderOther
        ? `Other: ${data.genderOther}`
        : data.gender;

    const internetType =
      data.internetType === "Other" && data.internetOther
        ? `Other: ${data.internetOther}`
        : data.internetType;

    const timeCommitment =
      data.timeCommitment === "Other" && data.timeCommitmentOther
        ? `Other: ${data.timeCommitmentOther}`
        : data.timeCommitment;

    await prisma.application.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || null,
        dateOfBirth: new Date(data.dateOfBirth),
        country: data.country,
        city: data.city.trim(),
        gender,
        photoUrl: data.photoUrl || null,
        idDocumentUrl: data.idDocumentUrl || null,
        currentSituation: data.currentSituation,
        situationOther: data.situationOther?.trim() || null,
        situationFileUrls: data.situationFileUrls,
        internetType,
        internetOther: data.internetOther?.trim() || null,
        devices: data.devices,
        deviceOther: data.deviceOther?.trim() || null,
        jobTitle: data.jobTitle?.trim() || null,
        employer: data.employer?.trim() || null,
        currentSchool: data.currentSchool.trim(),
        academicStage: data.academicStage,
        financialAssistance: data.financialAssistance,
        financialAssistanceNote: data.financialAssistanceNote?.trim() || null,
        parentsEducation: data.parentsEducation || null,
        previousDatacamp: data.previousDatacamp,
        accomplishmentFileUrl: data.accomplishmentFileUrl || null,
        knowledgeScale: data.knowledgeScale ? parseInt(data.knowledgeScale) : null,
        topicsToLearn: data.topicsToLearn?.trim() || null,
        timeCommitment,
        timeCommitmentOther: data.timeCommitmentOther?.trim() || null,
        goals: data.goals.trim(),
        whyDeserveScholarship: data.whyDeserveScholarship.trim(),
        challenge: data.challenge.trim(),
        anythingElse: data.anythingElse?.trim() || null,
        willingToSurvey: data.willingToSurvey,
        ipAddress: ip,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Application submission error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
