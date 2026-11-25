import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/better-boids/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Better Boids",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/better-boids-cover.webp",
  imageAlt: "Better Boids",
};

export const metadata = createContentMetadata(gameMetadata, "/games/better-boids/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
