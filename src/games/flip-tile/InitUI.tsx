"use client";

import React, { useEffect, useState } from "react";
import {
  tileGridEventNames,
  TilePatternAttrs,
  difficulty,
  scoring,
} from "@/src/games/flip-tile/tile-constants.ts";
import { tiles } from "@/src/games/flip-tile/scenes/flip-tile-scene.ts";

interface ButtonProps {
  id: string;
  onClick: () => void;
  text: string;
  imgSrc: string;
  imgAlt: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  id,
  onClick,
  text,
  imgSrc,
  imgAlt,
  className,
}) => (
  <button
    id={id}
    onClick={onClick}
    className={`absolute w-3/4 h-4/5 border-none text-primary-color text-lg transform -translate-x-1/2 transition-transform duration-100 ease-in-out cursor-pointer pointer-events-auto ${className}`}
  >
    <img
      src={imgSrc}
      alt={imgAlt}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full transition-transform duration-100 ease-in-out"
    />
    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-secondary-color font-bold transition-transform duration-100 ease-in-out">
      {text}
    </span>
  </button>
);

interface SelectionBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({
  id,
  label,
  checked,
  onChange,
}) => (
  <div className="flex flex-col justify-end">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-1/2 h-1/2 cursor-pointer"
    />
    <label htmlFor={id} className="text-lg text-white text-center mb-1">
      {label}
    </label>
  </div>
);

const InfoBox: React.FC = () => (
  <div
    id="infoWindow"
    className="hidden absolute top-0 left-0 w-full h-full pointer-events-auto"
  >
    <div className="relative text-primary-color text-lg pointer-events-auto w-0 h-0">
      <h2>About Flip Tile</h2>
      <button
        onClick={() =>
          (document.getElementById("infoWindow")!.style.display = "none")
        }
        className="absolute cursor-pointer pointer-events-auto"
      >
        X
      </button>
    </div>
    <div className="absolute p-4 top-0 text-lg text-primary-color pointer-events-auto">
      <p>
        Inspired by the classic
        <a
          href="https://en.wikipedia.org/wiki/Lights_Out_(game)"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lights Out
        </a>{" "}
        game, Flip Tile brings a fresh twist to the familiar puzzle concept,
        offering three distinct levels of difficulty to challenge players of all
        skill levels.
        <br />
        <br />I created this game mostly as an exercise to re-learn linear
        algebra concepts. Watch{" "}
        <a
          href="https://www.youtube.com/watch?v=0fHkKcy0x_U"
          target="_blank"
          rel="noopener noreferrer"
        >
          Solving the `Lights Out` Problem
        </a>{" "}
        for more context on how linear algebra can be used to automatically
        solve this game!
      </p>
    </div>
  </div>
);

const InitUI: React.FC = () => {
  const [score, setScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(difficulty.EASY);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const handleScoreChange = () => {
      let scoreAdd = 0;
      if (TilePatternAttrs.difficultyLevel === difficulty.EASY) {
        scoreAdd = scoring.EASY;
      } else if (TilePatternAttrs.difficultyLevel === difficulty.HARD) {
        scoreAdd = scoring.HARD;
      } else if (TilePatternAttrs.difficultyLevel === difficulty.EXPERT) {
        scoreAdd = scoring.EXPERT;
      } else {
        console.error("ERROR: difficulty not listed");
      }
      setScore((prevScore) => prevScore + scoreAdd);
    };

    document.addEventListener(
      tileGridEventNames.onScoreChange,
      handleScoreChange
    );

    return () => {
      document.removeEventListener(
        tileGridEventNames.onScoreChange,
        handleScoreChange
      );
    };
  }, []);

  const updateTileGrid = () => {
    document.dispatchEvent(new Event(tileGridEventNames.onTilegridChange));
  };

  const resetTileGrid = () => {
    document.dispatchEvent(new Event(tileGridEventNames.onTilegridReset));
  };

  const toggleSolution = (checked: boolean) => {
    setShowSolution(checked);
    tiles.forEach((row) => {
      row.forEach((tile) => {
        if (checked) {
          tile.showText();
        } else {
          tile.hideText();
        }
      });
    });
  };

  return (
    <div>
      <InfoBox />
      <Button
        id="updateTilegridButton"
        onClick={updateTileGrid}
        text="Update Tilegrid"
        imgSrc="/webps/game-button.webp"
        imgAlt="Update Tilegrid Icon"
        className="fixed left-[6vw] bottom-[13vh]"
      />
      <Button
        id="resetTilegridButton"
        onClick={resetTileGrid}
        text="Reset Tilegrid"
        imgSrc="/webps/game-button.webp"
        imgAlt="Reset Tilegrid Icon"
        className="fixed left-[6vw] bottom-[30vh]"
      />
      <div className="fixed left-[12vw] bottom-[6vh] flex justify-start items-start">
        <SelectionBox
          id="input-box-1"
          label="Easy"
          checked={difficultyLevel === difficulty.EASY}
          onChange={(checked) => {
            if (checked) {
              setDifficultyLevel(difficulty.EASY);
              updateTileGrid();
            }
          }}
        />
        <SelectionBox
          id="input-box-2"
          label="Hard"
          checked={difficultyLevel === difficulty.HARD}
          onChange={(checked) => {
            if (checked) {
              setDifficultyLevel(difficulty.HARD);
              updateTileGrid();
            }
          }}
        />
        <SelectionBox
          id="input-box-3"
          label="Expert"
          checked={difficultyLevel === difficulty.EXPERT}
          onChange={(checked) => {
            if (checked) {
              setDifficultyLevel(difficulty.EXPERT);
              updateTileGrid();
            }
          }}
        />
      </div>
      <div className="fixed left-[12vw] bottom-[23vh] flex justify-start items-start">
        <SelectionBox
          id="sol-toggle-input"
          label="Reveal"
          checked={showSolution}
          onChange={toggleSolution}
        />
      </div>
      <div className="relative">
        <div
          id="ScoreText"
          className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-color text-6xl font-bold transition-transform duration-200 ease-in-out"
        >
          {score}
        </div>
      </div>
    </div>
  );
};

export default InitUI;
