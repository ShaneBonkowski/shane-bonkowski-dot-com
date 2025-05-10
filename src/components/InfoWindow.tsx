"use client";

import React from "react";
import PageContentLoader from "@/src/components/PageContentLoader";
import { ContentDataProps } from "@/src/types/data-props";
import { useEffect, useState } from "react";

interface InfoWindowProps {
  isVisible: boolean;
  onClose: () => void;
  infoData: ContentDataProps[];
}

const InfoWindow: React.FC<InfoWindowProps> = ({
  isVisible,
  onClose,
  infoData,
}) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-info-banner-bkg-color-light dark:bg-info-banner-bkg-color text-primary-text-color-light dark:text-primary-text-color z-50"
      id="info-window"
    >
      {/* Close Button */}
      <button
        className={`absolute top-4 right-4 text-lg font-bold text-primary-text-color-light dark:text-primary-text-color ${
          isHoverable
            ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
            : ""
        } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
        onClick={onClose}
      >
        X
      </button>

      {/* Content */}
      <PageContentLoader contentData={infoData} />
    </div>
  );
};

export default InfoWindow;
