"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/src/games/perlin-noise/styles/game.css";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaPause,
  FaRobot,
  FaSearchPlus,
  FaLayerGroup,
} from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import { UseSettings } from "@/src/games/perlin-noise/components/UseSettings";

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    autoPlay,
    setAutoPlay,
    zSliceSliderValue,
    setZSliceSliderValue,
    walkSpeedSliderValue,
    setWalkSpeedSliderValue,
    zoomSliderValue,
    setZoomSliderValue,
  } = UseSettings();

  const handleToggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const handleZSliceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setZSliceSliderValue(newValue);
  };

  const handleWalkSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setWalkSpeedSliderValue(newValue);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setZoomSliderValue(newValue);
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
      <div className="flex flex-row items-center mx-auto gap-4">
        {/* Control buttons */}
        <div className="gap-1 grid grid-cols-3 grid-rows-3 mx-auto">
          <div /> {/* Empty Gap */}
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkUp"))
            }
            icon={<FaArrowUp size={30} />}
            ariaLabel="Walk Up"
            title="Walk Up"
          />
          <div /> {/* Empty Gap */}
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkLeft"))
            }
            icon={<FaArrowLeft size={30} />}
            ariaLabel="Walk Left"
            title="Walk Left"
          />
          <GameIconButton
            onPointerDown={handleToggleAutoPlay}
            icon={autoPlay ? <FaPause size={30} /> : <FaRobot size={30} />}
            ariaLabel="Toggle Auto Mode"
            title="Toggle Auto Mode"
          />
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkRight"))
            }
            icon={<FaArrowRight size={30} />}
            ariaLabel="Walk Right"
            title="Walk Right"
          />
          <div /> {/* Empty Gap */}
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkDown"))
            }
            icon={<FaArrowDown size={30} />}
            ariaLabel="Walk Down"
            title="Walk Down"
          />
          <div /> {/* Empty Gap */}
        </div>
        {/* Sliders */}
        <div className="flex flex-col items-center">
          {/* Z-slice slider */}
          <div className="z-20 flex flex-row items-center gap-4">
            {/* Make clickable area larger */}
            <div className="pt-4 pb-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={zSliceSliderValue}
                onChange={handleZSliceChange}
                className="z-20 pointer-events-auto"
              />
            </div>
            <FaLayerGroup
              size={30}
              className="text-primary-text-color-light dark:text-primary-text-color"
            />
          </div>
          {/* Speed slider */}
          <div className="z-20 flex flex-row items-center gap-4">
            {/* Make clickable area larger */}
            <div className="pt-4 pb-2">
              <input
                type="range"
                min={1} // no zero speed
                max={200}
                step={1}
                value={walkSpeedSliderValue}
                onChange={handleWalkSpeedChange}
                className="z-20 pointer-events-auto"
              />
            </div>
            <GiRabbit
              size={30}
              className="text-primary-text-color-light dark:text-primary-text-color"
            />
          </div>
          {/* Zoom slider */}
          <div className="z-20 flex flex-row items-center gap-4">
            {/* Make clickable area larger */}
            <div className="pt-4 pb-2">
              <input
                type="range"
                min={1} // no zero zoom
                max={200}
                step={1}
                value={zoomSliderValue}
                onChange={handleZoomChange}
                className="z-20 pointer-events-auto"
              />
            </div>
            <FaSearchPlus
              size={30}
              className="text-primary-text-color-light dark:text-primary-text-color"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiOverlay;
