"use client";

import { useEffect } from "react";

const GameComponent = () => {
  useEffect(() => {
    const loadPhaser = async () => {
      if (typeof window !== "undefined" && window.Phaser) {
        try {
          const { MainGameScene } = await import(
            "@/src/games/game-template/scenes/game-template-scene"
          );

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            scale: {
              mode: Phaser.Scale.RESIZE,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            scene: MainGameScene,
            parent: "phaser-game",
          };

          new window.Phaser.Game(config);
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
    script.onload = loadPhaser;
    script.onerror = () => {
      console.error("Failed to load Phaser script");
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full">
      <div id="phaser-game" className="w-full h-full"></div>
    </div>
  );
};

export default GameComponent;
