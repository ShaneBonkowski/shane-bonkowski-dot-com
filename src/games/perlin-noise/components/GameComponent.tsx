"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/perlin-noise/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/perlin-noise/components/SettingsContainer";
import UiOverlay from "@/src/games/perlin-noise/components/UiOverlay";

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

    document.body.classList.add("perlin-noise-game-background");

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
          "@/src/games/perlin-noise/scenes/main-game-scene"
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
          <h1>Perlin Noise</h1>
          <p>
            Explore procedurally generated landscapes using{" "}
            <a
              href="https://en.wikipedia.org/wiki/Perlin_noise"
              target="_blank"
              rel="noopener noreferrer"
            >
              Perlin Noise
            </a>{" "}
            terrain generation. From this fairly simple algorithm, it is
            possible to create realistic, organic-looking terrain patterns in
            real-time.
          </p>

          <h2>How It Works</h2>
          <p>
            Noise functions generate pseudo-random values that create smooth,
            natural-looking patterns. Each point on the terrain corresponds to a
            noise value between 0 and 1, which determines the tile type. These
            tile types range from deep water (low values) to snow-capped
            mountains (high values).
          </p>

          <h3>Terrain Thresholds</h3>
          <p>
            The generation presets use threshold values to map noise output to
            terrain types. For example, values below 0.15 may become deep water,
            0.15-0.35 may become shallow water, and so on. This creates distinct
            biomes with smooth transitions. These values are fully customizable
            in the settings menu.
          </p>

          <h3>Octaves</h3>
          <p>
            Octaves add detail by layering multiple noise functions together.
            Each octave has double the frequency and half the amplitude of the
            previous one:
          </p>
          <ul>
            <li>
              <b>1 Octave</b>: Smooth, rolling hills with broad features
            </li>
            <li>
              <b>2-4 Octaves</b>: More realistic terrain with medium-to-high
              detail
            </li>
          </ul>

          <h2>Keyboard Shortcuts</h2>
          <ul>
            <li>
              <b>Up Arrow</b>: Move Up
            </li>
            <li>
              <b>Down Arrow</b>: Move Down
            </li>
            <li>
              <b>Left Arrow</b>: Move Left
            </li>
            <li>
              <b>Right Arrow</b>: Move Right
            </li>
          </ul>

          <h2>Technical Note</h2>
          <p>
            While called &quot;Perlin Noise,&quot; this implementation actually
            uses{" "}
            <a
              href="https://en.wikipedia.org/wiki/Simplex_noise"
              target="_blank"
              rel="noopener noreferrer"
            >
              Simplex Noise
            </a>
            , developed by Ken Perlin as an improvement over his original
            algorithm. Simplex Noise offers better performance and visual
            quality, especially in higher dimensions.
          </p>
        </div>
      </GameInfoContainer>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/perlin-noise-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </>
  );
};

export default GameComponent;
