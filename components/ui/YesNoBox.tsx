import React from "react";

import { YesNoBoxProps } from "@/types/YesNoBox";

const YesNoBox: React.FC<YesNoBoxProps> = ({
  children,
  yesButtonText,
  noButtonText,
  onYes,
  onNo,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-info-banner-bkg-color text-body text-primary-text-color p-4 flex justify-between items-center z-50">
      <div className="flex-1">{children}</div>
      <div className="flex space-x-4">
        <button
          onClick={onYes}
          className="bg-button-color px-4 py-2 rounded hover:bg-secondary-hover-color"
        >
          {yesButtonText}
        </button>
        <button
          onClick={onNo}
          className="bg-button-color px-4 py-2 rounded hover:bg-secondary-hover-color"
        >
          {noButtonText}
        </button>
      </div>
    </div>
  );
};

export default YesNoBox;
