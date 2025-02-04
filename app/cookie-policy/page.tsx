import { cookiePolicyData } from "data/cookie-policy-data";
import ContentLoader from "components/ContentLoader";

const CookiePolicyPage: React.FC = () => {
  return (
    <div>
      <ContentLoader contentData={cookiePolicyData} />
    </div>
  );
};

export default CookiePolicyPage;
