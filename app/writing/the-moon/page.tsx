import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theMoonData } from "@/data/writing/the-moon-data";

export const metadata = {
  title: theMoonData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: theMoonData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: theMoonData.imageUrl,
        alt: theMoonData.title,
      },
    ],
  },
};

export default function TheMoon() {
  return <StoryContentLoader {...theMoonData} />;
}
