import ComicContentLoader from "@/src/components/WrittenContentLoader";
import { ComicMetadataProps } from "@/src/types/data-props";
import { southwardFallsComicData } from "@/src/data/comic-data";

// FIXME: implenment ComicContentLoader...  also be able to turn iso date into the types out date we use for stories etc. I want it to look like an art page, where it has the subtitle there and the date below. Shold prolly import the writing content laoder and just extend some functionality

const comicData: ComicMetadataProps = {
  title: "Southward Falls",
  subtitle: "Shane Bonkowski",
  description: "A comic by Shane Bonkowski.",
  // Cover for the comic series, not an individual comic
  coverImageUrl: "/webps/comics/SF-comic-cover-art.webp",
};

export const metadata = {
  title: comicData.title,
  description: comicData.description,
  openGraph: {
    title: comicData.title,
    description: comicData.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${comicData.coverImageUrl}`,
        alt: comicData.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: comicData.title,
    description: comicData.description,
    image: `https://shanebonkowski.com${comicData.coverImageUrl}`,
    imageAlt: comicData.description,
  },
};

export default function Page() {
  return <ComicContentLoader {...southwardFallsComicData} />;
}
