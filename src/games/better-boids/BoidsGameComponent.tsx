"use client";

import { useEffect } from "react";
import "@/src/games/better-boids/styles/better-boids.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import BoidsSettingsContainer from "@/src/games/better-boids/BoidsSettingsContainer";
import { boidInfoData } from "@/src/games/better-boids/boid-info-data";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";

interface BoidsGameComponentProps {
  id: string;
}

// Singleton Phaser game instance
let game: Phaser.Game | null = null;
let isLoadingPhaser = false;
const gameParentName = "phaser-game";

const BoidsGameComponent: React.FC<BoidsGameComponentProps> = ({ id }) => {
  useEffect(() => {
    document.body.classList.add("game-background");

    const loadPhaserGame = async () => {
      if (!window.Phaser) {
        console.error("Phaser module is not loaded yet, cannot load game.");
        return;
      }

      if (isLoadingPhaser) {
        console.warn("Phaser module already loading. Skipping duplicate call.");
        return;
      }
      isLoadingPhaser = true;

      if (game) {
        console.warn("Game already exists. Skipping duplicate creation.");
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
          parent: gameParentName,
        };

        game = new window.Phaser.Game(gameConfig);
        console.log(`Phaser game created successfully.`);
      } catch (error) {
        console.error("Failed to load Game Scene:", error);
      }
    };

    loadPhaserScriptThenGame(loadPhaserGame);

    return () => {
      cleanupPhaserGame(game);
      game = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full" id={id}>
      {/* Phaser Game Container */}
      <div className="absolute inset-0" id={gameParentName}></div>

      {/* UI */}
      <BoidsSettingsContainer></BoidsSettingsContainer>
      <GameInfoContainer infoData={boidInfoData}></GameInfoContainer>
    </div>
  );
};

export default BoidsGameComponent;
