"use client";

import { useEffect } from "react";
import "@/src/games/game-template/styles/game-template.css";

interface TemplateGameComponentProps {
  id: string;
}

// Singleton Phaser game instance
let game: Phaser.Game | null = null;

const TemplateGameComponent: React.FC<TemplateGameComponentProps> = ({
  id,
}) => {
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
          const { TemplateGameScene } = await import(
            "@/src/games/game-template/scenes/game-template-scene"
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
            scene: TemplateGameScene,
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

      {/* Add UI etc. here... */}
    </div>
  );
};

export default TemplateGameComponent;
