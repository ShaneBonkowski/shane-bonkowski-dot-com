import { cookiePolicyData } from "@/src/data/main/cookie-policy-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function CookiePolicy() {
  return (
    <div>
      <PageContentLoader contentData={cookiePolicyData} />
    </div>
  );
}
