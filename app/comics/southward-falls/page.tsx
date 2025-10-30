import { Suspense } from "react";
import ComicContentLoader from "@/src/components/ComicContentLoader";
import { ComicMetadataProps } from "@/src/types/data-props";
import { comicData } from "@/src/data/comic-data";

const comicMetadata: ComicMetadataProps = {
  title: "Southward Falls",
  subtitle: "Shane Bonkowski",
  description: "A comic by Shane Bonkowski.",
  // Cover for the comic series. This is not, for example, an individual comic.
  // Individual comic data would come from `@/src/data/comic-data`.
  coverImageUrl: "/webps/comics/SF-comic-cover-art.webp",
  firstComicShown: "FIRST_IF_NOT_SEEN_THEN_LAST",
};

export const metadata = {
  title: comicMetadata.title,
  description: comicMetadata.description,
  openGraph: {
    title: comicMetadata.title,
    description: comicMetadata.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${comicMetadata.coverImageUrl}`,
        alt: comicMetadata.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: comicMetadata.title,
    description: comicMetadata.description,
    image: `https://shanebonkowski.com${comicMetadata.coverImageUrl}`,
    imageAlt: comicMetadata.description,
  },
};

export default async function Page() {
  return (
    // Use 'Suspense' here since this is a client-side rendered page. We do this
    // because there is no one comic tied to the comic series. It changes based on
    // which comic the user is viewing etc. No fallback UI is used because I would
    // prefer it to just show the home page for longer rather than a few milliseconds
    // of a loading screen
    <Suspense
      key={comicMetadata.title}
      fallback={
        <div className="flex items-center justify-center h-full my-auto">
          <h3>Loading comic content...</h3>
        </div>
      }
    >
      <ComicContentLoader
        comicMetadata={comicMetadata}
        childrenComicsData={comicData["southward_falls"]}
      />
    </Suspense>
  );
}
