import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/flip-tile/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Flip Tile",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/flip-tile-cover.webp",
  imageAlt: "Flip Tile",
};

export const metadata = createContentMetadata(gameMetadata, "/games/flip-tile/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
