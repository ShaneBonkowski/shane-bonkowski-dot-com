import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { myFinalThoughtData } from "@/data/writing/my-final-thought-data";

export const metadata = {
  title: myFinalThoughtData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: myFinalThoughtData.title,
    description: "A short story by Shane Bonkowski.",
    images: [
      {
        url: myFinalThoughtData.imageUrl,
        alt: myFinalThoughtData.title,
      },
    ],
  },
};

export default function myFinalThought() {
  return <StoryContentLoader {...myFinalThoughtData} />;
}
