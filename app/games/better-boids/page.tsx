import dynamic from "next/dynamic";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/better-boids/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Better Boids",
  description: "A game by Shane Bonkowski.",
  logoImageUrl: "/webps/mars-logo-large.webp",
  imageAlt: "Better Boids",
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
        url: `https://shanebonkowski.com${gameMetadata.logoImageUrl}`,
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
    image: `https://shanebonkowski.com${gameMetadata.logoImageUrl}`,
    imageAlt: gameMetadata.imageAlt,
  },
};

const Page = () => {
  return <GameComponent />;
};

export default dynamic(() => Promise.resolve(Page));
