import { aboutData } from "@/data/about-data";
import PageContentLoader from "@/components/PageContentLoader";

export default function AboutPage() {
  return (
    <div>
      <PageContentLoader contentData={aboutData} />
    </div>
  );
}
