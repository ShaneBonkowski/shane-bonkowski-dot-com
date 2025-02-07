import { aboutData } from "@/data/main/about-data";
import PageContentLoader from "@/components/utils/PageContentLoader";

export default function About() {
  return (
    <div>
      <PageContentLoader contentData={aboutData} />
    </div>
  );
}
