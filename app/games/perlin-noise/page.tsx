import dynamic from "next/dynamic";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/perlin-noise/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Perlin Noise",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/perlin-noise-cover.webp",
  imageAlt: "Perlin Noise",
};

export const metadata = {
  title: gameMetadata.title,
  description: gameMetadata.description,
  openGraph: {
    title: gameMetadata.title,
    description: gameMetadata.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${gameMetadata.coverImageUrl}`,
        alt: gameMetadata.imageAlt,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: gameMetadata.title,
    description: gameMetadata.description,
    image: `https://shanebonkowski.com${gameMetadata.coverImageUrl}`,
    imageAlt: gameMetadata.imageAlt,
  },
};

const Page = () => {
  return <GameComponent />;
};

export default dynamic(() => Promise.resolve(Page));
