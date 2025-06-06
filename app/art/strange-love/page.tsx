import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryDataProps } from "@/src/types/data-props";

const imageData: StoryDataProps = {
  title: "Strange Love",
  subtitle: "Shane Bonkowski",
  date: "April 6, 2022",
  imageUrl: "/webps/art/strange-love.webp",
  imageWidth: 1194,
  imageHeight: 834,
  artContent: true,
  body: [
    {
      content:
        "Bone of my bones, flesh of my flesh. A piece of me, now a piece of you.",
      fontStyle: "italic",
      textAlign: "center",
    },
  ],
};

export const metadata = {
  title: imageData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: imageData.title,
    description: "A short story by Shane Bonkowski.",
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${imageData.imageUrl}`,
        alt: "A short story by Shane Bonkowski.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: imageData.title,
    description: "A short story by Shane Bonkowski.",
    image: `https://shanebonkowski.com${imageData.imageUrl}`,
    imageAlt: "A short story by Shane Bonkowski.",
  },
};

export default function Page() {
  return <StoryContentLoader {...imageData} />;
}
