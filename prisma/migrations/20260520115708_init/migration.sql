-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "currentSituation" TEXT[],
    "situationOther" TEXT,
    "situationFileUrls" TEXT[],
    "internetType" TEXT NOT NULL,
    "internetOther" TEXT,
    "devices" TEXT[],
    "deviceOther" TEXT,
    "jobTitle" TEXT,
    "employer" TEXT,
    "currentSchool" TEXT NOT NULL,
    "academicStage" TEXT NOT NULL,
    "financialAssistance" TEXT[],
    "financialAssistanceNote" TEXT,
    "parentsEducation" TEXT,
    "previousDatacamp" BOOLEAN NOT NULL DEFAULT false,
    "accomplishmentFileUrl" TEXT,
    "knowledgeScale" INTEGER,
    "topicsToLearn" TEXT,
    "timeCommitment" TEXT NOT NULL,
    "timeCommitmentOther" TEXT,
    "goals" TEXT NOT NULL,
    "whyDeserveScholarship" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "anythingElse" TEXT,
    "willingToSurvey" TEXT NOT NULL,
    "ipAddress" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_email_key" ON "Application"("email");

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE INDEX "Application_submittedAt_idx" ON "Application"("submittedAt");
