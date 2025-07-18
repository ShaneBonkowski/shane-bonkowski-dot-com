"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaRedo,
  FaThLarge,
  FaRegStar,
  FaStarHalfAlt,
  FaStar,
} from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import "@/src/games/flip-tile/styles/game.css";
import { UseGameData } from "@/src/games/flip-tile/components/UseGameData";

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { score, solutionRevealed } = UseGameData();
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const handleScoreChange = () => {
    // Trigger the pulse effect, and remove it after 500ms
    // which is the same duration as the CSS animation
    setIsPulsing(true);
    timeoutRef.current = setTimeout(() => {
      setIsPulsing(false);
    }, 500);
  };

  const handleToggleSolution = () => {
    const newState = !solutionRevealed;

    document.dispatchEvent(
      new CustomEvent("toggleSolution", {
        detail: { state: newState ? "on" : "off" },
      })
    );
  };

  const handleDifficultyChange = (difficulty: string) => {
    document.dispatchEvent(
      new CustomEvent("difficultyChange", { detail: { difficulty } })
    );
  };

  const handleResetTilePattern = () => {
    document.dispatchEvent(new CustomEvent("resetTilePattern"));
  };

  const handleNewTilePattern = () => {
    document.dispatchEvent(new CustomEvent("newTilePattern"));
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsUiVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsUiVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    document.addEventListener(
      "scoreChange",
      handleScoreChange as EventListener
    );

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);

      document.removeEventListener(
        "scoreChange",
        handleScoreChange as EventListener
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    // z-20 so that its behind z-30 windows, but above mostly everything else
    <div
      className={`z-20 ${isUiVisible ? "" : "hidden"}`}
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Score Text */}
      <div
        id="score-display-container"
        className="fixed pointer-events-none top-[12vh] landscape:top-5 w-full flex justify-center items-center"
      >
        <p
          id="score-display"
          className={`mt-4 pointer-events-auto font-bold text-5xl sm:6xl ${
            isPulsing ? "flip-tile-pulse" : ""
          }`}
          aria-live="polite"
        >
          {score}
        </p>
      </div>

      {/* Buttons and Toggles */}
      <div
        id="tile-buttons"
        className="z-20 pointer-events-none w-full fixed bottom-3 gap-1 flex flex-row justify-center"
        aria-label="Tile Buttons"
      >
        {/* Solution Toggle Button */}
        <GameIconButton
          onPointerDown={handleToggleSolution}
          icon={
            solutionRevealed ? <FaEyeSlash size={30} /> : <FaEye size={30} />
          }
          ariaLabel="Toggle Solution"
          title="Toggle Solution"
        />

        {/* Tile Reset Button */}
        <GameIconButton
          onPointerDown={handleResetTilePattern}
          icon={<FaRedo size={30} />}
          ariaLabel="Reset Tiles"
          title="Reset Tiles"
        />

        {/* New Tile Layout Button */}
        <GameIconButton
          onPointerDown={handleNewTilePattern}
          icon={<FaThLarge size={30} />}
          ariaLabel="New Tile Layout"
          title="New Tile Layout"
        />
      </div>

      {/* Difficulty Toggles */}
      <div
        id="difficulty-controls"
        className="z-20 fixed bottom-3 left-3 flex flex-col gap-1"
        aria-label="Difficulty Selection"
      >
        {[
          { difficulty: "expert", icon: <FaStar size={30} /> },
          { difficulty: "hard", icon: <FaStarHalfAlt size={30} /> },
          { difficulty: "easy", icon: <FaRegStar size={30} /> },
        ].map(({ difficulty, icon }) => (
          <GameIconButton
            key={difficulty}
            onPointerDown={() => handleDifficultyChange(difficulty)}
            icon={icon}
            ariaLabel={`Select ${difficulty} difficulty`}
            title={`Select ${difficulty} difficulty`}
          />
        ))}
      </div>
    </div>
  );
};

export default UiOverlay;
