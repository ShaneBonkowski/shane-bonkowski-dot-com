import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { beforeTheWorldDriedUpData } from "@/data/writing/before-the-world-dried-up-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";

export const metadata = {
  title: beforeTheWorldDriedUpData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: beforeTheWorldDriedUpData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: beforeTheWorldDriedUpData.imageUrl,
        alt: beforeTheWorldDriedUpData.title,
      },
    ],
  },
};

export default function BeforeTheWorldDriedUp() {
  return (
    <div>
      <ResumeScrollProgress
        pageName={beforeTheWorldDriedUpData.title}
        threshold={200}
      />
      <StoryContentLoader {...beforeTheWorldDriedUpData} />
    </div>
  );
}
