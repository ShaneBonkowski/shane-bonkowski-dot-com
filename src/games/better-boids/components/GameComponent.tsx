"use client";

import { useEffect, useState } from "react";
import "@/src/games/better-boids/styles/game.css";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/better-boids/components/SettingsContainer";
import { startPhaserGame } from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";

const GameComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleFadeOutComplete = () => {
    // Hides the loading screen
    setIsLoading(false);
  };

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    document.body.classList.add("better-boids-game-background");

    return startPhaserGame(
      () => import("@/src/games/better-boids/scenes/main-game-scene")
    );
  }, []);

  return (
    <>
      {/* UI */}
      <SettingsContainer />
      <GameInfoContainer>
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          <h1>Better Boids</h1>
          <p>
            The{" "}
            <a
              href="https://en.wikipedia.org/wiki/Boids"
              target="_blank"
              rel="noopener noreferrer"
            >
              Boids algorithm
            </a>
            , devised by Craig Reynolds, mimics the flocking behavior seen in
            birds and other animals. In general, Boids follow three rules:
          </p>
          <ul>
            <li>
              <b>Alignment:</b> Boids try to align their direction with other
              nearby Boids.
            </li>
            <li>
              <b>Cohesion:</b> Boids move towards the average position of nearby
              Boids.
            </li>
            <li>
              <b>Separation:</b> Boids avoid crowding near other Boids.
            </li>
          </ul>
          <p>
            From these three simple rules, complex emergent behavior and
            intricate patterns can arise. This little game is an attempt to
            display the beauty in the Boids algorithm, while expanding on it
            with novel concepts where applicable.
          </p>

          <h2>Boid Types</h2>
          <p>This simulation features four types of boids:</p>
          <ul>
            <li>
              <b>Good Boids:</b> These boids flee from bad boids.
            </li>
            <li>
              <b>Bad Boids:</b> These boids chase good boids.
            </li>
            <li>
              <b>Obstacle Boids:</b> These boids act as static obstacles that
              all other boids will avoid. You can click and drag to reposition
              them.
            </li>
            <li>
              <b>Leader Boid:</b> This boid follows your mouse when you click
              and hold. Its influence on good and bad boids is determined by the
              leader strength setting.
            </li>
          </ul>
        </div>
      </GameInfoContainer>
      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

      {/* Loading Screen */}
      {isLoading && (
        <GameLoadingScreen
          coverImage="/webps/games/better-boids-cover.webp"
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
    </>
  );
};

export default GameComponent;
