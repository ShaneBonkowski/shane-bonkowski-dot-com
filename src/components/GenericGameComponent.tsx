"use client";

import { useEffect } from "react";

// NOTE: This is required because Webpack doesn't support dynamic imports
// with variables, so we need to map game names to their paths here.
const initialScenePathMap: { [key: string]: string } = {
  // FORMAT -> Game Title: path/to/initial-scene
  "Game Template": "@/src/games/game-template/scenes/game-template-scene",
  "Better Boids": "@/src/games/better-boids/scenes/better-boids-scene",
};

interface GameComponentProps {
  gameTitle: string;
  initialSceneName: string;
}

const GenericGameComponent: React.FC<GameComponentProps> = ({
  gameTitle,
  initialSceneName,
}) => {
  useEffect(() => {
    let game: Phaser.Game | null = null;

    const loadPhaser = async () => {
      if (window.Phaser) {
        try {
          const resolvedPath = initialScenePathMap[gameTitle];
          if (!resolvedPath) {
            throw new Error(`Path for game ${gameTitle} not found in map.`);
          }
          console.log(`Attempting to load scene from path: ${resolvedPath}`);
          const GameSceneModule = await import(resolvedPath);
          console.log(`Successfully imported module:`, GameSceneModule);

          const GameScene = GameSceneModule[initialSceneName];
          if (!GameScene) {
            throw new Error(`Scene ${initialSceneName} not found in module.`);
          }
          console.log(`Successfully loaded scene: ${initialSceneName}`);

          const gameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: "100%",
            height: "100%",
            transparent: true,
            scale: {
              mode: Phaser.Scale.RESIZE,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            scene: GameScene,
            parent: "phaser-game",
          };

          console.log(`Creating Phaser game with config:`, gameConfig);
          game = new window.Phaser.Game(gameConfig);
          console.log(`Phaser game created successfully.`);
        } catch (error) {
          console.error("Failed to load Game Scene:", error);
        }
      } else {
        console.error("Phaser is not loaded");
      }
    };

    // Wait for the Phaser library to load before starting the game
    const script = document.createElement("script");
    script.src = "/js/phaser.min.js";
    script.onload = () => {
      console.log("Phaser script loaded successfully.");
      loadPhaser();
    };
    script.onerror = () => {
      console.error("Failed to load Phaser script");
    };
    document.head.appendChild(script);

    // Cleanup function to destroy the Phaser game instance
    return () => {
      if (game) {
        console.log("Destroying Phaser game instance.");
        game.destroy(true);
      }
      document.head.removeChild(script);
    };
  }, [gameTitle, initialSceneName]);

  return <div className="w-full h-full" id="phaser-game"></div>;
};

export default GenericGameComponent;
