"use client";

import { useEffect } from "react";
import "@/src/games/game-template/styles/game-template.css";

const TemplateGameComponent: React.FC = () => {
  useEffect(() => {
    let game: Phaser.Game | null = null;

    // Add the background to the game
    document.body.classList.add("game-background");

    const loadPhaser = async () => {
      if (window.Phaser) {
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

    // Handle window resize for canvas
    const handleResize = () => {
      if (game) {
        game.scale.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function to destroy the Phaser game instance
    return () => {
      if (game) {
        console.log("Destroying Phaser game instance.");
        game.destroy(true);
      }
      document.head.removeChild(script);
      window.removeEventListener("resize", handleResize);

      // Remove the background from the game
      document.body.classList.remove("game-background");
    };
  }, []);

  return <div className="w-full h-full" id="phaser-game"></div>;
};

export default TemplateGameComponent;
