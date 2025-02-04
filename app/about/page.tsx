import { aboutData } from "data/about-data";
import ContentLoader from "components/ContentLoader";

const AboutPage: React.FC = () => {
  return (
    <div>
      <ContentLoader contentData={aboutData} />
    </div>
  );
};

export default AboutPage;
