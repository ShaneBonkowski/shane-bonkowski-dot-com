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
  FaMagic,
  FaDizzy,
  FaMountain,
} from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import GameFakeIconButton from "@/src/components/GameFakeIconButton";
import GameToggleIcon from "@/src/components/GameToggleIcon";
import { UseSettings } from "@/src/games/perlin-noise/components/UseSettings";
import {
  ZOOM_SLIDER_MIN,
  ZOOM_SLIDER_MAX,
} from "@/src/games/perlin-noise/settings-store";

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    autoPlay,
    setAutoPlay,
    discoMode,
    setDiscoMode,
    trippyMode,
    setTrippyMode,
    randomGenMode,
    setRandomGenMode,
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
      const target = e.target;
      if (
        target &&
        "tagName" in target &&
        typeof target.tagName === "string" &&
        (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
          ("isContentEditable" in target && target.isContentEditable))
      )
        return;
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
      className={`z-20 pointer-events-none fixed bottom-16 sm:bottom-3 w-full flex flex-col gap-1 ${
        isUiVisible ? "" : "hidden"
      }`}
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Controls */}
      <div className="flex flex-row items-center mx-auto gap-1 sm:gap-4 landscape:w-full landscape:justify-between landscape:px-20">
        <div className="flex flex-row items-center gap-1 sm:gap-4">
          <div className="flex flex-col">
            <GameIconButton
              onPointerDown={() => setDiscoMode(!discoMode)}
              icon={
                <GameToggleIcon
                  icon={<FaMagic size={30} />}
                  isActive={discoMode}
                />
              }
              ariaLabel={
                discoMode ? "Turn off Disco Mode" : "Turn on Disco Mode"
              }
              ariaPressed={discoMode}
              title="Toggle Disco Mode"
              lightModeDark={true}
              blackShadow={true}
            />
            <GameIconButton
              onPointerDown={() => setTrippyMode(!trippyMode)}
              icon={
                <GameToggleIcon
                  icon={<FaDizzy size={30} />}
                  isActive={trippyMode}
                />
              }
              ariaLabel={
                trippyMode ? "Turn off Trippy Mode" : "Turn on Trippy Mode"
              }
              ariaPressed={trippyMode}
              title="Toggle Trippy Mode"
              lightModeDark={true}
              blackShadow={true}
            />
            <GameIconButton
              onPointerDown={() => setRandomGenMode(!randomGenMode)}
              icon={
                <GameToggleIcon
                  icon={<FaMountain size={30} />}
                  isActive={randomGenMode}
                />
              }
              ariaLabel={
                randomGenMode
                  ? "Turn off RandomGen Mode"
                  : "Turn on RandomGen Mode"
              }
              ariaPressed={randomGenMode}
              title="Toggle RandomGen Mode"
              lightModeDark={true}
              blackShadow={true}
            />
          </div>
          {/* Control buttons */}
          <div className="gap-0 sm:gap-1 grid grid-cols-3 grid-rows-3 mx-auto">
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
        </div>
        {/* Sliders */}
        <div className="w-[35vw] max-w-[26rem] flex flex-col items-center landscape:items-end">
          {/* Z-slice slider */}
          <div className="z-20 flex flex-row items-center gap-4">
            {/* Make clickable area larger */}
            <div className="w-full pt-4 pb-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={zSliceSliderValue}
                onChange={handleZSliceChange}
                aria-label="Z-slice"
                className="game-interactive-control z-20 w-full pointer-events-auto"
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
            <div className="w-full pt-4 pb-2">
              <input
                type="range"
                min={1} // no zero speed
                max={200}
                step={1}
                value={walkSpeedSliderValue}
                onChange={handleWalkSpeedChange}
                className="game-interactive-control z-20 w-full pointer-events-auto"
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
            <div className="w-full pt-4 pb-2">
              <input
                type="range"
                min={ZOOM_SLIDER_MIN} // no zero zoom
                max={ZOOM_SLIDER_MAX}
                step={1}
                value={zoomSliderValue}
                onChange={handleZoomChange}
                className="game-interactive-control z-20 w-full pointer-events-auto"
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
