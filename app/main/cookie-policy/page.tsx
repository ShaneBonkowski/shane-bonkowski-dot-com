import { cookiePolicyData } from "@/data/main/cookie-policy-data";
import PageContentLoader from "@/components/utils/PageContentLoader";

export default function CookiePolicy() {
  return (
    <div>
      <PageContentLoader contentData={cookiePolicyData} />
    </div>
  );
}
