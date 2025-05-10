import dynamic from "next/dynamic";
import { GameDataProps } from "@/src/types/data-props";
import TemplateGameComponent from "@/src/games/game-template/TemplateGameComponent";

const gameData: GameDataProps = {
  title: "Game Template",
  description: "A game by Shane Bonkowski.",
  logoImageUrl: "/webps/mars-logo-large.webp",
  imageAlt: "Game Template",
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

const GameTemplate = () => {
  return <TemplateGameComponent id={gameData.title}></TemplateGameComponent>;
};

export default dynamic(() => Promise.resolve(GameTemplate));
