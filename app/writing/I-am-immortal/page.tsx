import StoryContentLoader from "@/src/components/StoryContentLoader";
import { iAmImmortalData } from "@/src/data/writing/I-am-immortal-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";

const storyData = iAmImmortalData;

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

export default function IAmImmortal() {
  return (
    <div>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData} />
    </div>
  );
}
