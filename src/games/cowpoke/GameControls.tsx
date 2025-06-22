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
import Feed from "@/src/games/cowpoke/Feed";
import { UseGameData } from "@/src/games/cowpoke/UseGameData";

export default function GameControls() {
  const [isVisible, setIsVisible] = useState(true);
  const [elementDisabled, setElementDisabled] = useState(true);
  const [combatDisabled, setCombatDisabled] = useState(true);
  const { favoredElement, favoredCombat } = UseGameData();

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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "startMovingSlider",
        handleStartMovingSlider
      );
      document.removeEventListener("stopMovingSlider", handleStopMovingSlider);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [elementDisabled, combatDisabled]);

  return (
    <div
      className={`z-20 w-[55vw] fixed top-[30vh] left-1/2 -translate-x-1/2 -translate-y-1/2 
        flex flex-col justify-center gap-4 p-4 h-[20vh] ${
          isVisible ? "" : "hidden"
        }`}
    >
      {/* Controls */}
      <div className="flex flex-row gap-4 justify-center">
        <MovingSliderBar sliderId={"win-element"}></MovingSliderBar>
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
            title="Shortcut: Press 1" // tooltip
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
            title="Shortcut: Press 2" // tooltip
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
            title="Shortcut: Press 3" // tooltip
          />
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center">
        <MovingSliderBar sliderId={"win-combat"}></MovingSliderBar>
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
            title="Shortcut: Press 1" // tooltip
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
            title="Shortcut: Press 2" // tooltip
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
            title="Shortcut: Press 3" // tooltip
          />
        </div>
      </div>

      {/* Feed */}
      <Feed></Feed>
    </div>
  );
}
