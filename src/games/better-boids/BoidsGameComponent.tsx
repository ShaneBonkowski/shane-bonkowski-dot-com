"use client";

import { useEffect } from "react";
import "@/src/games/better-boids/styles/better-boids.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import { boidInfoData } from "@/src/games/better-boids/boid-info-data";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";

interface BoidsGameComponentProps {
  id: string;
}

// FIXME/TODO:
// - Clean up the info button.
// - Make it so that x button and styling on the info screen is consistent with rest of the website coloring sizing etc.
// - Game screen should have a banner that is readable. Consider if we should be able to toggle light mode here.. Maybe we have a custom header for games with just shanes games in top left. Then coloring is specific color with no dark/light mode
// - Make sure all subscribe events are cleanly shut down! Every subscribe should have an unsubscribe. Also, search for all even listeners and make sure they eventually stop listening when shut down.
//   Also, make sure shutdown logic for game objs etc. is intuitive. We need to guarentee that if someone adds an "unsubsribe" that it will get called automatically, or it is at least clear when they need to call it... such as the for loop to shut down boids.
// - I think it would be nice to remove a lot of the "data" files. I'd rather directly define that data on the .tsx component file in-line so to speak.
//   Dont want devs to have to jump around so much. Will have to update instructions if I do this in certain READMEs. Also will need to consider if there are good reasons for centralizing certain data..

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
      <GameInfoContainer infoData={boidInfoData}></GameInfoContainer>
    </div>
  );
};

export default BoidsGameComponent;
