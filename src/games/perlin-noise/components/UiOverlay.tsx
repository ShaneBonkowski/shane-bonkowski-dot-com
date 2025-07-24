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
import GameFakeIconButton from "@/src/components/GameFakeIconButton";
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
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    const handleUiMenuOpen = () => {
      setIsUiVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsUiVisible(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        document.dispatchEvent(new CustomEvent("perlinWalkUp"));
      } else if (e.key === "ArrowDown") {
        document.dispatchEvent(new CustomEvent("perlinWalkDown"));
      } else if (e.key === "ArrowLeft") {
        document.dispatchEvent(new CustomEvent("perlinWalkLeft"));
      } else if (e.key === "ArrowRight") {
        document.dispatchEvent(new CustomEvent("perlinWalkRight"));
      }
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("keydown", handleKeyDown);

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
            title="Shortcut: Arrow Key Up"
            lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
            blackShadow={true} // Use a black shadow for the button
          />
          <div /> {/* Empty Gap */}
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkLeft"))
            }
            icon={<FaArrowLeft size={30} />}
            ariaLabel="Walk Left"
            title="Shortcut: Arrow Key Left"
            lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
            blackShadow={true} // Use a black shadow for the button
          />
          <GameIconButton
            onPointerDown={handleToggleAutoPlay}
            icon={autoPlay ? <FaPause size={30} /> : <FaRobot size={30} />}
            ariaLabel="Toggle Auto Mode"
            title="Toggle Auto Mode"
            lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
            blackShadow={true} // Use a black shadow for the button
          />
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkRight"))
            }
            icon={<FaArrowRight size={30} />}
            ariaLabel="Walk Right"
            title="Shortcut: Arrow Key Right"
            lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
            blackShadow={true} // Use a black shadow for the button
          />
          <div /> {/* Empty Gap */}
          <GameIconButton
            onPointerDown={() =>
              document.dispatchEvent(new CustomEvent("perlinWalkDown"))
            }
            icon={<FaArrowDown size={30} />}
            ariaLabel="Walk Down"
            title="Shortcut: Arrow Key Down"
            lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
            blackShadow={true} // Use a black shadow for the button
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
            {/* Have the icon emulate a button so that it has the same padding etc. */}
            <GameFakeIconButton
              icon={
                <FaLayerGroup
                  size={30}
                  className="text-primary-text-color drop-shadow-black"
                />
              }
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
            {/* Have the icon emulate a button so that it has the same padding etc. */}
            <GameFakeIconButton
              icon={
                <GiRabbit
                  size={30}
                  className="text-primary-text-color drop-shadow-black"
                />
              }
            />
          </div>
          {/* Zoom slider */}
          <div className="z-20 flex flex-row items-center gap-4">
            {/* Make clickable area larger */}
            <div className="pt-4 pb-2">
              <input
                type="range"
                min={-50} // no zero zoom
                max={-1}
                step={1}
                value={zoomSliderValue}
                onChange={handleZoomChange}
                className="z-20 pointer-events-auto"
              />
            </div>
            {/* Have the icon emulate a button so that it has the same padding etc. */}
            <GameFakeIconButton
              icon={
                <FaSearchPlus
                  size={30}
                  className="text-primary-text-color drop-shadow-black"
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiOverlay;
