import { privacyPolicyData } from "@/src/data/main/privacy-policy-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function PrivacyPolicy() {
  return <PageContentLoader contentData={privacyPolicyData} />;
}
