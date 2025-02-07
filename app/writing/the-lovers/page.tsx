import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theLoversData } from "@/data/writing/the-lovers-data";

export const metadata = {
  title: theLoversData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: theLoversData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: theLoversData.imageUrl,
        alt: theLoversData.title,
      },
    ],
  },
};

export default function TheLovers() {
  return <StoryContentLoader {...theLoversData} />;
}
