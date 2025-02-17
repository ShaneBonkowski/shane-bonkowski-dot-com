import { privacyPolicyData } from "@/src/data/main/privacy-policy-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function PrivacyPolicy() {
  return (
    <div id="privacy-policy">
      <PageContentLoader contentData={privacyPolicyData} />
    </div>
  );
}
