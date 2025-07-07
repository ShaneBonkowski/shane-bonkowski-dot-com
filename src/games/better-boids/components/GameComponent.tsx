"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/better-boids/styles/game.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/better-boids/components/SettingsContainer";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";

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

    document.body.classList.add("better-boids-game-background");

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
          "@/src/games/better-boids/scenes/main-game-scene"
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
    // Disables user zoom. This is necessary to prevent for example
    // pinch-zooming on mobile devices, which breaks things on games.
    <div id={"Prevent zoom"} style={{ touchAction: "pan-x pan-y" }}>
      {/* UI */}
      <SettingsContainer />
      <GameInfoContainer>
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          <h1>Better Boids</h1>
          <p>
            The{" "}
            <a
              href="https://en.wikipedia.org/wiki/Boids"
              target="_blank"
              rel="noopener noreferrer"
            >
              Boids algorithm
            </a>
            , devised by Craig Reynolds, mimics the flocking behavior seen in
            birds and other animals. In general, Boids follow three rules:
          </p>
          <ul>
            <li>
              <b>Alignment:</b> Boids try to align their direction with other
              nearby Boids.
            </li>
            <li>
              <b>Cohesion:</b> Boids move towards the average position of nearby
              Boids.
            </li>
            <li>
              <b>Separation:</b> Boids avoid crowding near other Boids.
            </li>
          </ul>
          <p>
            From these three simple rules, complex emergent behavior and
            intricate patterns can arise. This little game is an attempt to
            display the beauty in the Boids algorithm, while expanding on it
            with novel concepts where applicable.
          </p>
        </div>
      </GameInfoContainer>
      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/better-boids-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </div>
  );
};

export default GameComponent;
