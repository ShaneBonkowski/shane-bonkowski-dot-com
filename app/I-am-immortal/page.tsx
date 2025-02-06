import StoryContentLoader from "@/components/StoryContentLoader";
import { iAmImmortalData } from "@/data/I-am-immortal-data";

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
  return <StoryContentLoader {...iAmImmortalData} />;
}
