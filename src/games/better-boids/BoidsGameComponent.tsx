"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/better-boids/styles/better-boids.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import BoidsSettingsContainer from "@/src/games/better-boids/BoidsSettingsContainer";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import { ContentDataProps } from "@/src/types/data-props";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import ToolbarDisableMessage from "@/src/components/ToolbarDisableMessage";

export const boidInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "Better Boids",
  },
  {
    type: "paragraph",
    text: 'The <a href="https://en.wikipedia.org/wiki/Boids" target="_blank" rel="noopener noreferrer">Boids algorithm</a>, devised by Craig Reynolds, mimics the flocking behavior seen in birds and other animals. In general, Boids follow three rules:',
  },
  {
    type: "list",
    items: [
      "<b>Alignment:</b> Boids try to align their direction with other nearby Boids.",
      "<b>Cohesion:</b> Boids move towards the average position of nearby Boids.",
      "<b>Separation:</b> Boids avoid crowding near other Boids.",
    ],
  },
  {
    type: "paragraph",
    text: "From these three simple rules, complex emergent behavior and intricate patterns can arise. This little game is an attempt to display the beauty in the Boids algorithm, while expanding on it with novel concepts where applicable.",
  },
];

interface BoidsGameComponentProps {
  id: string;
}

// Singleton Phaser game instance
let game: Phaser.Game | null = null;
const gameParentName = "phaser-game";

const BoidsGameComponent: React.FC<BoidsGameComponentProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingPhaser = useRef(false);

  const handleFadeOutComplete = () => {
    // Hides the loading screen
    setIsLoading(false);
  };

  useEffect(() => {
    document.body.classList.add("game-background");

    const loadPhaserGame = async () => {
      if (!window.Phaser) {
        console.error("Phaser module is not loaded yet, cannot load game.");
        return;
      }

      if (isLoadingPhaser.current) {
        console.warn("Phaser module already loading. Skipping duplicate call.");
        return;
      }
      isLoadingPhaser.current = true;

      if (game) {
        console.warn("Game already exists. Skipping duplicate creation.");
        return;
      }

      try {
        const { BoidsGameScene } = await import(
          "@/src/games/better-boids/scenes/better-boids-scene"
        );

        const gameConfig: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: "100%",
          height: "100%",
          transparent: true,
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          scene: BoidsGameScene,
          parent: gameParentName,
        };

        game = new window.Phaser.Game(gameConfig);
        console.log(`Phaser game created successfully.`);
      } catch (error) {
        console.error("Failed to load Game Scene:", error);
      } finally {
        isLoadingPhaser.current = false; // Reset the loading flag
      }
    };

    loadPhaserScriptThenGame(loadPhaserGame);

    return () => {
      game = cleanupPhaserGame(game);
      isLoadingPhaser.current = false; // Reset the loading flag
    };
  }, []);

  return (
    <div className="relative w-full h-full" id={id}>
      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/better-boids-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id={gameParentName}></div>

      {/* UI */}
      <ToolbarDisableMessage></ToolbarDisableMessage>
      <BoidsSettingsContainer></BoidsSettingsContainer>
      <GameInfoContainer infoData={boidInfoData}></GameInfoContainer>
    </div>
  );
};

export default BoidsGameComponent;
