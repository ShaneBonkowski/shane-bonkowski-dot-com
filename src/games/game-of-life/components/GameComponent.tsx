"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/game-of-life/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import UiOverlay from "@/src/games/game-of-life/components/UiOverlay";
import SettingsContainer from "@/src/games/game-of-life/components/SettingsContainer";

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

    document.body.classList.add("game-of-life-game-background");

    const loadPhaserGame = async () => {
      // eslint-disable-next-line no-restricted-syntax
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
            mode: Phaser.Scale.NONE, // see phaser-canvas.ts resizeCanvasToParent() for manual resizing
            autoCenter: Phaser.Scale.NO_CENTER,
          },
          scene: MainGameScene,
          parent: "phaser-game",
        };

        // eslint-disable-next-line no-restricted-syntax
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
    // 'app-mode' is necessary to prevent for example pinch-zooming on mobile
    // devices, which breaks things on games.
    <div id={"Prevent zoom"} className="app-mode">
      {/* UI */}
      <UiOverlay />
      <SettingsContainer />
      <GameInfoContainer
        lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
      >
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          <h1>Game of Life</h1>
          <p>
            Modern adaptation of the classic 1970 cellular automaton game{" "}
            <a
              href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conway`s Game of Life
            </a>
            . The game is typically played on an infinite, two-dimensional grid.
            Each cell can exist in one of two states (alive or dead) and
            interacts with its eight neighboring cells as follows:
          </p>
          <ul>
            <li>
              <b>Underpopulation</b>: Any live cell with fewer than two live
              neighbors dies.
            </li>
            <li>
              <b>Persistence</b>: Any live cell with two or three live neighbors
              lives on.
            </li>
            <li>
              <b>Overpopulation</b>: Any live cell with more than three live
              neighbors dies.
            </li>
            <li>
              <b>Reproduction</b>: Any dead cell with exactly three live
              neighbors becomes a live cell.
            </li>
          </ul>
          <p>
            From these simple rules, complex patterns can emerge. New shapes are
            still being discovered to this day!
          </p>
        </div>
      </GameInfoContainer>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/game-of-life-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </div>
  );
};

export default GameComponent;
