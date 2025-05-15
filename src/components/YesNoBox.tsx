"use client";

import React from "react";
import { useEffect, useState } from "react";

interface YesNoBoxProps {
  children: React.ReactNode;
  yesButtonText: string;
  noButtonText: string;
  onYes: () => void;
  onNo: () => void;
  id?: string;
  bottomRight?: boolean;
}

const YesNoBox: React.FC<YesNoBoxProps> = ({
  children,
  yesButtonText,
  noButtonText,
  onYes,
  onNo,
  id = "yes-no-box",
  bottomRight = false,
}) => {
  /* Only allow hover on hover-supported devices */
  const [isHoverable, setIsHoverable] = useState(false);

  const handleYesClick = (e: React.PointerEvent) => {
    // prevent the click event from bubbling up to the parent element(s) and beyond
    e.stopPropagation();
    onYes();
  };

  const handleNoClick = (e: React.PointerEvent) => {
    // prevent the click event from bubbling up to the parent element(s) and beyond
    e.stopPropagation();
    onNo();
  };

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <div
      className={`fixed ${
        bottomRight ? "bottom-0 right-0" : "bottom-0 left-0 right-0"
      } bg-info-banner-bkg-color-light dark:bg-info-banner-bkg-color text-body text-primary-text-color-light dark:text-primary-text-color p-common-p sm:p-common-p-sm z-50 ${
        bottomRight ? "w-full sm:w-auto" : "w-full"
      } pointer-events-none`}
      id={id}
    >
      <div
        className={`flex flex-col gap-x-4 sm:flex-row justify-between items-center pointer-events-auto`}
      >
        <div>{children}</div>
        <div className="flex justify-center sm:justify-end space-x-2">
          <button
            onPointerDown={handleYesClick}
            className={`bg-button-color-light dark:bg-button-color text-body px-6 py-2 rounded ${
              isHoverable
                ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
                : ""
            } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color pointer-events-auto`}
          >
            {yesButtonText}
          </button>
          <button
            onPointerDown={handleNoClick}
            className={`bg-button-color-light dark:bg-button-color text-body px-6 py-2 rounded ${
              isHoverable
                ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
                : ""
            } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color pointer-events-auto`}
          >
            {noButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoBox;
