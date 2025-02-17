import StoryContentLoader from "@/src/components/StoryContentLoader";
import { theSunData } from "@/src/data/writing/the-sun-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";

const storyData = theSunData;

export const metadata = {
  title: storyData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: storyData.title,
    description: "A short story by Shane Bonkowski.",
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${storyData.imageUrl}`,
        alt: "A short story by Shane Bonkowski.",
      },
    ],
    type: "website",
  },
};

export default function TheSun() {
  return (
    <div>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData} />
    </div>
  );
}
