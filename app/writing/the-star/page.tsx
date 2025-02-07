import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theStarData } from "@/data/writing/the-star-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";

export const metadata = {
  title: theStarData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: theStarData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: theStarData.imageUrl,
        alt: theStarData.title,
      },
    ],
  },
};

export default function TheStar() {
  return (
    <div>
      <ResumeScrollProgress pageName={theStarData.title} threshold={200} />
      <StoryContentLoader {...theStarData} />
    </div>
  );
}
