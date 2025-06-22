"use client";

import { useEffect, useState, useRef } from "react";
import "@/src/games/cowpoke/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import { ContentDataProps } from "@/src/types/data-props";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/cowpoke/components/SettingsContainer";
import UpperHud from "@/src/games/cowpoke/components/UpperHud";
import GameControls from "@/src/games/cowpoke/components/GameControls";
import StartEndMenu from "@/src/games/cowpoke/components/StartEndMenu";
import GamePreventPortraitOrLandscapeMode from "@/src/components/GamePreventPortraitOrLandscapeMode";

export const gameInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "Cowpoke",
  },
  {
    type: "paragraph",
    text: "Follow'n in the footsteps of Cowpoke Jack, you're headin' out west to find your place in this here frontier.",
  },
  {
    type: "h2",
    text: "Keyboard Shortcuts",
  },
  {
    type: "paragraph",
    text: "In element mode:",
  },
  {
    type: "list",
    items: [
      "<b>1</b>: Select Rock",
      "<b>2</b>: Select Paper",
      "<b>3</b>: Select Scissors",
    ],
  },
  {
    type: "paragraph",
    text: "In combat mode:",
  },
  {
    type: "list",
    items: [
      "<b>1</b>: Select Attack",
      "<b>2</b>: Select Defend",
      "<b>3</b>: Select Counter",
    ],
  },
  {
    type: "paragraph",
    text: "General:",
  },
  {
    type: "list",
    items: [
      "<b>Up Arrow</b>: Scroll up in the feed",
      "<b>Down Arrow</b>: Scroll down in the feed",
    ],
  },
];

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
    document.body.classList.add("cowpoke-game-background");

    const loadPhaserGame = async () => {
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
          "@/src/games/cowpoke/scenes/main-game-scene"
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
      <StartEndMenu></StartEndMenu>
      <SettingsContainer></SettingsContainer>
      <GameInfoContainer
        infoData={gameInfoData}
        darkModeLight={true} // Want the black buttons this game! Since bkg is light.
        whiteBackground={true} // White bkg so that the dust etc. on the bkg gets covered
      ></GameInfoContainer>
      <UpperHud></UpperHud>
      <GameControls></GameControls>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game"></div>

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/cowpoke-game-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}

      {/* Prevent Portrait Mode */}
      <GamePreventPortraitOrLandscapeMode
        coverImage="/webps/games/cowpoke-game-cover.webp"
        preventMode="portrait"
      />
    </>
  );
};

export default GameComponent;
