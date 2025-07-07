"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import "@/src/games/cowpoke/styles/game.css";
import {
  loadPhaserScriptThenGame,
  cleanupPhaserGame,
} from "@/src/utils/phaser-loading";
import GameLoadingScreen from "@/src/components/GameLoadingScreen";
import GameInfoContainer from "@/src/components/GameInfoContainer";
import SettingsContainer from "@/src/games/cowpoke/components/SettingsContainer";
import UpperHud from "@/src/games/cowpoke/components/UpperHud";
import GameControls from "@/src/games/cowpoke/components/GameControls";
import StartEndMenu from "@/src/games/cowpoke/components/StartEndMenu";
import GamePreventPortraitOrLandscapeMode from "@/src/components/GamePreventPortraitOrLandscapeMode";

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
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    document.body.classList.add("cowpoke-game-background");

    const loadPhaserGame = async () => {
      // eslint-disable-next-line no-restricted-syntax
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

        // eslint-disable-next-line no-restricted-syntax
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
    // 'app-mode' is necessary to prevent for example pinch-zooming on mobile
    // devices, which breaks things on games.
    <div id={"Prevent zoom"} className="app-mode">
      {/* UI */}
      <StartEndMenu />
      <SettingsContainer />
      <GameInfoContainer
        darkModeLight={true} // Want the black buttons this game! Since bkg is light.
        whiteBackground={true} // White bkg so that the dust etc. on the bkg gets covered
      >
        <div
          className="written-content-container"
          id={"info-window"}
          aria-label={`Page content for 'info-window'`}
        >
          <h1>Cowpoke</h1>
          <p>
            Follow&apos;n in the footsteps of Cowpoke Jack, you&apos;re
            headin&apos; out west to find your place in this here frontier one
            bandit at a time.
          </p>
          <p>
            Collect powerful Cowpoke artifacts and get stronger with each bandit
            you defeat.
          </p>
          <h2>How to Play</h2>
          <p>
            Each round, you must make two choices: an element (Rock, Paper, or
            Scissors) and a combat action (Attack, Defend, or Counter). Both
            choices are made using selection buttons that stop a moving slider
            bar.
          </p>
          <p>
            The closer you stop the slider bar to the green target bar, the
            higher your chance of winning that matchup. In other words, if you
            stop it close, the enemy is more likely to pick a move that lets you
            win the matchup.
          </p>
          <p>
            As the slider moves, a green box highlights the favored selection,
            which changes over time. Being favored gives that element or combat
            selection a damage bonus. For maximum damage, try to time your
            slider stop with the favored selection.
          </p>
          <h3>Element</h3>
          <p>
            Elements work like the classic Rock-Paper-Scissors game, with each
            element having a specific advantage over another. Winning an element
            matchup increases your damage, while losing decreases it.
          </p>
          <div
            className={`my-8 flex justify-center w-3/4 h-3/4 sm:w-1/2 sm:h-1/2`}
          >
            <Image
              src={"/webps/games/cowpoke-example-element-bar.webp"}
              alt={"Cowpoke Element Bar Example"}
              width={600}
              height={60}
              className="object-contain"
            />
          </div>
          <ul>
            <li>
              <b>Win element matchup</b>: Increased damage
            </li>
            <li>
              <b>Tie element matchup</b>: Base damage
            </li>
            <li>
              <b>Lose element matchup</b>: Decreased damage
            </li>
          </ul>
          <h3>Combat</h3>
          <p>
            Combat actions work similarly to elements, but with more nuanced
            matchups. The following table is read as &quot;your selection&quot;
            vs. &quot;enemy selection&quot;
          </p>
          <div
            className={`my-8 flex justify-center w-3/4 h-3/4 sm:w-1/2 sm:h-1/2`}
          >
            <Image
              src={"/webps/games/cowpoke-example-combat-bar.webp"}
              alt={"Cowpoke Combat Bar Example"}
              width={600}
              height={60}
              className="object-contain"
            />
          </div>
          <ul>
            <li>
              <b>Attack vs. Attack</b>: Both deal normal damage.
            </li>
            <li>
              <b>Attack vs. Defend</b>: Both deal less damage.
            </li>
            <li>
              <b>Attack vs. Counter</b>: Chance to deal no damage; enemy deals
              increased damage.
            </li>
            <li>
              <b>Defend vs. Attack</b>: Both deal less damage.
            </li>
            <li>
              <b>Defend vs. Defend</b>: No damage dealt.
            </li>
            <li>
              <b>Defend vs. Counter</b>: You deal normal damage; enemy deals no
              damage.
            </li>
            <li>
              <b>Counter vs. Attack</b>: You deal increased damage; enemy has a
              chance to deal no damage.
            </li>
            <li>
              <b>Counter vs. Defend</b>: You deal no damage; enemy deals normal
              damage.
            </li>
            <li>
              <b>Counter vs. Counter</b>: Both deal normal damage.
            </li>
          </ul>
          <p>
            For the optimal outcome, stop the slider bar close to the target and
            pick the favored element and combat action. Your choices determine
            who goes first and how much damage is dealt in each round.
          </p>
          <h2>Keyboard Shortcuts</h2>
          <p>In element mode:</p>
          <ul>
            <li>
              <b>1</b>: Select Rock
            </li>
            <li>
              <b>2</b>: Select Paper
            </li>
            <li>
              <b>3</b>: Select Scissors
            </li>
          </ul>
          <p>In combat mode:</p>
          <ul>
            <li>
              <b>1</b>: Select Attack
            </li>
            <li>
              <b>2</b>: Select Defend
            </li>
            <li>
              <b>3</b>: Select Counter
            </li>
          </ul>
        </div>
      </GameInfoContainer>
      <div className="relative p-5 flex flex-col gap-4 justify-center items-center">
        <UpperHud />
        <GameControls />
      </div>

      {/* Phaser Game Container */}
      <div className="absolute inset-0" id="phaser-game" />

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
    </div>
  );
};

export default GameComponent;
