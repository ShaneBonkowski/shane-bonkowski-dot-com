import StoryContentLoader from "@/src/components/StoryContentLoader";
import { beforeTheWorldDriedUpData } from "@/src/data/writing/before-the-world-dried-up-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";

const storyData = beforeTheWorldDriedUpData;

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

export default function BeforeTheWorldDriedUp() {
  return (
    <div>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData} />
    </div>
  );
}
