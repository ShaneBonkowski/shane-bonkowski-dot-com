"use client";

import { useEffect } from "react";
import "@/src/games/better-boids/styles/better-boids.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import { boidInfoData } from "@/src/games/better-boids/boid-info-data";

interface BoidsGameComponentProps {
  id: string;
}

// FIXME/TODO:
// - Clean up the info button.
// - Make it so that x button and styling on the info screen is consistent with rest of the website coloring sizing etc.
// - Game screen should have a banner that is readable. Consider if we should be able to toggle light mode here.. Maybe we have a custom header for games with just shanes games in top left. Then coloring is specific color with no dark/light mode
// - Need to find a way to generalize the loading behavior (or at least some of the complex parts of it) for the game components. Right now there is a lot of copy-paste when I make fixes (this is for loading in phaser etc.).
// - Make sure all subscribe events are cleanly shut down! Every subscribe should have an unsubscribe. Also, search for all even listeners and make sure they eventually stop listening when shut down.
//   Also, make sure shutdown logic for game objs etc. is intuitive. We need to guarentee that if someone adds an "unsubsribe" that it will get called automatically, or it is at least clear when they need to call it... such as the for loop to shut down boids.
// - I think it would be nice to remove a lot of the "data" files. I'd rather directly define that data on the .tsx component file in-line so to speak.
//   Dont want devs to have to jump around so much. Will have to update instructions if I do this in certain READMEs. Also will need to consider if there are good reasons for centralizing certain data..

// Singleton Phaser game instance
let game: Phaser.Game | null = null;
let isLoadingPhaser = false;

const BoidsGameComponent: React.FC<BoidsGameComponentProps> = ({ id }) => {
  useEffect(() => {
    // Add the background to the game
    document.body.classList.add("game-background");

    const loadPhaser = async () => {
      // Prevent loading Phaser multiple times (can happen since it is async)
      if (isLoadingPhaser) {
        console.warn("Phaser is already loading. Skipping duplicate call.");
        return;
      }
      isLoadingPhaser = true;

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
