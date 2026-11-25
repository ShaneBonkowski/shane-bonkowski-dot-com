import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { createContentMetadata } from "@/src/utils/content-metadata";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const imageMetadata: WrittenContentMetadataProps = {
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

export const metadata = createContentMetadata(imageMetadata, "/art/strange-love/");

export default function Page() {
  return (
    <WrittenContentLoader {...imageMetadata}>
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
