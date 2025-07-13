"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaPlay, FaRedo } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";
import YesNoBox from "@/src/components/YesNoBox";
import { isMobileDevice } from "@/src/utils/heuristics";

const StartEndMenu: React.FC = () => {
  const {
    playerName,
    playerLevel,
    playerKills,
    lifetimeFurthestLevelInPlaythrough,
    lifetimeMostKillsInPlaythrough,
    lifetimeKills,
    autoRestart,
    setPlayerName,
    setAutoRestart,
    resetPermanentData,
  } = UseGameData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPlayerName, setLocalPlayerName] = useState(playerName);
  const [isVisible, setIsVisible] = useState(false);
  const [resetStatsVisible, setResetStatsVisible] = useState(false);
  const [menuType, setMenuType] = useState<"start" | "end">("start");
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRestartIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(0);

  const openWindow = (event?: Event) => {
    // Get menu type from event detail if present
    let type: "start" | "end" = "start";
    if (event && "detail" in event && (event as CustomEvent).detail?.type) {
      type = (event as CustomEvent).detail.type;
    }
    setMenuType(type);

    // No delay needed since this menu is not opened by a direct button click
    setIsVisible(true);
    dispatchMenuEvent("Start/End", "open");

    // Manually override the header visibility, since openning a menu hides it typically
    document.dispatchEvent(new CustomEvent("manualRevealHeader"));
  };

  const closeWindow = () => {
    // No delay needed since this menu is not opened by a direct button click
    setIsVisible(false);
    dispatchMenuEvent("Start/End", "close");
  };

  const startLoadingGame = () => {
    document.dispatchEvent(new CustomEvent("startLoadingGame"));
  };

  const handleStartLoadingGame = useCallback(() => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    delayTimeoutRef.current = setTimeout(() => {
      // Clean up the player name before loading the game..
      // Do this here instead of in the input change handler
      // so that the name is only cleaned on submit.
      let cleanedName = localPlayerName.trim();
      if (cleanedName.length > 10) {
        cleanedName = cleanedName.slice(0, 10);
      }

      if (cleanedName.trim() === "") {
        cleanedName = "Shaner";
      }

      // Update the player name in the game data store
      setPlayerName(cleanedName);

      // Tell the main-game-scene to start loading the game
      startLoadingGame();
    }, 150);
  }, [localPlayerName, setPlayerName]);

  const handleTryToResetStats = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    delayTimeoutRef.current = setTimeout(() => {
      setResetStatsVisible(true);
    }, 150);
  };

  const onYesReset = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    delayTimeoutRef.current = setTimeout(() => {
      setResetStatsVisible(false);

      // Reset the lifetime stats and permanent upgrades
      resetPermanentData();
    }, 150);
  };

  const onNoReset = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    delayTimeoutRef.current = setTimeout(() => {
      setResetStatsVisible(false);
    }, 150);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Start game if Enter is pressed and the menu is visible. Do NOT do this
      // if on mobile, since there is a weird visual bug that can happen when
      // the game starts loading w/ keyboard visible
      // (https://github.com/ShaneBonkowski/shane-bonkowski-dot-com/issues/179).
      // NOTE: checking isMobileDevice() here instead of mobileVirtualKeyboardLikelyOpen()
      // because the latter can be inconsistent with timing since the input hides
      // the keyboard on "enter".
      if (e.key === "Enter" && isVisible && !isMobileDevice()) {
        handleStartLoadingGame();
      }
    };

    document.addEventListener("openStartEndMenu", openWindow);
    document.addEventListener("gameStarted", closeWindow); // Close the menu when the game actually starts.. aka is fully loaded
    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("openStartEndMenu", openWindow);
      document.removeEventListener("gameStarted", closeWindow);
      document.removeEventListener("keydown", handleGlobalKeyDown);

      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
    };
  }, [handleStartLoadingGame, isVisible]);

  useEffect(() => {
    // Start counting down to auto-restart if enabled and on end menu
    if (menuType === "end" && autoRestart && isVisible) {
      let count = 3;
      setCountdown(count);

      // 3... 2... 1...
      autoRestartIntervalRef.current = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
        } else {
          setCountdown(0);
          startLoadingGame();
        }
      }, 1000);
    } else {
      setCountdown(0);

      // Reset interval countdown if e.g. auto-restart is turned off or menu
      // is closed
      if (autoRestartIntervalRef.current) {
        clearInterval(autoRestartIntervalRef.current);
        autoRestartIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRestartIntervalRef.current) {
        clearInterval(autoRestartIntervalRef.current);
        autoRestartIntervalRef.current = null;
      }
    };
  }, [menuType, autoRestart, isVisible]);

  return (
    <>
      {/* --- Background Image --- */}
      {isVisible && (
        <div className="app-mode z-0 absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/webps/games/cowpoke-bkg-for-menu.webp"
            alt=""
            fill
            className="object-cover absolute inset-0"
            draggable={false}
            aria-hidden="true"
            priority
          />
        </div>
      )}

      {/* --- Start/End Menu Window Content --- */}
      <GameUiWindow
        isVisible={isVisible}
        onClose={null}
        overrideBgColor="bg-white dark:bg-white bg-opacity-75 dark:bg-opacity-75"
        overrideTextColor="text-primary-text-color-light dark:text-primary-text-color-light"
      >
        {/* Info / Stats / etc. */}
        {/* Title and description */}
        <div className="flex flex-col items-center justify-center w-full max-w-[60vw] mx-auto">
          <h1 className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
            {menuType === "end" ? "Game Over" : "Howdy, Partner"}
          </h1>
          <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
            {menuType === "end"
              ? `Ain't no reason not to try again, friend! Dust yerself off and give it another go. 
              Press "Enter" or that play button down there in the corner if you wanna get back on that horse.`
              : `It's yer pal Cowpoke Jack talkin'. Hope yer ready to follow in my footsteps 'n set out West.
      Go'n remind me what's yer name, then press "Enter" or that play button down there in the corner to git started.`}
          </p>
          {/* Player name input only shows on start screen */}
          {menuType === "start" && (
            // eslint-disable-next-line no-restricted-syntax
            <input
              type="text"
              ref={inputRef}
              placeholder="Yer name here..."
              value={localPlayerName}
              onChange={(e) => setLocalPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // On mobile, we want to prevent the default behavior of the Enter
                  // key which may submit a form or cause unwanted side effects.
                  if (isMobileDevice()) {
                    e.preventDefault();
                    inputRef.current?.blur(); // Hide keyboard
                  }
                }
              }}
              maxLength={10}
              className="p-2 flex-grow bg-white dark:bg-white border-2 border-black text-primary-text-color-light focus:outline-none placeholder:text-secondary-text-color-light"
              style={{ fontSize: "16px" }} // Font size >= 16px on mobile prevents zooming
              aria-label="Player name input"
            />
          )}
          {/* Cowpoke stats etc. only show on end screen */}
          {menuType === "end" && (
            <>
              {/* Auto-restart checkbox */}
              <div className="flex items-center justify-center mb-4">
                {/* Make clickable area larger */}
                <div className="px-4">
                  <input
                    type="checkbox"
                    checked={autoRestart}
                    onChange={(e) => setAutoRestart(e.target.checked)}
                    className="accent-red-500"
                  />
                </div>
                <label className="cursor-pointer text-primary-text-color-light dark:text-primary-text-color-light">
                  {countdown > 0 ? (
                    <span className="text-red-500 font-bold">
                      Auto-restart in {countdown}...
                    </span>
                  ) : (
                    "Auto-restart"
                  )}
                </label>
              </div>
              {/* Stats */}
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Playthrough Level:</b> {playerLevel}
                {playerLevel >= lifetimeFurthestLevelInPlaythrough &&
                  playerLevel != 0 && (
                    <span className="text-red-500 font-bold ml-2">
                      NEW RECORD!
                    </span>
                  )}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Playthrough Kills:</b> {playerKills}
                {playerKills >= lifetimeMostKillsInPlaythrough &&
                  playerKills != 0 && (
                    <span className="text-red-500 font-bold ml-2">
                      NEW RECORD!
                    </span>
                  )}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Lifetime Highest Level Reached:</b>{" "}
                {lifetimeFurthestLevelInPlaythrough}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Lifetime Most Kills in a Playthrough:</b>{" "}
                {lifetimeMostKillsInPlaythrough}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Lifetime Total Kills:</b> {lifetimeKills}
              </p>
            </>
          )}
        </div>

        {/* Start Loading Game Button */}
        <GameIconButton
          onPointerDown={handleStartLoadingGame}
          icon={<FaPlay size={25} />}
          ariaLabel="Start Loading Game"
          title="Shortcut: Press Enter to begin" // tooltip
          className={"fixed bottom-3 right-3"}
          darkModeLight={true} // Want the black buttons this game! Since bkg is light.
        />

        {/* Reset Lifetime Stats Button */}
        <GameIconButton
          onPointerDown={handleTryToResetStats}
          icon={<FaRedo size={30} />}
          ariaLabel="Reset Lifetime Stats"
          darkModeLight={true} // Want the black buttons this game! Since bkg is light.
          className={`fixed bottom-3 left-3`}
          title="Reset Lifetime Stats"
        />
      </GameUiWindow>

      {/* Reset Stats Popup */}
      {resetStatsVisible && (
        <YesNoBox
          yesButtonText="Reset"
          noButtonText="Cancel"
          onYes={onYesReset}
          onNo={onNoReset}
          id="reset-lifetime-stats"
        >
          <p className="text-left py-2 my-0">
            Are you sure you want to reset your lifetime stats, perma upgrades
            and loot? This action cannot be undone.
          </p>
        </YesNoBox>
      )}
    </>
  );
};

export default StartEndMenu;
