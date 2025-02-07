import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theStarData } from "@/data/writing/the-star-data";

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
  return <StoryContentLoader {...theStarData} />;
}
