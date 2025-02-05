import { privacyPolicyData } from "@/data/privacy-policy-data";
import PageContentLoader from "@/components/PageContentLoader";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <PageContentLoader contentData={privacyPolicyData} />
    </div>
  );
};

export default PrivacyPolicyPage;
