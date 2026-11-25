"use client";

import { useEffect, useState } from "react";
import "@/src/games/game-of-life/styles/game.css";
import { startPhaserGame } from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import UiOverlay from "@/src/games/game-of-life/components/UiOverlay";
import SettingsContainer from "@/src/games/game-of-life/components/SettingsContainer";

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleFadeOutComplete = () => {
    // Hides the loading screen
    setIsLoading(false);
  };

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    document.body.classList.add("game-of-life-game-background");

    return startPhaserGame(
      () => import("@/src/games/game-of-life/scenes/main-game-scene")
    );
  }, []);

  return (
    <>
      {/* UI */}
      <UiOverlay />
      <SettingsContainer />
      <GameInfoContainer
        lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
        blackShadow={true} // Use a black shadow for the button
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
              Conway&apos;s Game of Life
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
    </>
  );
};

export default GameComponent;
