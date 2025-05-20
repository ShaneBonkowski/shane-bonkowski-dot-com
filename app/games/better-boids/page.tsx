import dynamic from "next/dynamic";
import { GameDataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/better-boids/GameComponent";

const gameData: GameDataProps = {
  title: "Better Boids",
  description: "A game by Shane Bonkowski.",
  logoImageUrl: "/webps/mars-logo-large.webp",
  imageAlt: "Better Boids",
};

export const metadata = {
  title: gameData.title,
  description: gameData.description,
  openGraph: {
    title: gameData.title,
    description: gameData.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${gameData.logoImageUrl}`,
        alt: gameData.imageAlt,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: gameData.title,
    description: gameData.description,
    image: `https://shanebonkowski.com${gameData.logoImageUrl}`,
    imageAlt: gameData.imageAlt,
  },
};

const Page = () => {
  return <GameComponent id={gameData.title}></GameComponent>;
};

export default dynamic(() => Promise.resolve(Page));
