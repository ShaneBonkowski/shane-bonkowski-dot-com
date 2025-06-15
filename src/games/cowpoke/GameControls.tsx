import React, { useState, useEffect } from "react";
import MovingSliderBar from "@/src/components/MovingSliderBar";

export default function GameControls() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="z-40 w-[55vw] fixed top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-8 p-2">
          {/* Description Text Container */}
          <div
            className="flex flex-col gap-2"
            id="desc-text-container"
            aria-label="Description Text"
          >
            <span>Strike First 50%</span>
            <span>Win Combat 33%</span>
            <span>Win Element 33%</span>
          </div>

          {/* Moving Slider Bar Container */}
          <div
            className="flex flex-col gap-2 w-[25vw]"
            id="slider-bar-container"
            aria-label="Slider Bars"
          >
            <MovingSliderBar />
            <MovingSliderBar />
            <MovingSliderBar />
          </div>

          {/* Inputs Container */}
          <div
            className="flex flex-col gap-2"
            id="inputs-container"
            aria-label="Inputs"
          >
            <button className="px-4 py-2 bg-gray-200 rounded">Input 1</button>
            <button className="px-4 py-2 bg-gray-200 rounded">Input 2</button>
            <button className="px-4 py-2 bg-gray-200 rounded">Input 3</button>
          </div>
        </div>
      )}
    </>
  );
}
