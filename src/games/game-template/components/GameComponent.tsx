"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/game-template/styles/game.css"; // FIXME: UPDATE THIS PATH TO THE GAME-SPECIFIC CSS
import {
  loadPhaserModuleThenGame,
  cleanupPhaserGame,
  type PhaserModule,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/game-template/components/SettingsContainer"; // FIXME: UPDATE THIS PATH TO THE GAME-SPECIFIC SETTINGS CONTAINER
import UiOverlay from "@/src/games/game-template/components/UiOverlay"; // FIXME: UPDATE

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
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // FIXME: UPDATE THIS TO THE GAME-SPECIFIC BACKGROUND CLASS
    document.body.classList.add("game-name-game-background");

    const loadPhaserGame = async (phaser: PhaserModule) => {
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
          type: phaser.AUTO,
          width: "100%",
          height: "100%",
          transparent: true,
          scale: {
            mode: phaser.Scale.NONE, // see phaser-canvas.ts resizeCanvasToParent() for manual resizing
            autoCenter: phaser.Scale.NO_CENTER,
          },
          scene: MainGameScene,
          parent: "phaser-game",
        };

        game = new phaser.Game(gameConfig);
        console.log(`Phaser game created successfully.`);
      } catch (error) {
        console.error("Failed to load Game Scene:", error);
      } finally {
        isLoadingPhaser.current = false; // Reset the loading flag
      }
    };

    loadPhaserModuleThenGame(loadPhaserGame).catch((error) => {
      console.error("Failed to load Phaser module:", error);
    });

    return () => {
      game = cleanupPhaserGame(game);
      isLoadingPhaser.current = false; // Reset the loading flag
    };
  }, []);

  return (
    <>
      {/* UI */}
      <UiOverlay />
      <SettingsContainer />
      <GameInfoContainer>
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          {/* FIXME: UPDATE THIS TO THE GAME-SPECIFIC GAME INFO */}
          <h1>Game Name</h1>
          <p>Fill in information about the game here</p>
        </div>
      </GameInfoContainer>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

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
