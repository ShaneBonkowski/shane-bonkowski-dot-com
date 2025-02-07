import { privacyPolicyData } from "@/data/main/privacy-policy-data";
import PageContentLoader from "@/components/utils/PageContentLoader";

export default function PrivacyPolicy() {
  return (
    <div>
      <PageContentLoader contentData={privacyPolicyData} />
    </div>
  );
}
