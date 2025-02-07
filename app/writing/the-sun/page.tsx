import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theSunData } from "@/data/writing/the-sun-data";

export const metadata = {
  title: theSunData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: theSunData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: theSunData.imageUrl,
        alt: theSunData.title,
      },
    ],
  },
};

export default function TheSun() {
  return <StoryContentLoader {...theSunData} />;
}
