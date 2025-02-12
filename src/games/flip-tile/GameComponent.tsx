"use client";

import { useEffect } from "react";
import InitUI from "@/src/games/flip-tile/InitUI.tsx";
import styles from "@/src/styles/games/flip-tile.module.css";

const GameComponent = () => {
  useEffect(() => {
    const loadPhaser = async () => {
      if (typeof window !== "undefined" && window.Phaser) {
        try {
          const { MainGameScene } = await import(
            "@/src/games/flip-tile/scenes/flip-tile-scene.ts"
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

          const game = new window.Phaser.Game(config);
          game.canvas.classList.add(styles.canvas);
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
      <InitUI />
    </div>
  );
};

export default GameComponent;
