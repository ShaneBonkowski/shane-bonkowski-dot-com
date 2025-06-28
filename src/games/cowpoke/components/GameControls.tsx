"use client";

import React, { useState, useEffect } from "react";
import {
  GiRock,
  GiPaper,
  GiScissors,
  GiCrossedSwords,
  GiShield,
  GiSprint,
} from "react-icons/gi";
import MovingSliderBar from "@/src/components/MovingSliderBar";
import GameIconButton from "@/src/components/GameIconButton";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";
import Feed from "@/src/games/cowpoke/components/Feed";

export default function GameControls() {
  const [isVisible, setIsVisible] = useState(true);
  const [elementDisabled, setElementDisabled] = useState(true);
  const [combatDisabled, setCombatDisabled] = useState(true);
  const { fastMode, favoredElement, favoredCombat } = UseGameData();

  const selectRock = () => {
    const event = new CustomEvent("selectElement", {
      detail: { type: "rock" },
    });
    document.dispatchEvent(event);
  };

  const selectPaper = () => {
    const event = new CustomEvent("selectElement", {
      detail: { type: "paper" },
    });
    document.dispatchEvent(event);
  };

  const selectScissors = () => {
    const event = new CustomEvent("selectElement", {
      detail: { type: "scissors" },
    });
    document.dispatchEvent(event);
  };

  const selectAttack = () => {
    const event = new CustomEvent("selectCombat", {
      detail: { type: "attack" },
    });
    document.dispatchEvent(event);
  };

  const selectDefend = () => {
    const event = new CustomEvent("selectCombat", {
      detail: { type: "defend" },
    });
    document.dispatchEvent(event);
  };

  const selectCounter = () => {
    const event = new CustomEvent("selectCombat", {
      detail: { type: "counter" },
    });
    document.dispatchEvent(event);
  };

  const handleStartMovingSlider = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.sliderId === "win-element") {
      setElementDisabled(false);
    } else if (customEvent.detail?.sliderId === "win-combat") {
      setCombatDisabled(false);
    }
  };

  const handleStopMovingSlider = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.sliderId === "win-element") {
      setElementDisabled(true);
    } else if (customEvent.detail?.sliderId === "win-combat") {
      setCombatDisabled(true);
    }
  };

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    const handleUiMenuOpen = () => setIsVisible(false);
    const handleUiMenuClose = () => setIsVisible(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!elementDisabled) {
        if (e.key === "1") {
          selectRock();
        } else if (e.key === "2") {
          selectPaper();
        } else if (e.key === "3") {
          selectScissors();
        }
      } else if (!combatDisabled) {
        if (e.key === "1") {
          selectAttack();
        } else if (e.key === "2") {
          selectDefend();
        } else if (e.key === "3") {
          selectCounter();
        }
      }
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    document.addEventListener("startMovingSlider", handleStartMovingSlider);
    document.addEventListener("stopMovingSlider", handleStopMovingSlider);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "startMovingSlider",
        handleStartMovingSlider
      );
      document.removeEventListener("stopMovingSlider", handleStopMovingSlider);
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [elementDisabled, combatDisabled]);

  return (
    <div
      className={`z-20 w-full max-w-[50vw] h-full flex flex-col justify-center gap-4 ${
        isVisible ? "" : "hidden"
      }`}
    >
      {/* Controls */}
      <div className="h-8 flex flex-row gap-4 justify-center items-stretch">
        <MovingSliderBar sliderId={"win-element"} speed={fastMode ? 2 : 1.25} />
        <div className="flex flex-row gap-4 items-center justify-center">
          <GameIconButton
            onPointerDown={selectRock}
            icon={<GiRock size={30} />}
            ariaLabel="Select Rock"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
            className={
              favoredElement === "rock" && !elementDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 1 for rock" // tooltip
          />
          <GameIconButton
            onPointerDown={selectPaper}
            icon={<GiPaper size={30} />}
            ariaLabel="Select Paper"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
            className={
              favoredElement === "paper" && !elementDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 2 for paper" // tooltip
          />
          <GameIconButton
            onPointerDown={selectScissors}
            icon={<GiScissors size={30} />}
            ariaLabel="Select Scissors"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
            className={
              favoredElement === "scissors" && !elementDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 3 for scissors" // tooltip
          />
        </div>
      </div>

      <div className="h-8 flex flex-row gap-4 justify-center items-stretch">
        <MovingSliderBar sliderId={"win-combat"} speed={fastMode ? 2 : 1.25} />
        <div className="flex flex-row gap-4 items-center justify-center">
          <GameIconButton
            onPointerDown={selectAttack}
            icon={<GiCrossedSwords size={30} />}
            ariaLabel="Select Attack"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
            className={
              favoredCombat === "attack" && !combatDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 1 to attack" // tooltip
          />
          <GameIconButton
            onPointerDown={selectDefend}
            icon={<GiShield size={30} />}
            ariaLabel="Select Defend"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
            className={
              favoredCombat === "defend" && !combatDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 2 to defend" // tooltip
          />
          <GameIconButton
            onPointerDown={selectCounter}
            icon={<GiSprint size={30} />}
            ariaLabel="Select Counter"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
            className={
              favoredCombat === "counter" && !combatDisabled
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }
            title="Shortcut: Press 3 to counter" // tooltip
          />
        </div>
      </div>

      {/* Feed */}
      <Feed heightClass="max-h-32" />
    </div>
  );
}
