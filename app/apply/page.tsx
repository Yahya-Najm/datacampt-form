import { FormContainer } from "@/components/form/FormContainer";
import { getSocialLinks } from "@/actions/socialLinks";

export default async function ApplyPage() {
  const socialLinks = await getSocialLinks();
  return <FormContainer socialLinks={socialLinks} />;
}
