import { PLATFORMS } from "@/components/dashboard/SocialLinksManager";

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

interface Props {
  socialLinks: SocialLink[];
}

export function Step0Social({ socialLinks }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900 mb-1">Connect With Us</h2>
        <p className="text-sm text-gray-500">
          Follow our channels to stay updated with scholarship announcements and connect with the community.
        </p>
      </div>

      {socialLinks.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-8 text-center text-sm text-gray-400">
          No social links configured yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {socialLinks.map((link) => {
            const platform = PLATFORMS.find((p) => p.value === link.platform);
            const color = platform?.color ?? "#6B7280";
            const platformLabel = platform?.label ?? link.platform;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <span
                  className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 text-sm"
                  style={{ background: color, width: 40, height: 40 }}
                >
                  {platformLabel[0].toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                <svg
                  className="h-4 w-4 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-xs text-gray-400">
        Click the links to follow us, then click <strong>Next</strong> to continue your application.
      </p>
    </div>
  );
}
