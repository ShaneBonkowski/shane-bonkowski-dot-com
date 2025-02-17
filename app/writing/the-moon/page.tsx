import StoryContentLoader from "@/src/components/StoryContentLoader";
import { theMoonData } from "@/src/data/writing/the-moon-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";

const storyData = theMoonData;

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

export default function TheMoon() {
  return (
    <div>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData} />
    </div>
  );
}
