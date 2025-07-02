import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryMetadataProps } from "@/src/types/data-props";
import StoryParagraphElement from "@/src/components/StoryParagraphElement";

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
      <StoryParagraphElement
        fontStyle={"italic"}
        textAlign={"center"}
        // For a single Paragraph element, it is considered both first and last
        isFirst={true}
        isLast={true}
      >
        Bone of my bones, flesh of my flesh. A piece of me, now a piece of you.
      </StoryParagraphElement>
    </StoryContentLoader>
  );
}
