import { privacyPolicyData } from "@/src/data/main/privacy-policy-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function PrivacyPolicy() {
  return (
    <div>
      <PageContentLoader contentData={privacyPolicyData} />
    </div>
  );
}
