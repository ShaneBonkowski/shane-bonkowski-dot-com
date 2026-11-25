"use client";

import { useEffect, useState } from "react";
import "@/src/games/game-template/styles/game.css"; // FIXME: UPDATE THIS PATH TO THE GAME-SPECIFIC CSS
import { startPhaserGame } from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/game-template/components/SettingsContainer"; // FIXME: UPDATE THIS PATH TO THE GAME-SPECIFIC SETTINGS CONTAINER
import UiOverlay from "@/src/games/game-template/components/UiOverlay"; // FIXME: UPDATE

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleFadeOutComplete = () => {
    // Hides the loading screen
    setIsLoading(false);
  };

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // FIXME: UPDATE THIS TO THE GAME-SPECIFIC BACKGROUND CLASS
    document.body.classList.add("game-name-game-background");

    // FIXME: UPDATE IMPORT PATH FOR THE GAME-SPECIFIC SCENE
    return startPhaserGame(
      () => import("@/src/games/game-template/scenes/main-game-scene")
    );
  }, []);

  return (
    <>
      {/* UI */}
      <UiOverlay />
      <SettingsContainer />
      <GameInfoContainer>
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          {/* FIXME: UPDATE THIS TO THE GAME-SPECIFIC GAME INFO */}
          <h1>Game Name</h1>
          <p>Fill in information about the game here</p>
        </div>
      </GameInfoContainer>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/better-boids-cover.webp" // FIXME: UPDATE THIS TO THE GAME-SPECIFIC COVER IMAGE
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </>
  );
};

export default GameComponent;
