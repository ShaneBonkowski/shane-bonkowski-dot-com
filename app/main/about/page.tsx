import { aboutData } from "@/src/data/main/about-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function About() {
  return (
    <div>
      <PageContentLoader contentData={aboutData} />
    </div>
  );
}
