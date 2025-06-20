"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";

const StartEndMenu: React.FC = () => {
  const [nameProvided, setNameProvided] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [menuType, setMenuType] = useState<"start" | "end">("start");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleStartLoadingGame = useCallback(() => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      // Update the selected name in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cowpokePlayerName", nameProvided);
      }

      // Tell the main-game-scene to start loading the game
      document.dispatchEvent(new CustomEvent("startLoadingGame"));
    }, 150);
  }, [nameProvided]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Start game if Enter is pressed and the menu is visible
      if (e.key === "Enter" && isVisible) {
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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [handleStartLoadingGame, isVisible]);

  // Get playthrough stats from localStorage
  const levelThisPlaythrough =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeLevelThisPlaythrough")
      : 0;

  const killsThisPlaythrough =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeKillsThisPlaythrough")
      : 0;

  // Get lifetime stats from localStorage
  const furthestLevelLifetime =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeFurthestLevel")
      : 0;

  const killsLifetime =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeTotalKills")
      : 0;

  return (
    <>
      {/* --- Background Image --- */}
      {isVisible && (
        <div className="z-0 absolute inset-0 w-full h-full pointer-events-none">
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
          {/* Cowpoke stats only show on end screen */}
          {menuType === "end" && (
            <>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Level:</b> {levelThisPlaythrough}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Kills:</b> {killsThisPlaythrough}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Lifetime Highest Level:</b> {furthestLevelLifetime}
              </p>
              <p className="text-center text-primary-text-color-light dark:text-primary-text-color-light">
                <b>Lifetime Total Kills:</b> {killsLifetime}
              </p>
            </>
          )}
        </div>

        {/* Input + Start Loading Game Button */}
        <div
          className="fixed bottom-5 right-5 flex flex-row gap-4 items-center"
          title="Shortcut: Press Enter to begin" // tooltip
        >
          <input
            type="text"
            placeholder="Yer name here..."
            value={nameProvided}
            onChange={(e) => setNameProvided(e.target.value)}
            maxLength={10}
            className="p-2 text-small flex-grow bg-white dark:bg-white border-2 border-black text-primary-text-color-light focus:outline-none placeholder:text-secondary-text-color-light"
            aria-label="Player name input"
          />
          <GameIconButton
            onPointerDown={handleStartLoadingGame}
            icon={<FaPlay size={25} />}
            ariaLabel="Cowpoke Start Loading Game"
            className={""}
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
          />
        </div>
      </GameUiWindow>
    </>
  );
};

export default StartEndMenu;
