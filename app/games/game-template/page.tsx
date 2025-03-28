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
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: gameData.title,
    description: gameData.description,
    image: `https://shanebonkowski.com${gameData.imageUrl}`,
    imageAlt: gameData.imageAlt,
  },
};

const GameTemplate = () => {
  return (
    <div
      id={gameData.title}
      className="flex justify-center items-center w-full h-screen"
    >
      <GameComponent />
    </div>
  );
};

export default dynamic(() => Promise.resolve(GameTemplate));
