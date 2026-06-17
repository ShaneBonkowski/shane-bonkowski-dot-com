import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const imageMetadata: WrittenContentMetadataProps = {
  title: "Quite the Leap",
  subtitle: "Shane Bonkowski",
  description: "An artwork by Shane Bonkowski.",
  date: "June 14, 2026",
  coverImageUrl: "/webps/art/quite-the-leap-cover-art.webp",
  contentImageUrl: "/webps/art/quite-the-leap.webp",
  contentImageWidth: 1080,
  contentImageHeight: 1350,
  artContent: true,
};

export const metadata = {
  title: imageMetadata.title,
  description: imageMetadata.description,
  openGraph: {
    title: imageMetadata.title,
    description: imageMetadata.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${imageMetadata.coverImageUrl}`,
        alt: imageMetadata.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: imageMetadata.title,
    description: imageMetadata.description,
    image: `https://shanebonkowski.com${imageMetadata.coverImageUrl}`,
    imageAlt: imageMetadata.description,
  },
};

export default function Page() {
  return (
    <WrittenContentLoader {...imageMetadata}>
      <WrittenContentParagraphGroup>
        <WrittenContentParagraphElement
          fontStyle={"italic"}
          textAlign={"center"}
        >
          This was supposed to be a diving board.
        </WrittenContentParagraphElement>
      </WrittenContentParagraphGroup>
    </WrittenContentLoader>
  );
}
