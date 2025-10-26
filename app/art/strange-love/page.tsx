import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const imageData: WrittenContentMetadataProps = {
  title: "Strange Love",
  subtitle: "Shane Bonkowski",
  description: "An artwork by Shane Bonkowski.",
  date: "April 6, 2022",
  coverImageUrl: "/webps/art/strange-love-cover-art.webp",
  contentImageUrl: "/webps/art/strange-love.webp",
  contentImageWidth: 1194,
  contentImageHeight: 834,
  artContent: true,
};

export const metadata = {
  title: imageData.title,
  description: imageData.description,
  openGraph: {
    title: imageData.title,
    description: imageData.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${imageData.coverImageUrl}`,
        alt: imageData.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: imageData.title,
    description: imageData.description,
    image: `https://shanebonkowski.com${imageData.coverImageUrl}`,
    imageAlt: imageData.description,
  },
};

export default function Page() {
  return (
    <WrittenContentLoader {...imageData}>
      <WrittenContentParagraphGroup>
        <WrittenContentParagraphElement
          fontStyle={"italic"}
          textAlign={"center"}
        >
          Bone of my bones, flesh of my flesh. A piece of me, now a piece of
          you.
        </WrittenContentParagraphElement>
      </WrittenContentParagraphGroup>
    </WrittenContentLoader>
  );
}
