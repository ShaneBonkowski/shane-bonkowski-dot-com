import { cookiePolicyData } from "@/data/cookie-policy-data";
import PageContentLoader from "@/components/PageContentLoader";

export default function CookiePolicyPage() {
  return (
    <div>
      <PageContentLoader contentData={cookiePolicyData} />
    </div>
  );
}
