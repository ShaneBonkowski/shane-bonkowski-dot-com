import dynamic from "next/dynamic";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/flip-tile/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Flip Tile",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/flip-tile-cover.webp",
  imageAlt: "Flip Tile",
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
