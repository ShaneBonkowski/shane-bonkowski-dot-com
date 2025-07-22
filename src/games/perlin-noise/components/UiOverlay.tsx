"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/src/games/perlin-noise/styles/game.css";
import {
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaHandPointer,
  FaRobot,
} from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import { UseSettings } from "@/src/games/perlin-noise/components/UseSettings";

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { autoPlay, setAutoPlay } = UseSettings();

  const handleToggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
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

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    // z-20 so that its behind z-30 windows, but above mostly everything else
    <div
      className={`z-20 pointer-events-none fixed bottom-3 w-full flex flex-col gap-1 ${
        isUiVisible ? "" : "hidden"
      }`}
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Controls */}
      <div className="pointer-events-none gap-1 flex flex-row justify-center">
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinZoomOut"))
          }
          icon={<FaMinus size={30} />}
          ariaLabel="Zoom Out"
          title="Zoom Out"
        />
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinZoomIn"))
          }
          icon={<FaPlus size={30} />}
          ariaLabel="Zoom In"
          title="Zoom In"
        />
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinWalkLeft"))
          }
          icon={<FaArrowLeft size={30} />}
          ariaLabel="Walk Left"
          title="Walk Left"
        />
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinWalkRight"))
          }
          icon={<FaArrowRight size={30} />}
          ariaLabel="Walk Right"
          title="Walk Right"
        />
        <GameIconButton
          onPointerDown={handleToggleAutoPlay}
          icon={autoPlay ? <FaHandPointer size={30} /> : <FaRobot size={30} />}
          ariaLabel="Toggle Auto Mode"
          title="Toggle Auto Mode"
        />
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinWalkUp"))
          }
          icon={<FaArrowUp size={30} />}
          ariaLabel="Walk Up"
          title="Walk Up"
        />
        <GameIconButton
          onPointerDown={() =>
            document.dispatchEvent(new CustomEvent("perlinWalkDown"))
          }
          icon={<FaArrowDown size={30} />}
          ariaLabel="Walk Down"
          title="Walk Down"
        />
      </div>
    </div>
  );
};

export default UiOverlay;
