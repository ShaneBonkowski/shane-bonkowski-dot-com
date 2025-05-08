import dynamic from "next/dynamic";
import { betterBoidsData } from "@/src/data/games/better-boids-data";
import BoidsGameComponent from "@/src/games/better-boids/BoidsGameComponent";

const gameData = betterBoidsData;

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

const BetterBoids = () => {
  return <BoidsGameComponent id={gameData.title}></BoidsGameComponent>;
};

export default dynamic(() => Promise.resolve(BetterBoids));
