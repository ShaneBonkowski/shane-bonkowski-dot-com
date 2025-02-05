import { aboutData } from "@/data/about-data";
import PageContentLoader from "@/components/PageContentLoader";

const AboutPage: React.FC = () => {
  return (
    <div>
      <PageContentLoader contentData={aboutData} />
    </div>
  );
};

export default AboutPage;
