import StoryContentLoader from "@/src/components/StoryContentLoader";
import { artPlaceholderData } from "@/src/data/art/art-placeholder-data";

const imageData = artPlaceholderData;

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

export default function ArtPlaceholder() {
  return (
    <div id={imageData.title}>
      <StoryContentLoader {...imageData} />
    </div>
  );
}
