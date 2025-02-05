import { privacyPolicyData } from "@/data/privacy-policy-data";
import ContentLoader from "@/components/ContentLoader";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <ContentLoader contentData={privacyPolicyData} />
    </div>
  );
};

export default PrivacyPolicyPage;
