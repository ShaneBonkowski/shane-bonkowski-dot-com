import dynamic from "next/dynamic";
import { GameDataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/game-template/GameComponent"; // FIXME: UPDATE THIS

const gameData: GameDataProps = {
  title: "Game Template", // FIXME: UPDATE THIS
  description: "A game by Shane Bonkowski.",
  logoImageUrl: "/webps/mars-logo-large.webp",
  imageAlt: "Game Template", // FIXME: UPDATE THIS
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
  return <GameComponent></GameComponent>;
};

export default dynamic(() => Promise.resolve(Page));
