import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryMetadataProps } from "@/src/types/data-props";
import StoryParagraphElement from "@/src/components/StoryParagraphElement";
import StoryParagraphGroup from "@/src/components/StoryParagraphGroup";

const imageData: StoryMetadataProps = {
  title: "Strange Love",
  subtitle: "Shane Bonkowski",
  date: "April 6, 2022",
  coverImageUrl: "/webps/art/strange-love.webp",
  coverImageWidth: 1194,
  coverImageHeight: 834,
  artContent: true,
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
        url: `https://shanebonkowski.com${imageData.coverImageUrl}`,
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
    image: `https://shanebonkowski.com${imageData.coverImageUrl}`,
    imageAlt: "A short story by Shane Bonkowski.",
  },
};

export default function Page() {
  return (
    <StoryContentLoader {...imageData}>
      <StoryParagraphGroup>
        <StoryParagraphElement fontStyle={"italic"} textAlign={"center"}>
          Bone of my bones, flesh of my flesh. A piece of me, now a piece of
          you.
        </StoryParagraphElement>
      </StoryParagraphGroup>
    </StoryContentLoader>
  );
}
