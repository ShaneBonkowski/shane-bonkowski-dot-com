import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaRedo, FaThLarge } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import "@/src/games/flip-tile/styles/game.css";

// FIXME/TODO:
// - make all ui have correct styling for light dark mode etc.!!!

const UiOverlay: React.FC = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSolutionVisible, setIsSolutionVisible] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const [score, setScore] = useState<number>(0);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const handleScoreChange = (event: CustomEvent) => {
    if (event.detail && typeof event.detail.score === "number") {
      setScore(event.detail.score);

      // Trigger the pulse effect, and remove it after 500ms
      // which is the same duration as the CSS animation
      setIsPulsing(true);
      timeoutRef.current = setTimeout(() => {
        setIsPulsing(false);
      }, 500);
    }
  };

  const handleToggleSolution = () => {
    const newState = !isSolutionVisible;
    setIsSolutionVisible(newState);

    document.dispatchEvent(
      new CustomEvent("toggleSolution", {
        detail: { state: newState ? "on" : "off" },
      })
    );
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
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
    const handleOverrideToggleSolutionOff = () => {
      setIsSolutionVisible(false);
    };

    document.addEventListener(
      "overrideToggleSolutionOff",
      handleOverrideToggleSolutionOff
    );

    document.addEventListener(
      "scoreChange",
      handleScoreChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "overrideToggleSolutionOff",
        handleOverrideToggleSolutionOff
      );

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
    <div id="ui-overlay" aria-label="Game UI Overlay">
      {/* Score Text */}
      <p
        id="score-display"
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold ${
          isPulsing ? "pulse" : ""
        }`}
        aria-live="polite"
      >
        Score: {score}
      </p>

      {/* Buttons and Toggles */}
      <div
        id="controls"
        className="absolute bottom-4 left-4 flex flex-col gap-4"
        aria-label="Game Controls"
      >
        {/* Solution Toggle Button */}
        <GameIconButton
          onPointerDown={handleToggleSolution}
          icon={
            isSolutionVisible ? <FaEyeSlash size={30} /> : <FaEye size={30} />
          }
          ariaLabel="Toggle Solution Visibility"
        />

        {/* Tile Reset Button */}
        <GameIconButton
          onPointerDown={handleResetTilePattern}
          icon={<FaRedo size={30} />}
          ariaLabel="Reset Tiles"
        />

        {/* New Tile Layout Button */}
        <GameIconButton
          onPointerDown={handleNewTilePattern}
          icon={<FaThLarge size={30} />}
          ariaLabel="Generate New Tile Layout"
        />

        {/* Difficulty Toggles */}
        <div
          id="difficulty-controls"
          className="flex flex-col gap-4"
          aria-label="Difficulty Selection"
        >
          {["easy", "hard", "expert"].map((difficulty) => (
            <label
              key={difficulty}
              className="flex items-center gap-4"
              htmlFor={`difficulty-${difficulty}`}
            >
              <input
                id={`difficulty-${difficulty}`}
                type="radio"
                name="difficulty"
                value={difficulty}
                checked={selectedDifficulty === difficulty}
                onChange={() => handleDifficultyChange(difficulty)}
                aria-label={`Select ${difficulty} difficulty`}
              />
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UiOverlay;
