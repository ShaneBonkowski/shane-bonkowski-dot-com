import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/cowpoke/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Cowpoke",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/cowpoke-cover.webp",
  imageAlt: "Cowpoke",
};

export const metadata = createContentMetadata(gameMetadata, "/games/cowpoke/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
