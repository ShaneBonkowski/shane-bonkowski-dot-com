import dynamic from "next/dynamic";
import { gameTemplateData } from "@/src/data/games/game-template-data";
import GameComponent from "@/src/games/game-template/GameComponent";

const gameData = gameTemplateData;

export const metadata = {
  title: gameData.title,
  description: gameData.description,
  openGraph: {
    title: gameData.title,
    description: gameData.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${gameData.imageUrl}`,
        alt: gameData.imageAlt,
      },
    ],
    type: "website",
  },
};

const GameTemplate = () => {
  return <GameComponent />;
};

export default dynamic(() => Promise.resolve(GameTemplate));
