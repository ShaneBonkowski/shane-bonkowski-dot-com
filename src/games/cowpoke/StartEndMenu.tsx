"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";

// FIXME: Add some game art maybe? Make it look nice

const StartEndMenu: React.FC = () => {
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

    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    dispatchMenuEvent("Start/End", "open");
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);

    dispatchMenuEvent("Start/End", "close");
  };

  const handleStartLoadingGame = () => {
    // Tell the main-game-scene to start loading the game
    document.dispatchEvent(new CustomEvent("startLoadingGame"));
  };

  useEffect(() => {
    document.addEventListener("openStartEndMenu", openWindow);
    document.addEventListener("gameStarted", closeWindow); // Close the menu when the game starts

    return () => {
      document.removeEventListener("openStartEndMenu", openWindow);
      document.removeEventListener("gameStarted", closeWindow);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const totalKills =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeTotalKills")
      : 0;
  const furthestRound =
    typeof window !== "undefined"
      ? localStorage.getItem("cowpokeFurthestRound")
      : 0;

  return (
    <>
      {/* --- Background Image --- */}
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

      {/* --- Start/End Menu Window Content --- */}
      <GameUiWindow
        isVisible={isVisible}
        onClose={null}
        overrideBgColor="bg-transparent dark:bg-transparent"
        overrideTextColor="text-black dark:text-black"
      >
        <div className="w-full h-full p-4" id="cowpoke-start-container">
          {/* Top Section: Info */}
          <div className="p-2" id="cowpoke-start-description">
            <div className="flex flex-col items-center">
              <h1 className="text-center my-0 text-black dark:text-black">
                {menuType === "end" ? "Game Over" : "Cowpoke"}
              </h1>
              <p className="text-center mb-0 text-black dark:text-black">
                FIXME... add start menu instructions
              </p>
              {(furthestRound || totalKills) && (
                <div className="mt-4 text-center">
                  {totalKills && (
                    <div className="text-black dark:text-black">
                      <b>Total Kills:</b> {totalKills}
                    </div>
                  )}
                  {furthestRound && (
                    <div className="text-black dark:text-black">
                      <b>Furthest Round Achieved:</b> {furthestRound}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Bottom Section: Start/End Game Button */}
          <GameIconButton
            onPointerDown={handleStartLoadingGame}
            icon={<FaPlay size={30} />}
            ariaLabel="Cowpoke Start/End Menu"
            className={"fixed bottom-5 right-5"}
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            whiteBackground={true} // White bkg so that the dust etc. on the bkg gets covered
          />
        </div>
      </GameUiWindow>
    </>
  );
};

export default StartEndMenu;
