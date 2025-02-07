import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { deathData } from "@/data/writing/death-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";

export const metadata = {
  title: deathData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: deathData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: deathData.imageUrl,
        alt: deathData.title,
      },
    ],
  },
};

export default function Death() {
  return (
    <div>
      <ResumeScrollProgress pageName={deathData.title} threshold={200} />
      <StoryContentLoader {...deathData} />
    </div>
  );
}
