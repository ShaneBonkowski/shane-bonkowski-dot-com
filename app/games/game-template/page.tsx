import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/game-template/components/GameComponent"; // FIXME: UPDATE THIS

const gameMetadata: GameMetadataProps = {
  title: "Game Template", // FIXME: UPDATE THIS
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/better-boids-cover.webp", // FIXME: UPDATE THIS
  imageAlt: "Game Template", // FIXME: UPDATE THIS
};

export const metadata = createContentMetadata(gameMetadata, "/games/game-template/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
