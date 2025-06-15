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
import SettingsContainer from "@/src/games/cowpoke/SettingsContainer";
import CharacterInfoBar from "@/src/games/cowpoke/CharacterInfoBar";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import Feed from "@/src/games/cowpoke/Feed";

export const gameInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "Cowpoke",
  },
  {
    type: "paragraph",
    text: "FIXME: Fill in information about the game here",
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
      <SettingsContainer></SettingsContainer>

      <GameInfoContainer
        infoData={gameInfoData}
        darkModeLight={true} // Want the black buttons this game! Since bkg is light.
        whiteBackground={true} // White bkg so that the dust etc. on the bkg gets covered
      ></GameInfoContainer>

      <Feed></Feed>

      <CharacterInfoBar
        characterType={CHARACTER_TYPES.PLAYER}
        name="Player"
        level={0}
        health={0}
        maxHealth={0}
        xp={0}
        maxXp={0}
        position="top-left"
      ></CharacterInfoBar>

      <CharacterInfoBar
        characterType={CHARACTER_TYPES.ENEMY}
        name="Enemy"
        level={0}
        health={0}
        maxHealth={0}
        xp={0}
        maxXp={0}
        position="top-right"
      ></CharacterInfoBar>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game"></div>

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/cowpoke-game-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </>
  );
};

export default GameComponent;
