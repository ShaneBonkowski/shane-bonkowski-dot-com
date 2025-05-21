import React, { useState, useEffect } from "react";
import { FaEye, FaRedo, FaThLarge } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";

// FIXME/TODO:
// - make all ui have correct styling for light dark mode etc.!!!
// - go through code and make sure theres not references to UI from the old game. Also things like events that dont occur anymore
// - I do not love the current design for the game logic. Right now there is a lot of querying of game components instead of using events to make changes.
// - Find a clean way to share a game state between the TS code and the react components (probably just stick w/ events and clean them up).

const UiOverlay: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const [score, setScore] = useState<number>(0);

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    document.dispatchEvent(new Event("difficultyChange"));
  };

  useEffect(() => {
    const handleScoreChange = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.score === "number") {
        setScore(event.detail.score);
      }
    };

    document.addEventListener(
      "scoreChange",
      handleScoreChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "scoreChange",
        handleScoreChange as EventListener
      );
    };
  }, []);

  return (
    <div id="ui-overlay" aria-label="Game UI Overlay">
      {/* Score Text */}
      <p
        id="score-display"
        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold"
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
          onPointerDown={() => console.log("Solution toggled")}
          icon={<FaEye size={30} />}
          ariaLabel="Toggle Solution Visibility"
        />

        {/* Tile Reset Button */}
        <GameIconButton
          onPointerDown={() => console.log("Tiles reset")}
          icon={<FaRedo size={30} />}
          ariaLabel="Reset Tiles"
        />

        {/* New Tile Layout Button */}
        <GameIconButton
          onPointerDown={() => console.log("New tile layout")}
          icon={<FaThLarge size={30} />}
          ariaLabel="Generate New Tile Layout"
        />

        {/* Difficulty Toggles */}
        <div
          id="difficulty-controls"
          className="flex flex-col gap-4"
          aria-label="Difficulty Selection"
        >
          {["easy", "medium", "hard"].map((difficulty) => (
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
