import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/game-of-life/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Game of Life",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/game-of-life-cover.webp",
  imageAlt: "Game of Life",
};

export const metadata = createContentMetadata(gameMetadata, "/games/game-of-life/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
