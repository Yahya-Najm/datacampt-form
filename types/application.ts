export interface ApplicationFormData {
  // Step 1 — Personal
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  city: string;
  gender: string;
  genderOther: string;
  photoUrl: string;
  idDocumentUrl: string;

  // Step 2 — Situation
  currentSituation: string[];
  situationOther: string;
  situationFileUrls: string[];
  internetType: string;
  internetOther: string;
  devices: string[];
  deviceOther: string;

  // Step 3 — Academic & Work
  jobTitle: string;
  employer: string;
  currentSchool: string;
  academicStage: string;
  financialAssistance: string[];
  financialAssistanceNote: string;
  parentsEducation: string;

  // Step 4 — DataCamp Background
  previousDatacamp: boolean;
  accomplishmentFileUrl: string;
  knowledgeScale: string;
  topicsToLearn: string;
  timeCommitment: string;
  timeCommitmentOther: string;

  // Step 5 — Essays
  goals: string;
  whyDeserveScholarship: string;
  challenge: string;
  anythingElse: string;

  // Step 7 — Code of Conduct
  codeOfConduct: boolean;

  // Step 8 — Commitment
  willingToSurvey: string;
}

export type FormErrors = Partial<Record<keyof ApplicationFormData | "_form", string>>;

export const INITIAL_FORM_DATA: ApplicationFormData = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  country: "",
  city: "",
  gender: "",
  genderOther: "",
  photoUrl: "",
  idDocumentUrl: "",
  currentSituation: [],
  situationOther: "",
  situationFileUrls: [],
  internetType: "",
  internetOther: "",
  devices: [],
  deviceOther: "",
  jobTitle: "",
  employer: "",
  currentSchool: "",
  academicStage: "",
  financialAssistance: [],
  financialAssistanceNote: "",
  parentsEducation: "",
  previousDatacamp: false,
  accomplishmentFileUrl: "",
  knowledgeScale: "",
  topicsToLearn: "",
  timeCommitment: "",
  timeCommitmentOther: "",
  goals: "",
  whyDeserveScholarship: "",
  challenge: "",
  anythingElse: "",
  codeOfConduct: false,
  willingToSurvey: "",
};

export const STEP_TITLES = [
  "Social Links",
  "Personal Info",
  "Your Situation",
  "Academic & Work",
  "DataCamp",
  "Your Story",
  "Code of Conduct",
  "Commitment",
];
