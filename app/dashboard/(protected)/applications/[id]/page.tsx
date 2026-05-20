import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatusActions } from "@/components/dashboard/StatusActions";

interface Props {
  params: Promise<{ id: string }>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <div className="text-sm text-gray-900 leading-relaxed">{value}</div>
    </div>
  );
}

function FullWidthField({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="sm:col-span-2">
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{value}</div>
    </div>
  );
}

function FileLinks({ urls }: { urls: string[] }) {
  if (!urls.length) return <span className="text-gray-400 text-sm">None</span>;
  return (
    <div className="flex flex-col gap-1">
      {urls.map((url, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm underline underline-offset-2 break-all"
        >
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          File {i + 1}
        </a>
      ))}
    </div>
  );
}

export default async function ApplicationDetailPage({ params }: Props) {
  await requireSession();
  const { id } = await params;

  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) notFound();

  const submittedAt = new Date(app.submittedAt).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 transition-colors mb-3"
          >
            ← Back to list
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900">{app.name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{app.email} · Submitted {submittedAt}</p>
        </div>
        <div className="flex-shrink-0">
          <StatusActions id={app.id} currentStatus={app.status} size="md" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col gap-8">
        <Section title="Personal Information">
          <Field label="Full Name" value={app.name} />
          <Field label="Email" value={app.email} />
          <Field label="Date of Birth" value={new Date(app.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
          <Field label="Country" value={app.country} />
          <Field label="City" value={app.city} />
          <Field label="Gender" value={app.gender} />
        </Section>

        <Section title="Current Situation">
          <FullWidthField
            label="Situation"
            value={app.currentSituation.join(", ") + (app.situationOther ? ` — ${app.situationOther}` : "")}
          />
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Supporting Documents</p>
            <FileLinks urls={app.situationFileUrls} />
          </div>
          <Field label="Internet Type" value={app.internetType + (app.internetOther ? ` — ${app.internetOther}` : "")} />
          <Field label="Devices" value={app.devices.join(", ") + (app.deviceOther ? ` — ${app.deviceOther}` : "")} />
        </Section>

        <Section title="Academic & Work">
          <Field label="Job Title" value={app.jobTitle} />
          <Field label="Employer" value={app.employer} />
          <Field label="Current School" value={app.currentSchool} />
          <Field label="Academic Stage" value={app.academicStage} />
          <Field label="Financial Assistance" value={app.financialAssistance.join(", ")} />
          <Field label="Financial Assistance Note" value={app.financialAssistanceNote} />
          <Field label="Parents' Education" value={app.parentsEducation} />
        </Section>

        <Section title="DataCamp Background">
          <Field label="Previous DataCamp" value={app.previousDatacamp ? "Yes" : "No"} />
          {app.accomplishmentFileUrl && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Statement of Accomplishment</p>
              <a href={app.accomplishmentFileUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:text-teal-700 underline underline-offset-2">
                View file ↗
              </a>
            </div>
          )}
          <Field label="Knowledge Scale" value={app.knowledgeScale ? `${app.knowledgeScale} / 5` : null} />
          <Field label="Time Commitment" value={app.timeCommitment} />
          <FullWidthField label="Topics to Learn" value={app.topicsToLearn} />
        </Section>

        <Section title="Essays">
          <FullWidthField label="Goals (6–12 months)" value={app.goals} />
          <FullWidthField label="Why they deserve this scholarship" value={app.whyDeserveScholarship} />
          <FullWidthField label="Challenge overcome" value={app.challenge} />
          <FullWidthField label="Anything else" value={app.anythingElse} />
        </Section>

        <Section title="Commitment & Meta">
          <Field label="Willing to fill survey" value={app.willingToSurvey} />
          <Field label="IP Address" value={app.ipAddress} />
          <Field label="Submitted At" value={submittedAt} />
          <Field label="Application ID" value={<span className="font-mono text-xs text-gray-500">{app.id}</span>} />
        </Section>
      </div>
    </div>
  );
}
