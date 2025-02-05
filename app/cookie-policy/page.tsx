import { cookiePolicyData } from "@/data/cookie-policy-data";
import PageContentLoader from "@/components/PageContentLoader";

const CookiePolicyPage: React.FC = () => {
  return (
    <div>
      <PageContentLoader contentData={cookiePolicyData} />
    </div>
  );
};

export default CookiePolicyPage;
