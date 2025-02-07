import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { iAmImmortalData } from "@/data/writing/I-am-immortal-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";

export const metadata = {
  title: iAmImmortalData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: iAmImmortalData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: iAmImmortalData.imageUrl,
        alt: iAmImmortalData.title,
      },
    ],
  },
};

export default function IAmImmortal() {
  return (
    <div>
      <ResumeScrollProgress pageName={iAmImmortalData.title} threshold={200} />
      <StoryContentLoader {...iAmImmortalData} />
    </div>
  );
}
