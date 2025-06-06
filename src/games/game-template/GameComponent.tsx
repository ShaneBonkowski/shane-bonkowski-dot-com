"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/game-template/styles/game.css"; // FIXME: UPDATE THIS PATH TO THE GAME-SPECIFIC CSS
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import { ContentDataProps } from "@/src/types/data-props";
import GameInfoContainer from "@/src/components/GameInfoContainer";

// FIXME: UPDATE THIS TO THE GAME-SPECIFIC GAME INFO
export const gameInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "<Game Name>",
  },
  {
    type: "paragraph",
    text: "Fill in information about the game here",
  },
];

// Singleton Phaser game instance
let game: Phaser.Game | null = null;

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingPhaser = useRef(false);

  const handleFadeOutComplete = () => {
    // Hides the loading screen
    setIsLoading(false);
  };

  useEffect(() => {
    // FIXME: UPDATE THIS TO THE GAME-SPECIFIC BACKGROUND CLASS
    document.body.classList.add("game-name-game-background");

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
        // FIXME: UPDATE IMPORT PATH FOR THE GAME-SPECIFIC SCENE
        const { MainGameScene } = await import(
          "@/src/games/game-template/scenes/main-game-scene"
        );

        const gameConfig: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: "100%",
          height: "100%",
          transparent: true,
          scale: {
            mode: Phaser.Scale.NONE, // see phaser-canvas.ts resizeCanvasToParent() for manual resizing
            autoCenter: Phaser.Scale.NO_CENTER,
          },
          scene: MainGameScene,
          parent: "phaser-game",
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
    <>
      {/* UI */}
      <GameInfoContainer infoData={gameInfoData}></GameInfoContainer>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game"></div>

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/better-boids-cover.webp" // FIXME: UPDATE THIS TO THE GAME-SPECIFIC COVER IMAGE
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </>
  );
};

export default GameComponent;
