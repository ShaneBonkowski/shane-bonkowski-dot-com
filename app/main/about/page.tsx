import { aboutData } from "@/src/data/main/about-data";
import PageContentLoader from "@/src/components/PageContentLoader";

export default function About() {
  return (
    <div id="about">
      <PageContentLoader contentData={aboutData} />
    </div>
  );
}
