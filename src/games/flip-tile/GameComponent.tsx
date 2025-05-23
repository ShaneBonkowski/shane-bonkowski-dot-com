"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/flip-tile/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import { ContentDataProps } from "@/src/types/data-props";
import GameMessagePopup from "@/src/components/GameMessagePopup";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import UiOverlay from "@/src/games/flip-tile/UiOverlay";

export const gameInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "Flip Tile",
  },
  {
    type: "paragraph",
    text: 'Inspired by the classic <a href="https://en.wikipedia.org/wiki/Lights_Out_(game)" target="_blank" rel="noopener noreferrer">Lights Out</a> game, Flip Tile brings a fresh twist to the familiar puzzle concept, offering three distinct levels of difficulty to challenge players of all skill levels.',
  },
  {
    type: "paragraph",
    text: 'I created this game mostly as an exercise to re-learn linear algebra concepts. Watch <a href="https://www.youtube.com/watch?v=0fHkKcy0x_U" target="_blank" rel="noopener noreferrer">Solving the "Lights Out" Problem</a> for more context on how linear algebra can be used to automatically solve this game!',
  },
];

// Singleton Phaser game instance
let game: Phaser.Game | null = null;
const gameParentName = "phaser-game";

const GameComponent: React.FC<{ id: string }> = ({ id }) => {
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
        const { MainGameScene } = await import(
          "@/src/games/flip-tile/scenes/main-game-scene"
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
          scene: MainGameScene,
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
          coverImage="/webps/games/flip-tile-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id={gameParentName}></div>

      {/* UI */}
      <UiOverlay></UiOverlay>
      <GameMessagePopup
        message="For the best experience, hide the toolbar and switch to fullscreen mode."
        bottom={true}
      ></GameMessagePopup>
      <GameInfoContainer infoData={gameInfoData}></GameInfoContainer>
    </div>
  );
};

export default GameComponent;
