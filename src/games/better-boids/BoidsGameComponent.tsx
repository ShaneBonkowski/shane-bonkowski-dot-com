"use client";

import { useEffect } from "react";
import "@/src/games/better-boids/styles/better-boids.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import { boidInfoData } from "@/src/games/better-boids/boid-info-data";

interface BoidsGameComponentProps {
  id: string;
}

// FIXME/TODO:
// - Hot Module Reloading is causing errors on the phaser games.
//   Related to the fact that it tries to recreate the entire scene when
//   the page loads in, and then tries to revert to the old state in some way.
//   This leads to an issue where canvas's would be duplicated. I fixed the duplication,
//   but I'm still getting some weird behavior with phaser scale etc. not being init'd on
//   a hot reload. To test, go to menu and come back to the app quickly, it will
//   hot reload and cause issues.
// - Clean up the info button.
// - Make it so that x button and styling on the info screen is consistent with rest of the website coloring sizing etc.
// - Game screen should have a banner that is readable. Consider if we should be able to toggle light mode here.. Maybe we have a custom header for games with just shanes games in top left. Then coloring is specific color with no dark/light mode

// Singleton Phaser game instance
let game: Phaser.Game | null = null;

const BoidsGameComponent: React.FC<BoidsGameComponentProps> = ({ id }) => {
  useEffect(() => {
    // Add the background to the game
    document.body.classList.add("game-background");

    const loadPhaser = async () => {
      if (window.Phaser) {
        // Prevent creating multiple game instances
        if (game) {
          console.warn(
            "Phaser game instance already exists. Skipping creation."
          );
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
    const existingScript = document.querySelector(
      'script[src="/js/phaser.min.js"]'
    );
    let script: HTMLScriptElement | null = null;

    if (!existingScript) {
      script = document.createElement("script");
      script.src = "/js/phaser.min.js";
      script.onload = () => {
        console.log("Phaser script loaded successfully.");
        loadPhaser();
      };
      script.onerror = () => {
        console.error("Failed to load Phaser script");
      };
      document.head.appendChild(script);
    } else {
      console.log("Phaser script already loaded.");
      loadPhaser();
    }

    // Cleanup function to destroy the Phaser game instance
    return () => {
      if (game) {
        console.log("Destroying Phaser game instance.");
        game.destroy(true);
        game = null;
      }
      console.log("Phaser game instance destroyed.");

      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      document.body.classList.remove("game-background");
    };
  }, []);

  return (
    <div className="relative w-full h-full" id={id}>
      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game"></div>

      {/* UI */}
      <GameInfoContainer infoData={boidInfoData}></GameInfoContainer>
    </div>
  );
};

export default BoidsGameComponent;
