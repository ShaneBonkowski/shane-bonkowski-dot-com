import { createContentMetadata } from "@/src/utils/content-metadata";
import { GameMetadataProps } from "@/src/types/data-props";
import GameComponent from "@/src/games/perlin-noise/components/GameComponent";

const gameMetadata: GameMetadataProps = {
  title: "Perlin Noise",
  description: "A game by Shane Bonkowski.",
  coverImageUrl: "/webps/games/perlin-noise-cover.webp",
  imageAlt: "Perlin Noise",
};

export const metadata = createContentMetadata(gameMetadata, "/games/perlin-noise/");

const Page = () => {
  return <GameComponent />;
};

export default Page;
