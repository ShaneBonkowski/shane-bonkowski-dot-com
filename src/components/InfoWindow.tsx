"use client";

import React from "react";
import PageContentLoader from "@/src/components/PageContentLoader";
import { ContentDataProps } from "@/src/types/data-props";

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
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-info-banner-bkg-color-light dark:bg-info-banner-bkg-color text-primary-text-color-light dark:text-primary-text-color z-50"
      id="info-window"
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-lg font-bold"
        onClick={onClose}
      >
        X
      </button>

      {/* Content */}
      <PageContentLoader contentData={infoData} />
      {/* <div className="flex flex-col items-start justify-start h-full ml-common-ml mr-common-ml sm:px-common-p-sm text-left">
        <div className="space-y-4">{children}</div>
      </div> */}
    </div>
  );
};

export default InfoWindow;
