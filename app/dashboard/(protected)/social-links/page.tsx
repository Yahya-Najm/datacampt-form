import { requireSession } from "@/lib/session";
import { getAllSocialLinks, addSocialLink, deleteSocialLink, updateSocialLink } from "@/actions/socialLinks";
import { SocialLinksManager } from "@/components/dashboard/SocialLinksManager";

export default async function SocialLinksPage() {
  await requireSession();
  const links = await getAllSocialLinks();
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Social Media Links</h1>
        <p className="text-sm text-gray-500 mt-1">
          These links appear on the first step of the application form.
        </p>
      </div>
      <SocialLinksManager
        links={links}
        onAdd={addSocialLink}
        onDelete={deleteSocialLink}
        onUpdate={updateSocialLink}
      />
    </div>
  );
}
