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

export default function GameControls() {
  const [isVisible, setIsVisible] = useState(true);
  const [elementDisabled, setElementDisabled] = useState(true);
  const [combatDisabled, setCombatDisabled] = useState(true);

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
        if (e.key === "4") {
          selectAttack();
        } else if (e.key === "5") {
          selectDefend();
        } else if (e.key === "6") {
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
        flex flex-col gap-4 p-4 h-[20vh] ${isVisible ? "" : "hidden"}`}
    >
      <div className="flex flex-row gap-4 items-center justify-center">
        <MovingSliderBar sliderId={"win-element"}></MovingSliderBar>
        <div
          className="flex flex-row gap-4 items-center justify-center"
          title="Shortcut: Press 1, 2, or 3" // tooltip
        >
          <GameIconButton
            onPointerDown={selectRock}
            icon={<GiRock size={30} />}
            ariaLabel="Select Rock"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
          />
          <GameIconButton
            onPointerDown={selectPaper}
            icon={<GiPaper size={30} />}
            ariaLabel="Select Paper"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
          />
          <GameIconButton
            onPointerDown={selectScissors}
            icon={<GiScissors size={30} />}
            ariaLabel="Select Scissors"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={elementDisabled}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-center">
        <MovingSliderBar sliderId={"win-combat"}></MovingSliderBar>
        <div
          className="flex flex-row gap-4 items-center justify-center"
          title="Shortcut: Press 4, 5, or 6" // tooltip
        >
          <GameIconButton
            onPointerDown={selectAttack}
            icon={<GiCrossedSwords size={30} />}
            ariaLabel="Select Attack"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
          />
          <GameIconButton
            onPointerDown={selectDefend}
            icon={<GiShield size={30} />}
            ariaLabel="Select Defend"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
          />
          <GameIconButton
            onPointerDown={selectCounter}
            icon={<GiSprint size={30} />}
            ariaLabel="Select Counter"
            darkModeLight={true} // Want the black buttons this game! Since bkg is light.
            disabled={combatDisabled}
          />
        </div>
      </div>
    </div>
  );
}
