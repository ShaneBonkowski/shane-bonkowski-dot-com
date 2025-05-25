"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/game-of-life/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import { ContentDataProps } from "@/src/types/data-props";
import GameMessagePopup from "@/src/components/GameMessagePopup";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import UiOverlay from "@/src/games/game-of-life/UiOverlay";

export const gameInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "Game of Life",
  },
  {
    type: "paragraph",
    text: 'Modern adaptation of the classic 1970 cellular automaton game <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Conway`s Game of Life</a>. The game is typically played on an infinite, two-dimensional grid. Each cell can exist in one of two states (alive or dead) and interacts with its eight neighboring cells as follows:',
  },
  {
    type: "list",
    items: [
      "<b>Underpopulation</b>: Any live cell with fewer than two live neighbors dies.",
      "<b>Persistence</b>: Any live cell with two or three live neighbors lives on.",
      "<b>Overpopulation</b>: Any live cell with more than three live neighbors dies.",
      "<b>Reproduction</b>: Any dead cell with exactly three live neighbors becomes a live cell.",
    ],
  },
  {
    type: "paragraph",
    text: "From these simple rules, complex patterns can emerge. New shapes are still being discovered to this day!",
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
    document.body.classList.add("game-of-life-game-background");

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
          "@/src/games/game-of-life/scenes/main-game-scene"
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
          coverImage="/webps/games/game-of-life-cover.webp"
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
