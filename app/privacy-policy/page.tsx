import { privacyPolicyData } from "@/data/privacy-policy-data";
import PageContentLoader from "@/components/PageContentLoader";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageContentLoader contentData={privacyPolicyData} />
    </div>
  );
}
